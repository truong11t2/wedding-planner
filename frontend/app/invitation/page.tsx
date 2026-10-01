'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
	invitationTemplates,
	defaultInvitationTemplate
} from '@/data/invitationTemplates';
import { getInvitationConfig, getInvitationConfigFeatures } from '@/data/invitationConfigs';
import { useAuth } from '@/context/AuthContext';
import {
	generateInvitation,
	deleteGuestLink,
	getMyInvitation,
	renderInvitationPreview,
	MAX_GALLERY_IMAGES,
	type InvitationConfig,
	type InvitationPhotos,
	type InvitationScheduleItem,
	type InvitationStoryItem,
	type MyInvitation,
	InvitationCeremony,
	InvitationParent
} from '@/api/invitation';
import { BACKEND_ORIGIN } from '@/api/config';
import { usePhotoLibrary } from '@/lib/usePhotoLibrary';
import Input from '@/components/invitation/Input';
import Select from '@/components/invitation/Select';
import Preview from '@/components/invitation/Preview';
import Share from '@/components/invitation/Share';
import Toast from '@/components/common/Toast';



const defaultTemplate = defaultInvitationTemplate;

/**
 * The four builder steps. Each one is also its own anchor (`#select`, `#input`,
 * `#preview`, `#share`) so a step can be linked to and restored after login.
 */
const INVITATION_TABS = ['select', 'input', 'preview', 'share'] as const;

type InvitationTab = (typeof INVITATION_TABS)[number];

const INVITATION_TAB_ITEMS: Array<{ id: InvitationTab; label: string }> = [
	{ id: 'select', label: '1. Chọn mẫu' },
	{ id: 'input', label: '2. Nhập thông tin' },
	{ id: 'preview', label: '3. Xem thiệp' },
	{ id: 'share', label: '4. Chia sẻ' }
];

