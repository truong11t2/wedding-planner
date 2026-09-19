'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
	invitationTemplates,
	defaultInvitationTemplate
} from '@/data/invitationTemplates';
import { getInvitationConfig } from '@/data/invitationConfigs';
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
	type InvitationStoryItem
} from '@/api/invitation';
import { BACKEND_ORIGIN } from '@/api/config';
import Input from '@/components/invitation/Input';
import Select from '@/components/invitation/Select';
import Preview from '@/components/invitation/Preview';
import Share from '@/components/invitation/Share';



const defaultTemplate = defaultInvitationTemplate;
const INVITATION_DRAFT_STORAGE_KEY = 'invitation-builder-draft-v1';

type InvitationDraft = {
	selectedTemplateId: string;
	config: InvitationConfig;
	weddingDate: string;
};

/**
 * Returns a fresh deep-cloned default config for the given template.
 * Each template has its own default config (see @/data/invitationConfigs),
 * so the form loads the config that belongs to the selected template only.
 */
function buildDefaultConfig(templateId: string = defaultTemplate.id): InvitationConfig {
	return getInvitationConfig(templateId);
}

function loadInvitationDraft(): InvitationDraft | null {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		const rawDraft = window.localStorage.getItem(INVITATION_DRAFT_STORAGE_KEY);
		if (!rawDraft) {
			return null;
		}

		const parsed = JSON.parse(rawDraft) as InvitationDraft;
		if (!parsed || !parsed.config || !parsed.weddingDate) {
			return null;
		}

		return parsed;
	} catch {
		return null;
	}
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
	const [activeTab, setActiveTab] = useState<'select' | 'input' | 'preview' | 'share'>('select');
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
	// Bumped only when the user edits a field in `Input.tsx`, so the draft is
	// never persisted by programmatic updates (restoring the draft, loading the
	// saved invitation, switching template).
	const [draftRevision, setDraftRevision] = useState(0);
	const draftRef = useRef<InvitationDraft>({ selectedTemplateId, config, weddingDate });

	// Keep the latest values available to the persistence effect below without
	// re-triggering it on every state change.
	useEffect(() => {
		draftRef.current = { selectedTemplateId, config, weddingDate };
	}, [selectedTemplateId, config, weddingDate]);

	// Persist the draft only after a user edit inside the input form.
	useEffect(() => {
		if (draftRevision === 0 || typeof window === 'undefined') {
			return;
		}

		window.localStorage.setItem(INVITATION_DRAFT_STORAGE_KEY, JSON.stringify(draftRef.current));
	}, [draftRevision]);

	// Pre-fill the form on mount. The local draft — written only when the user
	// edits the form — has the highest priority. The saved invitation from the
	// database is loaded only when no draft exists, so a user who typed data
	// while logged out keeps their input after logging in.
	useEffect(() => {
		let cancelled = false;

		const loadInvitationState = async () => {
			const savedDraft = loadInvitationDraft();
			if (savedDraft) {
				setSelectedTemplateId(savedDraft.selectedTemplateId || defaultTemplate.id);
				setConfig(savedDraft.config);
				setWeddingDate(savedDraft.weddingDate);
				setIsLoadingExisting(false);
				return;
			}

			if (!isLoggedIn) {
				setIsLoadingExisting(false);
				return;
			}

			try {
				const response = await getMyInvitation();
				if (!cancelled && response.success && response.invitation) {
					const { invitation } = response;
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
				}
			} catch {
				// No existing invitation yet (or fetch failed) — silently keep defaults.
			} finally {
				if (!cancelled) {
					setIsLoadingExisting(false);
				}
			}
		};

		loadInvitationState();

		return () => {
			cancelled = true;
		};
	}, [isLoggedIn]);

	const selectedTemplate =
		invitationTemplates.find((template) => template.id === selectedTemplateId) ?? defaultTemplate;

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
			groomParents: {
				father: currentConfig.groomParents?.father || templateDefaults.groomParents.father,
				mother: currentConfig.groomParents?.mother || templateDefaults.groomParents.mother,
				address: currentConfig.groomParents?.address || templateDefaults.groomParents.address
			},
			brideParents: {
				father: currentConfig.brideParents?.father || templateDefaults.brideParents.father,
				mother: currentConfig.brideParents?.mother || templateDefaults.brideParents.mother,
				address: currentConfig.brideParents?.address || templateDefaults.brideParents.address
			},
			ceremony: {
				time: currentConfig.ceremony?.time || templateDefaults.ceremony.time,
				dateLabel: currentConfig.ceremony?.dateLabel || templateDefaults.ceremony.dateLabel,
				lunar: currentConfig.ceremony?.lunar || templateDefaults.ceremony.lunar
			},
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
			// Template-specific fields
			story: currentConfig.story?.length ? currentConfig.story : templateDefaults.story,
			photos: currentConfig.photos ? currentConfig.photos : templateDefaults.photos
		};

		// Use current wedding date if exists, otherwise extract from config
		const mergedWeddingDate = currentWeddingDate || (merged.weddingDateISO ? merged.weddingDateISO.split('T')[0] : '');

		return { config: merged, weddingDate: mergedWeddingDate };
	};

	/**
	 * Switching templates tries to load saved data from database first.
	 * If saved data exists, merges it with the new template's defaults.
	 * If no saved data, uses user's current input merged with new template's defaults.
	 * This preserves user-entered information when switching templates.
	 */
	const handleSelectTemplate = async (templateId: string) => {
		if (templateId === selectedTemplateId) return;
		
		try {
			// Try to load saved invitation from database
			const response = await getMyInvitation();
			let nextConfig = config;
			let nextWeddingDate = weddingDate;

			if (response.success && response.invitation?.config) {
				// Use saved config from database
				nextConfig = response.invitation.config;
				nextWeddingDate = response.invitation.config.weddingDateISO?.split('T')[0] || weddingDate;
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
		} catch {
			// If database fetch fails, just merge current state with new template defaults
			const { config: mergedConfig, weddingDate: mergedDate } = mergeConfigWithDefaults(
				config,
				weddingDate,
				templateId
			);

			setSelectedTemplateId(templateId);
			setConfig(mergedConfig);
			setWeddingDate(mergedDate);
		}

		// Always reset preview/share on template change
		setPreviewUrl(null);
		setPreviewFileName(null);
		setShareUrl(null);
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
	 * Applies a change coming from the form in `Input.tsx` and flags the browser
	 * draft as dirty so it gets persisted. Programmatic updates (restoring the
	 * draft, loading the saved invitation, switching template) call `setConfig`
	 * directly, so they never overwrite the stored draft.
	 */
	const applyInputChange = (updater: (prev: InvitationConfig) => InvitationConfig) => {
		setDraftRevision((revision) => revision + 1);
		setConfig(updater);
	};

	const updateField = <K extends keyof InvitationConfig>(key: K, value: InvitationConfig[K]) => {
		applyInputChange((prev) => ({ ...prev, [key]: value }));
	};

	const updateGroomParent = (field: keyof InvitationConfig['groomParents'], value: string) => {
		applyInputChange((prev) => ({ ...prev, groomParents: { ...prev.groomParents, [field]: value } }));
	};

	const updateBrideParent = (field: keyof InvitationConfig['brideParents'], value: string) => {
		applyInputChange((prev) => ({ ...prev, brideParents: { ...prev.brideParents, [field]: value } }));
	};

	const updateCeremony = (field: keyof InvitationConfig['ceremony'], value: string) => {
		applyInputChange((prev) => ({ ...prev, ceremony: { ...prev.ceremony, [field]: value } }));
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

	const removeGalleryRow = (index: number) => {
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

	const buildFinalConfig = (): InvitationConfig => {
		const startTime = config.reception.startTime || '18:00';
		return {
			...config,
			reception: { ...config.reception, date: config.reception.date || weddingDate },
			weddingDateISO: weddingDate ? `${weddingDate}T${startTime}:00` : config.weddingDateISO,
			schedule: config.schedule.filter((item) => item.time.trim() || item.label.trim()),
			gallery: config.gallery.map((url) => url.trim()).filter(Boolean).slice(0, MAX_GALLERY_IMAGES)
		};
	};

	const loadInvitationTabPreview = async () => {
		setInvitationTabError(null);
		setInvitationTabLoading(true);

		if (!isLoggedIn) {
			setInvitationTabError('Vui lòng đăng nhập hoặc đăng ký để xem thiệp đã tạo.');
			setInvitationTabLoading(false);
			return;
		}

		if (!canPreview) {
			setInvitationTabError('Vui lòng điền đủ thông tin để xem thiệp.');
			setInvitationTabLoading(false);
			return;
		}

		try {
			const finalConfig = buildFinalConfig();
			const response = await renderInvitationPreview(selectedTemplate.id, finalConfig);
			const fullUrl = `${BACKEND_ORIGIN}${response.publicUrl}?t=${Date.now()}`;
			setPreviewUrl(fullUrl);
			setPreviewFileName(response.htmlFileName);
			setInvitationTabUrl(fullUrl);
		} catch (error) {
			setInvitationTabError(error instanceof Error ? error.message : 'Không thể tải thiệp cưới. Vui lòng thử lại.');
		} finally {
			setInvitationTabLoading(false);
		}
	};


	useEffect(() => {
		if (activeTab !== 'preview') return;
		void loadInvitationTabPreview();
	}, [activeTab, isLoggedIn, selectedTemplate.id, canPreview]);

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
					<button
						type="button"
						onClick={() => setActiveTab('select')}
						className={`flex items-center gap-2 border-b-2 px-2 md:px-4 py-3 text-sm font-semibold transition ${
							activeTab === 'select'
								? 'border-pink-500 text-pink-600'
								: 'border-transparent text-slate-500 hover:text-slate-700'
						}`}
					>
						1. Chọn mẫu
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('input')}
						className={`flex items-center gap-2 border-b-2 px-2 md:px-4 py-3 text-sm font-semibold transition ${
							activeTab === 'input'
								? 'border-pink-500 text-pink-600'
								: 'border-transparent text-slate-500 hover:text-slate-700'
						}`}
					>
						2. Nhập thông tin
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('preview')}
						className={`flex items-center gap-2 border-b-2 px-2 md:px-4 py-3 text-sm font-semibold transition ${
							activeTab === 'preview'
								? 'border-pink-500 text-pink-600'
								: 'border-transparent text-slate-500 hover:text-slate-700'
						}`}
					>
						3. Xem thiệp
					</button>
					<button
						type="button"
						onClick={() => {setActiveTab('share'); handleGenerateLink()}}
						className={`flex items-center gap-2 border-b-2 px-2 md:px-4 py-3 text-sm font-semibold transition ${
							activeTab === 'share'
								? 'border-pink-500 text-pink-600'
								: 'border-transparent text-slate-500 hover:text-slate-700'
						}`}
					>
						4. Chia sẻ
					</button>
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
			config={config}
			weddingDate={weddingDate}
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