/** Resolve an anchor hash (e.g. `#preview`) to a tab. `null` when absent/unknown. */
function tabFromHash(hash: string): InvitationTab | null {
	const value = hash.replace(/^#/, '');
	return (INVITATION_TABS as readonly string[]).includes(value) ? (value as InvitationTab) : null;
}

/**
 * Last step the user was on, so login/OAuth can return them to it even if the
 * router drops the hash. `sessionStorage` survives the auth round-trip and a
 * reload, but stays scoped to this tab and browser session.
 */
const INVITATION_TAB_STORAGE_KEY = 'invitation-builder-tab-v1';

function readStoredTab(): InvitationTab | null {
	if (typeof window === 'undefined') return null;

	try {
		const value = window.sessionStorage.getItem(INVITATION_TAB_STORAGE_KEY);
		return (INVITATION_TABS as readonly string[]).includes(value ?? '') ? (value as InvitationTab) : null;
	} catch {
		return null;
	}
}

function storeTab(tab: InvitationTab): void {
	if (typeof window === 'undefined') return;

	try {
		window.sessionStorage.setItem(INVITATION_TAB_STORAGE_KEY, tab);
	} catch {
		// Storage can be unavailable (private mode) — the URL hash still drives the UI.
	}
}

/**
 * Returns a fresh deep-cloned default config for the given template.
 * Each template has its own default config (see @/data/invitationConfigs),
 * so the form loads the config that belongs to the selected template only.
 */
function buildDefaultConfig(templateId: string = defaultTemplate.id): InvitationConfig {
	return getInvitationConfig(templateId);
}

/** Default config of the initial template — used to seed the form on first load. */
const defaultConfig = buildDefaultConfig();

function formatDateLabel(dateStr: string): string {
	if (!dateStr) return '';
	const [year, month, day] = dateStr.split('-');
	return `${day} · ${month} · ${year}`;
}

export default function InvitationPage() {
	const { isLoggedIn, user } = useAuth();
	// Shared photo library: reused by the gallery/QR/photo uploads and deletes.
	const { photos, handleUpload: handleUploadPhotos, handleDeletePhoto } = usePhotoLibrary({
		enabled: isLoggedIn
	});
	// The hash is deliberately *not* read here: a client-side navigation (such as
	// the post-login redirect to `/invitation#preview`) renders this page before
	// Next.js commits the new URL, so `window.location` still points at the
	// previous page. The effect below resolves the real tab after mount instead.
	const [activeTab, setActiveTab] = useState<InvitationTab>('select');
	// Guards the hash-sync effect so its first run — which still sees the `select`
	// default — cannot overwrite the incoming hash before it has been read.
	const skipFirstHashSyncRef = useRef(true);
	const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplate.id);

	const [config, setConfig] = useState<InvitationConfig>(defaultConfig);
	const [weddingDate, setWeddingDate] = useState(defaultConfig.weddingDateISO.split('T')[0]);

	const [isRendering, setIsRendering] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewFileName, setPreviewFileName] = useState<string | null>(null);
	const [renderError, setRenderError] = useState<string | null>(null);

	const [isSaving, setIsSaving] = useState(false);
	const [guestName, setGuestName] = useState('');
	const [generatedLinks, setGeneratedLinks] = useState<Array<{ id: string; guestName: string; url: string }>>([]);
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
	const [invitationTabUrl, setInvitationTabUrl] = useState<string | null>(null);
	const [invitationTabLoading, setInvitationTabLoading] = useState(false);
	const [invitationTabError, setInvitationTabError] = useState<string | null>(null);

	const [isLoadingExisting, setIsLoadingExisting] = useState(true);
	// "Lưu" state. The button runs the same request as the "3. Xem thiệp" step;
	// success/failure is reported through the toast below.
	const [isSavingInvitation, setIsSavingInvitation] = useState(false);
	const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
		show: false,
		message: '',
		type: 'success'
	});
	const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
		setToast({ show: true, message, type });
	}, []);
	const hideToast = useCallback(() => {
		setToast((prev) => ({ ...prev, show: false }));
	}, []);
	// The invitation is read from the database once per login and again every
	// time the user opens the "Nhập thông tin" step.
	const hasLoadedRef = useRef(false);
	const previousTabRef = useRef<InvitationTab>('select');
	// The request that stores the template picked in step 1. The step-2 refresh
	// awaits it, so a quick step 1 → step 2 click cannot read the old template.
	const templateSaveRef = useRef<Promise<unknown> | null>(null);

	// Resolve which step to open. Runs after mount so the URL has settled: an
	// explicit anchor wins (deep links), otherwise fall back to the step the user
	// was last on — which is what returns them to it after logging in when the
	// router does not carry the hash across the redirect.
	useEffect(() => {
		const resolveTab = (allowStoredFallback: boolean) => {
			const fromHash = tabFromHash(window.location.hash);
			if (fromHash) {
				setActiveTab(fromHash);
				storeTab(fromHash);
				return;
			}

			if (!allowStoredFallback) return;

			const stored = readStoredTab();
			if (stored) setActiveTab(stored);
		};

		resolveTab(true);

		// Follow manual hash edits, pasted deep links and back/forward navigation.
		const handleHashChange = () => resolveTab(false);
		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	// Keep the URL in sync with the active tab so every step is a shareable
	// anchor link. The first run is skipped so the default `select` never wipes a
	// deep link (or the hash the post-login redirect just set) before it is read.
	// `replaceState` keeps the history free of one entry per step.
	useEffect(() => {
		if (skipFirstHashSyncRef.current) {
			skipFirstHashSyncRef.current = false;
			return;
		}

		storeTab(activeTab);

		const nextHash = `#${activeTab}`;
		if (window.location.hash !== nextHash) {
			window.history.replaceState(null, '', nextHash);
		}
	}, [activeTab]);

	// The database is the single source of truth for the invitation — nothing is
	// kept in localStorage.

	/** Copies an invitation fetched from the backend into the builder state. */
	const applyInvitation = useCallback((invitation: MyInvitation) => {
		if (invitation.templateId) {
			setSelectedTemplateId(invitation.templateId);
		}
		if (invitation.config) {
			const loaded = invitation.config;
			const isoDate = loaded.weddingDateISO ? loaded.weddingDateISO.split('T')[0] : '';
			setConfig({
				...loaded,
				reception: { ...loaded.reception, date: loaded.reception?.date || isoDate }
			});
			if (isoDate) {
				setWeddingDate(isoDate);
			}
		} else if (invitation.templateId) {
			// No saved config — fall back to the selected template's defaults.
			const templateDefaults = buildDefaultConfig(invitation.templateId);
			setConfig(templateDefaults);
			const isoDate = templateDefaults.weddingDateISO.split('T')[0];
			if (isoDate) {
				setWeddingDate(isoDate);
			}
		}
		if (invitation.publicUrl) {
			const loadedUrl = `${BACKEND_ORIGIN}${invitation.publicUrl}?t=${Date.now()}`;
			setPreviewUrl(loadedUrl);
			setPreviewFileName(invitation.publicUrl.split('/').pop() ?? null);
			setInvitationTabUrl(loadedUrl);
		}
		setGeneratedLinks(
			(invitation.guestLinks || []).map((link) => ({
				...link,
				url: new URL(link.url, BACKEND_ORIGIN).toString()
			}))
		);
	}, []);

	/** Fetches the current user's invitation. Never rejects. */
	const fetchInvitation = useCallback(async () => {
		try {
			const response = await getMyInvitation();
			if (!response.success || !response.invitation) return;
			applyInvitation(response.invitation);
		} catch {
			// No existing invitation yet (or fetch failed) — keep the current form.
		}
	}, [applyInvitation]);

	// Initial load + every login state change. This effect is the ONLY place that
	// resolves the full-page loader, and it deliberately does not depend on
	// `activeTab`: resolving the landing step (e.g. `#preview` after a login
	// redirect) must not cancel the request that is still in flight, because the
	// cancelled run would then also skip clearing `isLoadingExisting` and leave
	// the spinner on screen forever.
	useEffect(() => {
		if (!isLoggedIn) {
			setIsLoadingExisting(false);
			// Logging back in must re-read the invitation, so forget the load.
			hasLoadedRef.current = false;
			return;
		}

		hasLoadedRef.current = true;

		// Only a logout (or unmount) invalidates this run.
		let cancelled = false;
		void fetchInvitation().finally(() => {
			if (!cancelled) {
				setIsLoadingExisting(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [isLoggedIn, fetchInvitation]);

	// Opening the "Nhập thông tin" step re-reads the database, so data saved on
	// another device shows up here. The template picked in step 1 is stored by
	// `handleSelectTemplate`, so this read returns the up-to-date choice once that
	// request has finished.
	useEffect(() => {
		const enteredInput = previousTabRef.current !== 'input' && activeTab === 'input';
		previousTabRef.current = activeTab;

		if (!enteredInput || !hasLoadedRef.current) return;

		void (templateSaveRef.current ?? Promise.resolve()).then(() => fetchInvitation());
	}, [activeTab, fetchInvitation]);

	const selectedTemplate =
		invitationTemplates.find((template) => template.id === selectedTemplateId) ?? defaultTemplate;

	/**
	 * Which optional form sections the selected template supports. Derived from
	 * the template's own default config — not the merged `config` — so sections
	 * never leak across template switches.
	 */
	const templateFeatures = useMemo(
		() => getInvitationConfigFeatures(selectedTemplateId),
		[selectedTemplateId]
	);

	/**
	 * Merge user's current input with template defaults.
	 * Preserves user-entered data while filling in missing fields from the template defaults.
	 */
	const mergeConfigWithDefaults = (
		currentConfig: InvitationConfig,
		currentWeddingDate: string,
		templateId: string
	): { config: InvitationConfig; weddingDate: string } => {
		const templateDefaults = buildDefaultConfig(templateId);
		
		// Merge configs, preserving user input where it exists
		const merged: InvitationConfig = {
			groomShort: currentConfig.groomShort || templateDefaults.groomShort,
			brideShort: currentConfig.brideShort || templateDefaults.brideShort,
			groomFull: currentConfig.groomFull || templateDefaults.groomFull,
			brideFull: currentConfig.brideFull || templateDefaults.brideFull,
			groomRole: currentConfig.groomRole || templateDefaults.groomRole,
			brideRole: currentConfig.brideRole || templateDefaults.brideRole,
			monogram: currentConfig.monogram || templateDefaults.monogram,
			weddingDateISO: currentConfig.weddingDateISO || templateDefaults.weddingDateISO,
			groomParents: templateDefaults.groomParents ? currentConfig.groomParents ?? templateDefaults.groomParents : null,
			brideParents: templateDefaults.brideParents ? currentConfig.brideParents ?? templateDefaults.brideParents : null,
			ceremony: templateDefaults.ceremony ? currentConfig.ceremony ?? templateDefaults.ceremony : null,
			reception: {
				date: currentConfig.reception?.date || templateDefaults.reception.date,
				welcomeTime: currentConfig.reception?.welcomeTime || templateDefaults.reception.welcomeTime,
				startTime: currentConfig.reception?.startTime || templateDefaults.reception.startTime,
					venueName: currentConfig.reception?.venueName || templateDefaults.reception.venueName,
					address: currentConfig.reception?.address || templateDefaults.reception.address,
				mapQuery: currentConfig.reception?.mapQuery || templateDefaults.reception.mapQuery
			},
			schedule: currentConfig.schedule?.length ? currentConfig.schedule : templateDefaults.schedule,
			gallery: (currentConfig.gallery?.length ? currentConfig.gallery : templateDefaults.gallery).slice(0, MAX_GALLERY_IMAGES),
			gifts: {
				groom: {
					bank: currentConfig.gifts?.groom?.bank || templateDefaults.gifts.groom.bank,
					account: currentConfig.gifts?.groom?.account || templateDefaults.gifts.groom.account,
					name: currentConfig.gifts?.groom?.name || templateDefaults.gifts.groom.name,
					qrImage: currentConfig.gifts?.groom?.qrImage || templateDefaults.gifts.groom.qrImage
				},
				bride: {
					bank: currentConfig.gifts?.bride?.bank || templateDefaults.gifts.bride.bank,
					account: currentConfig.gifts?.bride?.account || templateDefaults.gifts.bride.account,
					name: currentConfig.gifts?.bride?.name || templateDefaults.gifts.bride.name,
					qrImage: currentConfig.gifts?.bride?.qrImage || templateDefaults.gifts.bride.qrImage
				}
			},
			musicUrl: currentConfig.musicUrl || templateDefaults.musicUrl,
			// Template-specific fields are only kept when the target template
			// actually supports them, so stale data from a previous template
			// never gets rendered in the form.
			story: templateDefaults.story
				? currentConfig.story?.length
					? currentConfig.story
					: templateDefaults.story
				: undefined,
			photos: templateDefaults.photos ? currentConfig.photos ?? templateDefaults.photos : undefined
		};

		// Use current wedding date if exists, otherwise extract from config
		const mergedWeddingDate = currentWeddingDate || (merged.weddingDateISO ? merged.weddingDateISO.split('T')[0] : '');

		return { config: merged, weddingDate: mergedWeddingDate };
	};

	/**
	 * Switching templates loads the stored invitation (when there is one) and
	 * merges it with the new template's defaults, so user-entered information is
	 * kept. The choice is then written to the database straight away — the
	 * template is stored nowhere else, and the other steps read the form back from
	 * there.
	 */
	const handleSelectTemplate = async (templateId: string) => {
		if (templateId === selectedTemplateId) return;

		let nextConfig = config;
		let nextWeddingDate = weddingDate;

		try {
			// Try to load saved invitation from database
			const response = await getMyInvitation();

			if (response.success && response.invitation?.config) {
				// Use saved config from database
				nextConfig = response.invitation.config;
				nextWeddingDate = response.invitation.config.weddingDateISO?.split('T')[0] || weddingDate;
			}
		} catch {
			// No stored invitation (or the fetch failed) — merge the current form.
		}

		// Merge with new template defaults, preserving user data
		const { config: mergedConfig, weddingDate: mergedDate } = mergeConfigWithDefaults(
			nextConfig,
			nextWeddingDate,
			templateId
		);

		setSelectedTemplateId(templateId);
		setConfig(mergedConfig);
		setWeddingDate(mergedDate);

		// Always reset preview/share on template change
		setPreviewUrl(null);
		setPreviewFileName(null);
		setShareUrl(null);

		templateSaveRef.current = saveSelectedTemplate(templateId, mergedConfig, mergedDate);
		await templateSaveRef.current;
	};

	/**
	 * Stores the picked template (plus the config it starts from) in the database.
	 * The render endpoint is the existing upsert, so no new API is needed.
	 */
	const saveSelectedTemplate = async (
		templateId: string,
		nextConfig: InvitationConfig,
		nextWeddingDate: string
	): Promise<void> => {
		if (!isLoggedIn) return;

		try {
			await renderInvitationPreview(
				templateId,
				buildFinalConfig({ config: nextConfig, weddingDate: nextWeddingDate })
			);
		} catch (error) {
			showToast(
				error instanceof Error ? error.message : 'Không thể lưu mẫu thiệp. Vui lòng thử lại.',
				'error'
			);
		}
	};

	const canPreview = useMemo(() => {
		return Boolean(
			config.groomFull.trim() &&
				config.brideFull.trim() &&
				config.groomShort.trim() &&
				config.brideShort.trim() &&
				weddingDate &&
				config.reception.startTime &&
				config.reception.venueName.trim() &&
				config.reception.address.trim()
		);
	}, [config, weddingDate]);

	/**
	 * Applies a change coming from the form in `Input.tsx`.
	 */
	const applyInputChange = (updater: (prev: InvitationConfig) => InvitationConfig) => {
		setConfig(updater);
	};

	const updateField = <K extends keyof InvitationConfig>(key: K, value: InvitationConfig[K]) => {
		applyInputChange((prev) => ({ ...prev, [key]: value }));
	};

	const updateGroomParent = (field: keyof InvitationParent, value: string) => {
		applyInputChange((prev) => ({
			...prev,
			groomParents: { ...(prev.groomParents ?? { father: '', mother: '', address: '' }), [field]: value }
		}));
	};

	const updateBrideParent = (field: keyof InvitationParent, value: string) => {
		applyInputChange((prev) => ({
			...prev,
			brideParents: { ...(prev.brideParents ?? { father: '', mother: '', address: '' }), [field]: value }
		}));
	};

	const updateCeremony = (field: keyof InvitationCeremony, value: string) => {
		applyInputChange((prev) => ({
			...prev,
			ceremony: { ...(prev.ceremony ?? { time: '', dateLabel: '', lunar: '' }), [field]: value }
		}));
	};

	const updateReception = (field: keyof InvitationConfig['reception'], value: string) => {
		applyInputChange((prev) => ({ ...prev, reception: { ...prev.reception, [field]: value } }));
	};

	const updateGift = (who: 'groom' | 'bride', field: keyof InvitationConfig['gifts']['groom'], value: string) => {
		applyInputChange((prev) => ({
			...prev,
			gifts: { ...prev.gifts, [who]: { ...prev.gifts[who], [field]: value } }
		}));
	};

	const updateScheduleItem = (index: number, field: keyof InvitationScheduleItem, value: string) => {
		applyInputChange((prev) => {
			const schedule = [...prev.schedule];
			schedule[index] = { ...schedule[index], [field]: value };
			return { ...prev, schedule };
		});
	};

	const addScheduleRow = () => {
		applyInputChange((prev) => ({ ...prev, schedule: [...prev.schedule, { time: '', label: '' }] }));
	};

	const removeScheduleRow = (index: number) => {
		applyInputChange((prev) => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== index) }));
	};

	const updateGalleryItem = (index: number, value: string) => {
		applyInputChange((prev) => {
			const gallery = [...prev.gallery];
			gallery[index] = value;
			return { ...prev, gallery };
		});
	};

	const addGalleryRow = () => {
		applyInputChange((prev) =>
			prev.gallery.length >= MAX_GALLERY_IMAGES ? prev : { ...prev, gallery: [...prev.gallery, ''] }
		);
	};

	const removeGalleryRow = async (index: number) => {
		const url = config.gallery[index];
		const libraryPhoto = photos.find(
			(photo) => photo.url === url || photo.thumbnailUrl === url || photo.mediumUrl === url
		);

		if (libraryPhoto && !(await handleDeletePhoto(libraryPhoto.id))) {
			// The deletion was cancelled or failed — keep the image in the form.
			return;
		}

		applyInputChange((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
	};

	const updateStoryItem = (index: number, field: keyof InvitationStoryItem, value: string) => {
		applyInputChange((prev) => {
			const story = [...(prev.story ?? [])];
			story[index] = { ...story[index], [field]: value };
			return { ...prev, story };
		});
	};

	const addStoryRow = () => {
		applyInputChange((prev) => ({ ...prev, story: [...(prev.story ?? []), { date: '', text: '' }] }));
	};

	const removeStoryRow = (index: number) => {
		applyInputChange((prev) => ({ ...prev, story: (prev.story ?? []).filter((_, i) => i !== index) }));
	};

	const updatePhoto = (field: keyof InvitationPhotos, value: string) => {
		applyInputChange((prev) => ({
			...prev,
			photos: { ...(prev.photos ?? { coverPhoto: '', groomPhoto: '', bridePhoto: '' }), [field]: value }
		}));
	};

	const handleWeddingDateChange = (value: string) => {
		setWeddingDate(value);
		updateField('ceremony', { ...config.ceremony, dateLabel: formatDateLabel(value) } as InvitationConfig['ceremony']);
	};

	const buildFinalConfig = (overrides?: {
		config?: InvitationConfig;
		weddingDate?: string;
	}): InvitationConfig => {
		const sourceConfig = overrides?.config ?? config;
		const sourceWeddingDate = overrides?.weddingDate ?? weddingDate;
		const startTime = sourceConfig.reception.startTime || '18:00';
		return {
			...sourceConfig,
			reception: { ...sourceConfig.reception, date: sourceConfig.reception.date || sourceWeddingDate },
			weddingDateISO: sourceWeddingDate ? `${sourceWeddingDate}T${startTime}:00` : sourceConfig.weddingDateISO,
			schedule: sourceConfig.schedule.filter((item) => item.time.trim() || item.label.trim()),
			gallery: sourceConfig.gallery.map((url) => url.trim()).filter(Boolean).slice(0, MAX_GALLERY_IMAGES)
		};
	};

	/**
	 * Sends the current form to the render endpoint — the exact request the
	 * "3. Xem thiệp" step makes. The backend stores the invitation (including the
	 * uploaded photo URLs) as part of that call, so it doubles as "save".
	 * Returns the error message on failure, `null` on success.
	 */
	const loadInvitationTabPreview = async (): Promise<string | null> => {
		setInvitationTabError(null);
		setInvitationTabLoading(true);

		if (!isLoggedIn) {
			const message = 'Vui lòng đăng nhập hoặc đăng ký để xem thiệp đã tạo.';
			setInvitationTabError(message);
			setInvitationTabLoading(false);
			return message;
		}

		if (!canPreview) {
			const message = 'Vui lòng điền đủ thông tin để xem thiệp.';
			setInvitationTabError(message);
			setInvitationTabLoading(false);
			return message;
		}

		try {
			const finalConfig = buildFinalConfig();
			const response = await renderInvitationPreview(selectedTemplate.id, finalConfig);
			const fullUrl = `${BACKEND_ORIGIN}${response.publicUrl}?t=${Date.now()}`;
			setPreviewUrl(fullUrl);
			setPreviewFileName(response.htmlFileName);
			setInvitationTabUrl(fullUrl);
			return null;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Không thể tải thiệp cưới. Vui lòng thử lại.';
			setInvitationTabError(message);
			return message;
		} finally {
			setInvitationTabLoading(false);
		}
	};


	useEffect(() => {
		if (activeTab !== 'preview') return;
		void loadInvitationTabPreview();
	}, [activeTab, isLoggedIn, selectedTemplate.id, canPreview]);

	/**
	 * "Lưu": runs exactly the same request the "3. Xem thiệp" step runs, which
	 * stores the invitation in the database. Nothing is kept in localStorage, so
	 * the saved data is what the form is loaded from — on any device.
	 */
	const handleSaveInvitation = async () => {
		if (!isLoggedIn) {
			showToast('Vui lòng đăng nhập hoặc đăng ký để lưu thiệp cưới của bạn.', 'error');
			return;
		}

		setIsSavingInvitation(true);
		const errorMessage = await loadInvitationTabPreview();
		setIsSavingInvitation(false);

		if (errorMessage) {
			showToast(errorMessage, 'error');
		} else {
			showToast('Đã lưu thông tin thiệp cưới.', 'success');
		}
	};

	const handleGenerateLink = async () => {
		setSaveError(null);
		setCopied(false);
		setCopiedLinkId(null);

		if (!isLoggedIn) {
			setSaveError('Vui lòng đăng nhập hoặc đăng ký để tạo link thiệp mời gửi cho khách.');
			return;
		}

		const trimmedGuestName = guestName.trim();
		if (!trimmedGuestName) {
			setSaveError('Vui lòng nhập tên người mời trước khi tạo link.');
			return;
		}

		//TODO: remove comment in future
		// if (!user?.isPaid) {
		// 	setSaveError('Tính năng tạo link gửi cho khách chỉ dành cho người dùng đã thanh toán.');
		// 	return;
		// }

		setIsSaving(true);
		try {
			const finalConfig = buildFinalConfig();
			const response = await generateInvitation(selectedTemplate.id, finalConfig, {
				groomName: finalConfig.groomFull,
				brideName: finalConfig.brideFull,
				eventDate: weddingDate,
				guestName: trimmedGuestName
			});
			const nextLink = {
				...response.invitation.guestLink!,
				url: new URL(response.invitation.guestLink!.url, BACKEND_ORIGIN).toString()
			};
			setGeneratedLinks((prev) => [nextLink, ...prev]);
			setShareUrl(nextLink.url);
			setGuestName('');
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : 'Không thể tạo link chia sẻ. Vui lòng thử lại.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteLink = async (linkId: string) => {
		setSaveError(null);
		try {
			await deleteGuestLink(linkId);
			setGeneratedLinks((prev) => prev.filter((link) => link.id !== linkId));
			if (generatedLinks.find((link) => link.id === linkId)?.url === shareUrl) {
				setShareUrl(null);
			}
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : 'Không thể xóa link. Vui lòng thử lại.');
		}
	};

	/**
	 * Tab anchors keep the URL hash authoritative (handled by the `hashchange`
	 * listener); setting state here gives immediate feedback and lets the share
	 * step kick off link generation like before.
	 */
	const handleTabClick = (tab: InvitationTab) => {
		setActiveTab(tab);
		if (tab === 'share') {
			void handleGenerateLink();
		}
	};

	const handleCopyLink = async (urlToCopy?: string) => {
		const targetUrl = urlToCopy || shareUrl;
		if (!targetUrl) return;
		try {
			await navigator.clipboard.writeText(targetUrl);
			setCopied(true);
			setCopiedLinkId(generatedLinks.find((link) => link.url === targetUrl)?.id ?? null);
			setTimeout(() => {
				setCopied(false);
				setCopiedLinkId(null);
			}, 2000);
		} catch {
			setSaveError('Không thể sao chép link. Vui lòng sao chép thủ công.');
		}
	};

	if (isLoadingExisting) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center">
					<Loader2 className="mx-auto h-8 w-8 animate-spin text-pink-500" />
					<p className="mt-3 text-sm text-slate-500">Đang tải thông tin thiệp cưới của bạn...</p>
				</div>
			</div>
		);
	}

	return (
	  <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo thiệp cưới online</h1>
          <p className="text-gray-600">
            Chọn mẫu, điền thông tin đám cưới của bạn ngay bên dưới và xem trước thiệp hoàn chỉnh chỉ với một cú nhấp chuột.
          </p>
        </div>

		{/* Tabs */}
		<div className="sticky top-[72px] z-30 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">

				<div className="flex gap-2 border-b border-slate-200">
					{INVITATION_TAB_ITEMS.map((tab) => (
						<a
							key={tab.id}
							href={`#${tab.id}`}
							onClick={() => handleTabClick(tab.id)}
							className={`flex items-center gap-2 border-b-2 px-2 md:px-4 py-3 text-sm font-semibold transition ${
								activeTab === tab.id
									? 'border-pink-500 text-pink-600'
									: 'border-transparent text-slate-500 hover:text-slate-700'
							}`}
						>
							{tab.label}
						</a>
					))}
				</div>
		</div>

		<Select
			activeTab={activeTab}
			setActiveTab={setActiveTab}
			selectedTemplateId={selectedTemplateId}
			handleSelectTemplate={handleSelectTemplate}
		/>

		<Input
			activeTab={activeTab}
			setActiveTab={setActiveTab}
			selectedTemplate={selectedTemplate}
			features={templateFeatures}
			config={config}
			weddingDate={weddingDate}
			isSaving={isSavingInvitation}
			onSave={handleSaveInvitation}
			updateField={updateField}
			updateGroomParent={updateGroomParent}
			updateBrideParent={updateBrideParent}
			updateCeremony={updateCeremony}
			updateReception={updateReception}
			updateGift={updateGift}
			updateScheduleItem={updateScheduleItem}
			addScheduleRow={addScheduleRow}
			removeScheduleRow={removeScheduleRow}
			updateGalleryItem={updateGalleryItem}
			addGalleryRow={addGalleryRow}
			removeGalleryRow={removeGalleryRow}
			updateStoryItem={updateStoryItem}
			addStoryRow={addStoryRow}
			removeStoryRow={removeStoryRow}
			updatePhoto={updatePhoto}
			handleWeddingDateChange={handleWeddingDateChange}
			photos={photos}
			onUploadPhotos={handleUploadPhotos}
			onDeletePhoto={handleDeletePhoto}
		/>

		<Preview
			activeTab={activeTab}
			invitationTabLoading={invitationTabLoading}
			invitationTabError={invitationTabError}
			invitationTabUrl={invitationTabUrl}
			isLoggedIn={isLoggedIn}
		/>

		<Share
			activeTab={activeTab}
			isLoggedIn={isLoggedIn}
			isPaid={user?.isPaid}
			previewFileName={previewFileName}
			saveError={saveError}
			shareUrl={shareUrl}
			copied={copied}
			copiedLinkId={copiedLinkId}
			guestName={guestName}
			generatedLinks={generatedLinks}
			setGuestName={setGuestName}
			handleGenerateLink={handleGenerateLink}
			handleCopyLink={handleCopyLink}
			handleDeleteLink={handleDeleteLink}
		/>

		{/* Success/failure feedback for the "Lưu" button in the input step. */}
		<Toast message={toast.message} type={toast.type} show={toast.show} onClose={hideToast} />

		<style jsx global>{`
			.input {
				width: 100%;
				border-radius: 0.75rem;
				border: 1px solid rgb(226 232 240);
				padding: 0.5rem 0.75rem;
				font-size: 0.875rem;
				outline: none;
				transition: border-color 0.15s, box-shadow 0.15s;
				background: white;
			}
			.input:focus {
				border-color: rgb(253 164 175);
				box-shadow: 0 0 0 3px rgb(255 228 230);
			}
		`}</style>
	  </div>
	);
}

