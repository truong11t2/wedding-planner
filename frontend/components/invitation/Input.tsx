'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import BankSelect from '@/components/common/BankSelect';
import ImageUploadCard, { LabeledImageUploadCard } from '@/components/common/ImageUploadCard';
import { useAuth } from '@/context/AuthContext';
import { generateVietQrPhoto } from '@/api/photo';
import type { Photo } from '@/api/photo';
import { getBanks } from '@/api/bank';
import type { Bank } from '@/api/bank';
import type { PhotoUploadResult } from '@/lib/usePhotoLibrary';
import { MAX_GALLERY_IMAGES } from '@/api/invitation';
import type {
	InvitationCeremony,
	InvitationConfig,
	InvitationGift,
	InvitationParent,
	InvitationPhotos,
	InvitationScheduleItem,
	InvitationStoryItem
} from '@/api/invitation';
import type { InvitationTemplate } from '@/data/invitationTemplates';
import type { InvitationTemplateFormFeatures } from '@/data/invitationConfigs';
import { buildLoginHref } from '@/lib/authRedirect';
import songs from '@/public/music/songs.json';

type InvitationTab = 'select' | 'input' | 'preview' | 'share';
type Song = { name: string; singer?: string; lang?: string; url: string };
type GiftSide = 'groom' | 'bride';

/**
 * A failed QR generation. `needsLogin` marks the only case where signing in is
 * the fix — only then are the login / register links worth showing.
 */
type QrError = { message: string; needsLogin?: boolean };

/** Bank apps expect a plain account number, so spaces/dots/dashes are dropped. */
const sanitizeAccountNumber = (value: string) => value.replace(/\D/g, '');

/**
 * Resolves the VietQR BIN for a stored gift.
 *
 * Configs saved by this form keep the BIN explicitly; older ones only have the
 * bank name, so the bank list is used to recover it.
 */
function resolveBankBin(gift: InvitationGift | undefined, banks: Bank[]): string {
	if (!gift) return '';
	if (gift.bankBin) return gift.bankBin;

	const needle = (gift.bank || '').trim().toLowerCase();
	if (!needle) return '';

	const match = banks.find((bank) =>
		[bank.shortName, bank.code, bank.name].some((field) => field.trim().toLowerCase() === needle)
	);

	return match?.bin || '';
}

const GIFT_SIDES: GiftSide[] = ['groom', 'bride'];

/** The two values the QR encodes: the bank BIN and a digits-only account number. */
function giftQrParams(gift: InvitationGift, banks: Bank[]) {
	return {
		bankBin: resolveBankBin(gift, banks),
		accountNumber: sanitizeAccountNumber(gift.account || '')
	};
}

/** A gift can produce a QR once it has a bank with a BIN and a plausible account number. */
function canGenerateGiftQr(gift: InvitationGift, banks: Bank[]): boolean {
	const { bankBin, accountNumber } = giftQrParams(gift, banks);
	return Boolean(bankBin) && accountNumber.length >= 6;
}

interface InputProps {
	activeTab: InvitationTab;
	setActiveTab: (tab: InvitationTab) => void;
	selectedTemplate: InvitationTemplate;
	/**
	 * Optional sections supported by the selected template, derived from that
	 * template's own config. Sections render from these flags — not from the
	 * merged `config` — so data from another template never leaks in.
	 */
	features: InvitationTemplateFormFeatures;
	config: InvitationConfig;
	weddingDate: string;
	updateField: <K extends keyof InvitationConfig>(key: K, value: InvitationConfig[K]) => void;
	updateGroomParent: (field: keyof InvitationParent, value: string) => void;
	updateBrideParent: (field: keyof InvitationParent, value: string) => void;
	updateCeremony: (field: keyof InvitationCeremony, value: string) => void;
	updateReception: (field: keyof InvitationConfig['reception'], value: string) => void;
	updateGift: (who: 'groom' | 'bride', field: keyof InvitationConfig['gifts']['groom'], value: string) => void;
	updateScheduleItem: (index: number, field: keyof InvitationScheduleItem, value: string) => void;
	addScheduleRow: () => void;
	removeScheduleRow: (index: number) => void;
	updateGalleryItem: (index: number, value: string) => void;
	addGalleryRow: () => void;
	removeGalleryRow: (index: number) => void;
	updateStoryItem: (index: number, field: keyof InvitationStoryItem, value: string) => void;
	addStoryRow: () => void;
	removeStoryRow: (index: number) => void;
	updatePhoto: (field: keyof InvitationPhotos, value: string) => void;
	handleWeddingDateChange: (value: string) => void;
	photos: Photo[];
	onUploadPhotos: (
		files: File[],
		category: string,
		description?: string,
		tags?: string[]
	) => Promise<PhotoUploadResult>;
	onDeletePhoto: (photoId: string, options?: { skipConfirm?: boolean }) => Promise<boolean>;
	/**
	 * Stores the form by running the same request as the "3. Xem thiệp" step.
	 * Nothing is kept in localStorage — the database is the single source of truth.
	 * Success/failure is reported by the host page as a toast.
	 */
	onSave: () => void;
	isSaving: boolean;
}

/**
 * Tab 2 — "Nhập thông tin": the wedding information form.
 *
 * Kept as its own file so `app/invitation/page.tsx` stays focused on template
 * selection, preview and sharing. This component owns all the state that only
 * the form uses (music player, Google Maps embed warning, gallery/QR uploads)
 * and receives the shared `config` plus update handlers as props.
 */
export default function Input({
	activeTab,
	setActiveTab,
	selectedTemplate,
	features,
	config,
	weddingDate,
	updateField,
	updateGroomParent,
	updateBrideParent,
	updateCeremony,
	updateReception,
	updateGift,
	updateScheduleItem,
	addScheduleRow,
	removeScheduleRow,
	updateGalleryItem,
	addGalleryRow,
	removeGalleryRow,
	updateStoryItem,
	addStoryRow,
	removeStoryRow,
	updatePhoto,
	handleWeddingDateChange,
	photos,
	onUploadPhotos,
	onDeletePhoto,
	onSave,
	isSaving
}: InputProps) {
	const { isLoggedIn } = useAuth();

	const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);
	const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);

	const [banks, setBanks] = useState<Bank[]>([]);
	const [banksLoading, setBanksLoading] = useState(true);
	const [qrGenerating, setQrGenerating] = useState<Record<GiftSide, boolean>>({ groom: false, bride: false });
	const [qrError, setQrError] = useState<Record<GiftSide, QrError | null>>({ groom: null, bride: null });
	/**
	 * A QR is only regenerated after the user edited the bank/account. Loading a
	 * saved config must NOT trigger it — that would replace (and delete) the QR
	 * the stored invitation already points to.
	 */
	const qrDirtyRef = useRef<Record<GiftSide, boolean>>({ groom: false, bride: false });

	/**
	 * The latest gifts, so a generation that finishes after the user edited the
	 * bank/account can be discarded instead of writing a QR for the old values.
	 */
	const giftsRef = useRef(config.gifts);
	useEffect(() => {
		giftsRef.current = config.gifts;
	}, [config.gifts]);

	const [uploadingPhotoField, setUploadingPhotoField] = useState<keyof InvitationPhotos | null>(null);
	const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

	const [uploadingStoryPhotoIndex, setUploadingStoryPhotoIndex] = useState<number | null>(null);
	const [storyPhotoError, setStoryPhotoError] = useState<string | null>(null);

	// Send the user back to this very step after they sign in.
	const loginHref = buildLoginHref(`/invitation#${activeTab}`);

	const availableSongs: Song[] = songs;
	const [playingSongUrl, setPlayingSongUrl] = useState<string | null>(null);
	const [expandedMusicSections, setExpandedMusicSections] = useState<Record<'english' | 'vietnamese', boolean>>({
		english: false,
		vietnamese: false
	});
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const musicSections = useMemo(() => {
		const english: Song[] = [];
		const vietnamese: Song[] = [];

		availableSongs.forEach((song) => {
			const songLang = (song.lang ?? '').trim().toLowerCase();
			if (songLang === 'vietnamese') {
				vietnamese.push(song);
			} else {
				english.push(song);
			}
		});

		return { english, vietnamese };
	}, [availableSongs]);

	const toggleMusicSection = (section: 'english' | 'vietnamese') => {
		setExpandedMusicSections((prev) => ({ ...prev, [section]: !prev[section] }));
	};

	// If user pastes Google Maps iframe embed HTML, extract the `src` attribute.
	const [mapEmbedWarning, setMapEmbedWarning] = useState<string | null>(null);

	function extractSrcFromEmbed(html: string): string | null {
		if (!html) return null;
		// Try to find src="..." first, then src='...'
		const dq = html.match(/src\s*=\s*"([^"]+)"/i);
		if (dq && dq[1]) return dq[1];
		const sq = html.match(/src\s*=\s*'([^']+)'/i);
		if (sq && sq[1]) return sq[1];
		return null;
	}

	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, []);

	const handleSelectMusic = (songUrl: string) => {
		updateField('musicUrl', songUrl);
	};

	const handlePlayMusic = (songUrl: string) => {
		if (!audioRef.current) {
			audioRef.current = new Audio(songUrl);
		}

		const audio = audioRef.current;
		const nextUrl = new URL(songUrl, window.location.origin).toString();
		const currentUrl = audio.src ? new URL(audio.src).toString() : '';

		if (playingSongUrl === songUrl && !audio.paused) {
			audio.pause();
			setPlayingSongUrl(null);
			return;
		}

		if (currentUrl !== nextUrl) {
			audio.src = nextUrl;
		}

		audio.play().catch(() => {
			setPlayingSongUrl(null);
		});
		setPlayingSongUrl(songUrl);
	};

	// Load the VietQR bank list once so the pickers only offer banks with a BIN.
	useEffect(() => {
		let cancelled = false;

		void getBanks().then((list) => {
			if (cancelled) return;
			setBanks(list);
			setBanksLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, []);

	const handleRemovePhoto = async (
		url: string | undefined,
		clearField: () => void,
		options?: { skipConfirm?: boolean }
	): Promise<boolean> => {
		const libraryPhoto = photos.find(
			(photo) => photo.url === url || photo.thumbnailUrl === url || photo.mediumUrl === url
		);

		if (libraryPhoto && !(await onDeletePhoto(libraryPhoto.id, options))) {
			// The deletion was cancelled or failed — keep the image in the form.
			return false;
		}

		clearField();
		return true;
	};

	/**
	 * Asks the backend to build a VietQR image for one gift, store it in S3 and
	 * point the form at the returned URL.
	 */
	const generateGiftQr = useCallback(
		async (who: GiftSide) => {
			if (!isLoggedIn) {
				setQrError((prev) => ({
					...prev,
					[who]: { message: 'Vui lòng đăng nhập để tạo mã QR.', needsLogin: true }
				}));
				return;
			}

			const gift = config.gifts[who];
			const { bankBin, accountNumber } = giftQrParams(gift, banks);

			if (!bankBin || accountNumber.length < 6) return;

			setQrError((prev) => ({ ...prev, [who]: null }));
			setQrGenerating((prev) => ({ ...prev, [who]: true }));

			try {
				const response = await generateVietQrPhoto({
					bankBin,
					accountNumber,
					previousUrl: gift.qrImage || undefined,
					label: who === 'groom' ? 'QR chú rể' : 'QR cô dâu'
				});

				if (response.success && response.data) {
					// The request may have outlived the values it was built from — e.g. the
					// user cleared the account while it was in flight. Applying that QR would
					// save a code that does not match the account, so drop it.
					const latest = giftQrParams(giftsRef.current[who], banks);
					if (latest.bankBin !== bankBin || latest.accountNumber !== accountNumber) return;

					updateGift(who, 'qrImage', response.data.url);
					qrDirtyRef.current[who] = false;
				} else {
					setQrError((prev) => ({
						...prev,
						[who]: {
							message: response.message || 'Không thể tạo mã QR. Vui lòng thử lại.',
							needsLogin: response.needsLogin
						}
					}));
				}
			} finally {
				setQrGenerating((prev) => ({ ...prev, [who]: false }));
			}
		},
		[banks, config.gifts, isLoggedIn, updateGift]
	);

	/**
	 * Keeps the stored QR in step with the bank/account inputs.
	 *
	 * Clearing the account must drop the QR, otherwise a code left over from a
	 * previous account number would be saved with the invitation and shown to
	 * guests beside an empty or mismatched account.
	 */
	const syncGiftQr = (who: GiftSide, nextGift: InvitationGift) => {
		if (canGenerateGiftQr(nextGift, banks)) {
			// The inputs are usable again, so a previous failure message is stale.
			setQrError((prev) => (prev[who] ? { ...prev, [who]: null } : prev));
			return;
		}

		const currentUrl = config.gifts[who].qrImage;
		if (!currentUrl) return;

		void handleRemovePhoto(currentUrl, () => updateGift(who, 'qrImage', ''), { skipConfirm: true });
	};

	const handleSelectBank = (who: GiftSide, bank: Bank) => {
		qrDirtyRef.current[who] = true;

		// The holder name belongs to the account, so switching bank invalidates it
		// (this also drops the placeholder name shipped with the template).
		if ((config.gifts[who].bank || '') !== bank.shortName) {
			updateGift(who, 'name', '');
		}

		updateGift(who, 'bank', bank.shortName);
		updateGift(who, 'bankBin', bank.bin);
		syncGiftQr(who, { ...config.gifts[who], bank: bank.shortName, bankBin: bank.bin });
	};

	const handleAccountNumberChange = (who: GiftSide, value: string) => {
		const account = sanitizeAccountNumber(value);
		qrDirtyRef.current[who] = true;
		updateGift(who, 'account', account);
		syncGiftQr(who, { ...config.gifts[who], account });
	};

	/**
	 * The holder name is shown on the invitation card, but it is not part of the
	 * QR image (`qr_only` ignores it), so editing it does NOT regenerate.
	 */
	const handleGiftNameChange = (who: GiftSide, value: string) => {
		updateGift(who, 'name', value);
	};

	/**
	 * "Tạo lại" is disabled while the gift cannot produce a QR, so there is no
	 * invalid-input case to report here.
	 */
	const handleRegenerateQr = (who: GiftSide) => {
		if (!canGenerateGiftQr(config.gifts[who], banks)) return;

		qrDirtyRef.current[who] = true;
		void generateGiftQr(who);
	};

	// Debounced auto-generation. It runs only after a real edit — never on load,
	// which would replace (and delete) the QR the saved invitation still points to.
	useEffect(() => {
		const timers = GIFT_SIDES.filter(
			(who) => qrDirtyRef.current[who] && canGenerateGiftQr(config.gifts[who], banks)
		).map((who) => setTimeout(() => void generateGiftQr(who), 700));

		return () => timers.forEach(clearTimeout);
	}, [banks, config.gifts, generateGiftQr]);

	const handleGalleryFileUpload = async (index: number, file: File | null) => {
		if (!file) return;

		if (!isLoggedIn) {
			setGalleryUploadError('Vui lòng đăng nhập hoặc đăng ký để tải ảnh lên.');
			return;
		}

		if (index >= MAX_GALLERY_IMAGES) {
			setGalleryUploadError(`Chỉ được tải lên tối đa ${MAX_GALLERY_IMAGES} ảnh.`);
			return;
		}

		setGalleryUploadError(null);
		setUploadingGalleryIndex(index);
		try {
			const response = await onUploadPhotos([file], 'invitation', '', ['invitation']);
			if (response.success && response.data && response.data.length > 0) {
				updateGalleryItem(index, response.data[0].url);
			} else {
				setGalleryUploadError(response.message || 'Không thể tải ảnh lên. Vui lòng thử lại.');
			}
		} catch (error) {
			setGalleryUploadError(error instanceof Error ? error.message : 'Không thể tải ảnh lên. Vui lòng thử lại.');
		} finally {
			setUploadingGalleryIndex(null);
		}
	};

	const handlePhotoFileUpload = async (field: keyof InvitationPhotos, file: File | null) => {
		if (!file) return;

		if (!isLoggedIn) {
			setPhotoUploadError('Vui lòng đăng nhập hoặc đăng ký để tải ảnh lên.');
			return;
		}

		setPhotoUploadError(null);
		setUploadingPhotoField(field);
		try {
			const response = await onUploadPhotos([file], 'invitation', '', ['invitation']);
			if (response.success && response.data && response.data.length > 0) {
				updatePhoto(field, response.data[0].url);
			} else {
				setPhotoUploadError(response.message || 'Không thể tải ảnh lên. Vui lòng thử lại.');
			}
		} catch (error) {
			setPhotoUploadError(error instanceof Error ? error.message : 'Không thể tải ảnh lên. Vui lòng thử lại.');
		} finally {
			setUploadingPhotoField(null);
		}
	};

	/**
	 * Uploads the photo for one story milestone and stores its URL on the item.
	 */
	const handleStoryPhotoUpload = async (index: number, file: File | null) => {
		if (!file) return;

		if (!isLoggedIn) {
			setStoryPhotoError('Vui lòng đăng nhập hoặc đăng ký để tải ảnh lên.');
			return;
		}

		setStoryPhotoError(null);
		setUploadingStoryPhotoIndex(index);
		try {
			const response = await onUploadPhotos([file], 'invitation', '', ['invitation']);
			if (response.success && response.data && response.data.length > 0) {
				updateStoryItem(index, 'photo', response.data[0].url);
			} else {
				setStoryPhotoError(response.message || 'Không thể tải ảnh lên. Vui lòng thử lại.');
			}
		} catch (error) {
			setStoryPhotoError(error instanceof Error ? error.message : 'Không thể tải ảnh lên. Vui lòng thử lại.');
		} finally {
			setUploadingStoryPhotoIndex(null);
		}
	};

	/**
	 * Gallery replacement must not use the default remove-then-upload flow:
	 * `removeGalleryRow` drops the array entry, which shifts the index of every
	 * later slot. Clear the slot in place instead, then upload over it.
	 */
	const handleGalleryReplace = async (index: number, file: File) => {
		const removed = await handleRemovePhoto(
			config.gallery[index],
			() => updateGalleryItem(index, ''),
			{ skipConfirm: true }
		);
		if (!removed) return;

		await handleGalleryFileUpload(index, file);
	};

	return (
		<section id="input" className={`mx-auto max-w-7xl ${activeTab === 'input' ? '' : 'hidden'}`}>
			<div className="rounded-2xl border border-pink-100 bg-pink-50/70 mt-6 p-4 text-sm text-pink-600">
				<div className="flex items-center justify-between gap-3">
					<p className="inline-flex items-center gap-1 font-semibold">
						Đang dùng mẫu: {selectedTemplate.name}
					</p>
					<button
						type="button"
						onClick={() => setActiveTab('select')}
						className="shrink-0 rounded-lg border border-pink-300 bg-white px-3 py-1.5 text-xs font-medium text-pink-700 transition hover:bg-pink-50"
					>
						Đổi mẫu
					</button>
				</div>
				<p className="mt-1">Điền đầy đủ thông tin bên dưới, ấn &ldquo;Lưu&rdquo;, sau đó ấn &ldquo;3. Xem thiệp &rdquo;.</p>
			</div>

			{!isLoggedIn ? (
				<div className="mt-4 rounded-xl border border-pink-100 bg-pink-50 p-4 text-center text-sm text-pink-600">
					<p className="font-medium">Vui lòng đăng nhập / đăng ký để nhập thông tin thiệp cưới.</p>
					<div className="mt-3 flex items-center justify-center gap-3">
						<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng nhập</Link>
						<span className="text-pink-700">/</span>
						<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng ký</Link>
					</div>
				</div>
			) : null}

			<form className="mt-6 space-y-8" onSubmit={(event) => event.preventDefault()}>
				<fieldset disabled={!isLoggedIn} className="m-0 min-w-0 space-y-8 border-0 p-0">
				{/* Cô dâu & chú rể */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Cô Dâu &amp; Chú Rể</h2>
					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						<Field label="Tên đầy đủ chú rể">
							<input
								required
								value={config.groomFull}
								onChange={(e) => updateField('groomFull', e.target.value)}
								className="input"
							/>
						</Field>
						<Field label="Tên gọi ngắn (hiển thị ở bìa)">
							<input
								required
								value={config.groomShort}
								onChange={(e) => updateField('groomShort', e.target.value)}
								className="input"
							/>
						</Field>
						<Field label="Tên đầy đủ cô dâu">
							<input
								required
								value={config.brideFull}
								onChange={(e) => updateField('brideFull', e.target.value)}
								className="input"
							/>
						</Field>
						<Field label="Tên gọi ngắn (hiển thị ở bìa)">
							<input
								required
								value={config.brideShort}
								onChange={(e) => updateField('brideShort', e.target.value)}
								className="input"
							/>
						</Field>
						<Field label="Vai vế chú rể (VD: Trưởng Nam)">
							<input value={config.groomRole} onChange={(e) => updateField('groomRole', e.target.value)} className="input" />
						</Field>
						<Field label="Vai vế cô dâu (VD: Út Nữ)">
							<input value={config.brideRole} onChange={(e) => updateField('brideRole', e.target.value)} className="input" />
						</Field>
						{/* <Field label="Chữ lồng viết tắt (2-3 ký tự, hiện ở bìa)" full>
							<input
								maxLength={3}
								value={config.monogram}
								onChange={(e) => updateField('monogram', e.target.value.toUpperCase())}
								className="input"
							/>
						</Field> */}
					</div>

					{/* Chuyện tình (chỉ với mẫu hỗ trợ, VD: Thiệp cưới song long) */}
					{features.story ? (
						<div className="mt-6 border-t border-slate-100 pt-6">
							<h3 className="text-sm font-semibold text-slate-900">Chuyện Tình</h3>
							<p className="mt-1 text-xs text-slate-500">Thêm từng cột mốc trong chuyện tình của hai bạn</p>
							<div className="mt-4 space-y-3">
								{config.story?.map((item, index) => (
									<div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
										<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
											<LabeledImageUploadCard
												label=""
												variant="square"
												value={item.photo ?? ''}
												uploading={uploadingStoryPhotoIndex === index}
												onUpload={(file) => handleStoryPhotoUpload(index, file)}
												onRemove={(options) =>
													handleRemovePhoto(item.photo, () => updateStoryItem(index, 'photo', ''), options)
												}
												touchRemoveLabel="Xoá"
												touchReplaceLabel="Đổi"
											/>
											<div className="grid min-w-0 flex-1 gap-2">
												<div className="grid gap-2 sm:grid-cols-2">
													<input
														placeholder="Mốc thời gian (VD: Mùa thu 2021)"
														value={item.date}
														onChange={(e) => updateStoryItem(index, 'date', e.target.value)}
														className="input"
													/>
													<input
														placeholder="Tiêu đề (VD: Lần đầu gặp gỡ)"
														value={item.title ?? ''}
														onChange={(e) => updateStoryItem(index, 'title', e.target.value)}
														className="input"
													/>
												</div>
												<input
													placeholder="Nội dung (VD: Lần đầu gặp gỡ tại một quán cà phê nhỏ ven sông.)"
													value={item.text}
													onChange={(e) => updateStoryItem(index, 'text', e.target.value)}
													className="input"
												/>
											</div>
											<button
												type="button"
												onClick={() => removeStoryRow(index)}
												className="self-end rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-pink-300 hover:text-pink-600 sm:self-auto"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								))}
							</div>
							{storyPhotoError ? (
								<div className="mt-3 rounded-xl border border-pink-100 bg-pink-50 p-3 text-xs text-pink-600">
									<p>{storyPhotoError}</p>
									<div className="mt-2 flex gap-2">
										<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng nhập</Link>
										<span className="text-pink-700">/</span>
										<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng ký</Link>
									</div>
								</div>
							) : null}
							<button
								type="button"
								onClick={addStoryRow}
								className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-pink-300 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-50"
							>
								<Plus className="h-3.5 w-3.5" />
								Thêm cột mốc
							</button>
						</div>
					) : null}

					{/* Ảnh trên thiệp (mẫu hỗ trợ khai báo `photos` trong config) */}
					{features.photos ? (
						<div className="mt-6 border-t border-slate-100 pt-6">
							<h3 className="text-sm font-semibold text-slate-900">Ảnh Trên Thiệp</h3>
							<p className="mt-1 text-xs text-slate-500">Tải ảnh lên để hiển thị trong thiệp. Lưu ý: Không hiển thị cho mẫu thiệp tối giản</p>
							<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
								<LabeledImageUploadCard
									label="Ảnh bìa"
									variant="square"
									value={config.photos?.coverPhoto ?? ''}
									uploading={uploadingPhotoField === 'coverPhoto'}
									onUpload={(file) => handlePhotoFileUpload('coverPhoto', file)}
									onRemove={(options) => handleRemovePhoto(config.photos?.coverPhoto, () => updatePhoto('coverPhoto', ''), options)}
									touchRemoveLabel="Xoá"
									touchReplaceLabel="Đổi"
								/>
								<LabeledImageUploadCard
									label="Ảnh chú rể"
									variant="square"
									value={config.photos?.groomPhoto ?? ''}
									uploading={uploadingPhotoField === 'groomPhoto'}
									onUpload={(file) => handlePhotoFileUpload('groomPhoto', file)}
									onRemove={(options) => handleRemovePhoto(config.photos?.groomPhoto, () => updatePhoto('groomPhoto', ''), options)}
									touchRemoveLabel="Xoá"
									touchReplaceLabel="Đổi"
								/>
								<LabeledImageUploadCard
									label="Ảnh cô dâu"
									variant="square"
									value={config.photos?.bridePhoto ?? ''}
									uploading={uploadingPhotoField === 'bridePhoto'}
									onUpload={(file) => handlePhotoFileUpload('bridePhoto', file)}
									onRemove={(options) => handleRemovePhoto(config.photos?.bridePhoto, () => updatePhoto('bridePhoto', ''), options)}
									touchRemoveLabel="Xoá"
									touchReplaceLabel="Đổi"
								/>
							</div>
							{photoUploadError ? (
								<div className="mt-3 rounded-xl border border-pink-100 bg-pink-50 p-3 text-xs text-pink-600">
									<p>{photoUploadError}</p>
									<div className="mt-2 flex gap-2">
										<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng nhập</Link>
										<span className="text-pink-700">/</span>
										<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng ký</Link>
									</div>
								</div>
							) : null}
						</div>
					) : null}
				</section>

				{/* Gia đình hai bên */}
				{(features.groomParents && features.brideParents) ? (
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Gia Đình Hai Bên</h2>
					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						<Field label="Cha chú rể">
							<input value={config.groomParents?.father} onChange={(e) => updateGroomParent('father', e.target.value)} className="input" />
						</Field>
						<Field label="Mẹ chú rể">
							<input value={config.groomParents?.mother} onChange={(e) => updateGroomParent('mother', e.target.value)} className="input" />
						</Field>
						<Field label="Địa chỉ nhà trai" full>
							<input value={config.groomParents?.address} onChange={(e) => updateGroomParent('address', e.target.value)} className="input" />
						</Field>
						<Field label="Cha cô dâu">
							<input value={config.brideParents?.father} onChange={(e) => updateBrideParent('father', e.target.value)} className="input" />
						</Field>
						<Field label="Mẹ cô dâu">
							<input value={config.brideParents?.mother} onChange={(e) => updateBrideParent('mother', e.target.value)} className="input" />
						</Field>
						<Field label="Địa chỉ nhà gái" full>
							<input value={config.brideParents?.address} onChange={(e) => updateBrideParent('address', e.target.value)} className="input" />
						</Field>
					</div>
						
				</section>
				) : null}

				{/* Lễ cưới */}
				{features.ceremony ? (
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Lễ Cưới</h2>
					<div className="mt-4 grid gap-3 sm:grid-cols-3">
						<Field label="Ngày cưới (dương lịch)">
							<input
								required
								type="date"
								value={weddingDate}
								onChange={(e) => {
									handleWeddingDateChange(e.target.value);
									e.target.blur();
								}}
								className="input"
							/>
						</Field>
						<Field label="Giờ làm lễ">
							<input
								type="time"
								value={config.ceremony?.time}
								onChange={(e) => {
									updateCeremony('time', e.target.value);
									e.target.blur();
								}}
								className="input"
							/>
						</Field>
						<div />
						<Field label="Ngày âm lịch (tuỳ chọn)" full>
							<input
								placeholder="VD: Nhằm ngày 11 tháng 11 năm Bính Ngọ"
								value={config.ceremony?.lunar ?? ''}
								onChange={(e) => updateCeremony('lunar', e.target.value)}
								className="input"
							/>
						</Field>
					</div>
				</section>
				) : null}

				{/* Tiệc cưới */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Tiệc Cưới</h2>
					<div className="mt-4 grid gap-3 sm:grid-cols-3">
						<Field label="Ngày tổ chức tiệc">
							<input
								required
								type="date"
								value={config.reception.date}
								onChange={(e) => {
									updateReception('date', e.target.value);
									e.target.blur();
								}}
								className="input"
							/>
						</Field>
						<Field label="Giờ đón khách">
							<input
								type="time"
								value={config.reception.welcomeTime}
								onChange={(e) => {
									updateReception('welcomeTime', e.target.value);
									e.target.blur();
								}}
								className="input"
							/>
						</Field>
						<Field label="Giờ khai tiệc">
							<input
								required
								type="time"
								value={config.reception.startTime}
								onChange={(e) => {
									updateReception('startTime', e.target.value);
									e.target.blur();
								}}
								className="input"
							/>
						</Field>
					</div>
					<div className="mt-4">
						<Field label="Tên nhà hàng / trung tâm tiệc cưới">
							<input
								required
								value={config.reception.venueName}
								onChange={(e) => updateReception('venueName', e.target.value)}
								className="input"
							/>
						</Field>
						<Field label="Địa chỉ">
							<input
								required
								value={config.reception.address}
								onChange={(e) => updateReception('address', e.target.value)}
								className="input"
							/>
						</Field>
					</div>
					<div className="mt-4">
						<Field label="Nhúng bản đồ Google (tuỳ chọn)" full>
							<div>
								<input
									placeholder={`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d313...`}
									value={config.reception.mapQuery}
									onChange={(e) => {
										const v = e.target.value;
										if (v.includes('<iframe')) {
											const src = extractSrcFromEmbed(v);
											if (src) {
												updateReception('mapQuery', src);
												setMapEmbedWarning(null);
											} else {
												setMapEmbedWarning('Không tìm thấy thuộc tính src trong HTML embed. Vui lòng dán đúng iframe từ Google Maps.');
												updateReception('mapQuery', '');
											}
										} else {
											updateReception('mapQuery', v);
											setMapEmbedWarning(null);
										}
									}}
									className="input"
								/>
								<div className="mt-2 flex">
									<a href="/blog/nhung-ban-do-vao-thiep-cuoi" target="_blank" rel="noreferrer" className="text-sm font-medium text-pink-600 hover:underline">
										Xem hướng dẫn cách nhúng bản đồ
									</a>
								</div>
							</div>
						</Field>
						{mapEmbedWarning ? <p className="mt-2 text-xs text-pink-600">{mapEmbedWarning}</p> : null}
					</div>
				</section>

				{/* Lịch trình */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Lịch Trình Ngày Cưới</h2>
					<p className="mt-1 text-xs text-slate-500">Thêm từng mốc thời gian</p>
					<div className="mt-4 space-y-2">
						{config.schedule.map((item, index) => (
							<div key={index} className="flex items-center gap-2">
								<input
									placeholder="Giờ"
									value={item.time}
									onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
									className="input max-w-24"
								/>
								<input
									placeholder="Nội dung (VD: Đón khách)"
									value={item.label}
									onChange={(e) => updateScheduleItem(index, 'label', e.target.value)}
									className="input"
								/>
								<button
									type="button"
									onClick={() => removeScheduleRow(index)}
									className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-pink-300 hover:text-pink-600"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={addScheduleRow}
						className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-pink-300 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-50"
					>
						<Plus className="h-3.5 w-3.5" />
						Thêm mốc thời gian
					</button>
				</section>

				{/* Album ảnh */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Album Ảnh</h2>
					<p className="mt-1 text-xs text-slate-500">
						Hiển thị trong thiệp (tối đa {MAX_GALLERY_IMAGES} ảnh).
					</p>
					<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
						{config.gallery.map((url, index) => (
							<ImageUploadCard
								key={index}
								value={url}
								alt={`Ảnh cưới ${index + 1}`}
								variant="square"
								uploading={uploadingGalleryIndex === index}
								onUpload={(file) => handleGalleryFileUpload(index, file)}
								onRemove={() => removeGalleryRow(index)}
								onReplace={(file) => handleGalleryReplace(index, file)}
								touchRemoveLabel="Xoá"
								touchReplaceLabel="Đổi"
							/>
						))}
					</div>
					{galleryUploadError ? (
						<div className="mt-3 rounded-xl border border-pink-100 bg-pink-50 p-3 text-xs text-pink-600">
							<p>{galleryUploadError}</p>
							<div className="mt-2 flex gap-2">
								<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng nhập</Link>
								<span className="text-pink-700">/</span>
								<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng ký</Link>
							</div>
						</div>
					) : null}
					<p className="mt-3 text-xs text-slate-500">
						{config.gallery.length}/{MAX_GALLERY_IMAGES} ảnh
					</p>
					{config.gallery.length < MAX_GALLERY_IMAGES ? (
						<button
							type="button"
							onClick={addGalleryRow}
							className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-pink-300 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-50"
						>
							<Plus className="h-3.5 w-3.5" />
							Thêm ảnh
						</button>
					) : (
						<p className="mt-2 text-xs font-medium text-pink-600">
							Đã đạt tối đa {MAX_GALLERY_IMAGES} ảnh.
						</p>
					)}
				</section>

				{/* Nhạc nền */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Nhạc Nền</h2>
					<p className="mt-1 text-xs text-slate-500">
						Chọn nhạc trong danh sách bên dưới — nhạc sẽ tự phát khi khách bấm &ldquo;Mở Thiệp&rdquo;. Liên hệ khi bạn muốn bài hát khác.
					</p>

					{/* Music Sections */}
					<div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
						{/* English Songs */}
						<div>
							<button
								type="button"
								onClick={() => toggleMusicSection('english')}
								className="flex w-full items-center justify-between rounded-t-xl px-4 py-3 text-left text-sm font-semibold transition hover:bg-slate-50"
							>
								<span className="flex items-center gap-2">
									{/* <MusicNote className="h-5 w-5 text-pink-600" /> */}
									<span className="text-slate-900">Nhạc tiếng Anh</span>
								</span>
								{expandedMusicSections.english ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-slate-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-slate-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</button>
							<div className={`${expandedMusicSections.english ? '' : 'hidden'}`}>
								{musicSections.english.length === 0 ? (
									<div className="p-4 text-center text-sm text-slate-500">
										Không có bài hát tiếng Anh nào trong danh sách.
									</div>
								) : (
									musicSections.english.map((song) => {
										const isSelected = config.musicUrl === song.url;
										const isPlaying = playingSongUrl === song.url;
										return (
											<div key={song.url} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
												<div className="min-w-0 flex-1">
													<span className="truncate text-sm font-medium text-slate-700">{song.name}</span>
													{song.singer ? <span className="block text-xs text-slate-500 truncate">{song.singer}</span> : null}
												</div>
												<div className="flex shrink-0 gap-2">
													<button
														type="button"
														onClick={() => handlePlayMusic(song.url)}
														className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-pink-300 hover:text-pink-600"
													>
														{isPlaying ? 'Dừng' : 'Play'}
													</button>
													<button
														type="button"
														onClick={() => handleSelectMusic(song.url)}
														className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
															isSelected
																? 'bg-pink-600 text-white'
																: 'border border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:text-pink-600'
														}`}
													>
														{isSelected ? 'Đã chọn' : 'Chọn'}
													</button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>

						{/* Vietnamese Songs */}
						<div>
							<button
								type="button"
								onClick={() => toggleMusicSection('vietnamese')}
								className="flex w-full items-center justify-between rounded-t-xl px-4 py-3 text-left text-sm font-semibold transition hover:bg-slate-50"
							>
								<span className="flex items-center gap-2">
									{/* <MusicNote className="h-5 w-5 text-pink-600" /> */}
									<span className="text-slate-900">Nhạc tiếng Việt</span>
								</span>
								{expandedMusicSections.vietnamese ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-slate-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-slate-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</button>
							<div className={`${expandedMusicSections.vietnamese ? '' : 'hidden'}`}>
								{musicSections.vietnamese.length === 0 ? (
									<div className="p-4 text-center text-sm text-slate-500">
										Không có bài hát tiếng Việt nào trong danh sách.
									</div>
								) : (
									musicSections.vietnamese.map((song) => {
										const isSelected = config.musicUrl === song.url;
										const isPlaying = playingSongUrl === song.url;
										return (
											<div key={song.url} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
												<div className="min-w-0 flex-1">
													<span className="truncate text-sm font-medium text-slate-700">{song.name}</span>
													{song.singer ? <span className="block text-xs text-slate-500 truncate">{song.singer}</span> : null}
												</div>
												<div className="flex shrink-0 gap-2">
													<button
														type="button"
														onClick={() => handlePlayMusic(song.url)}
														className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-pink-300 hover:text-pink-600"
													>
														{isPlaying ? 'Dừng' : 'Play'}
													</button>
													<button
														type="button"
														onClick={() => handleSelectMusic(song.url)}
														className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
															isSelected
																? 'bg-pink-600 text-white'
																: 'border border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:text-pink-600'
														}`}
													>
														{isSelected ? 'Đã chọn' : 'Chọn'}
													</button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Mừng cưới online */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Mừng Cưới Online</h2>
					<p className="mt-1 text-xs text-slate-500">Thông tin ngân hàng (tuỳ chọn)</p>
					<div className="mt-4 grid gap-6 sm:grid-cols-2">
						<GiftColumn
							who="groom"
							gift={config.gifts.groom}
							showQr={Boolean(config.gifts.groom.qrImage)}
							banks={banks}
							banksLoading={banksLoading}
							generating={qrGenerating.groom}
							error={qrError.groom}
							onSelectBank={(bank) => handleSelectBank('groom', bank)}
							onAccountChange={(value) => handleAccountNumberChange('groom', value)}
							onNameChange={(value) => handleGiftNameChange('groom', value)}
							onRegenerate={() => handleRegenerateQr('groom')}
							loginHref={loginHref}
						/>
						<GiftColumn
							who="bride"
							gift={config.gifts.bride}
							showQr={Boolean(config.gifts.groom.qrImage)}
							banks={banks}
							banksLoading={banksLoading}
							generating={qrGenerating.bride}
							error={qrError.bride}
							onSelectBank={(bank) => handleSelectBank('bride', bank)}
							onAccountChange={(value) => handleAccountNumberChange('bride', value)}
							onNameChange={(value) => handleGiftNameChange('bride', value)}
							onRegenerate={() => handleRegenerateQr('bride')}
							loginHref={loginHref}
						/>
					</div>
				</section>
				</fieldset>
			</form>

			{/* Sticky "Lưu" button — runs the same backend request as "3. Xem thiệp",
			    which stores the form in the current user's account. The outcome is
			    announced by the host page through a toast. The wrapper only exists
			    to pin the button; it has no background of its own. */}
			<div className="sticky bottom-3 md:bottom-6 z-20 flex justify-end">
				<button
					type="button"
					onClick={onSave}
					disabled={isSaving || !isLoggedIn}
					className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
					{isSaving ? 'Đang lưu...' : 'Lưu'}
				</button>
			</div>
		</section>
	);
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
	return (
		<div className={full ? 'sm:col-span-2' : ''}>
			<label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
			{children}
		</div>
	);
}

/**
 * One giver column: the generated VietQR preview above the bank / account
 * number / holder name inputs that produce it.
 */
function GiftColumn({
	who,
	gift,
	showQr,
	banks,
	banksLoading,
	generating,
	error,
	onSelectBank,
	onAccountChange,
	onNameChange,
	onRegenerate,
	loginHref
}: {
	who: GiftSide;
	gift: InvitationGift;
	showQr: boolean;
	banks: Bank[];
	banksLoading: boolean;
	generating: boolean;
	error: QrError | null;
	onSelectBank: (bank: Bank) => void;
	onAccountChange: (value: string) => void;
	onNameChange: (value: string) => void;
	onRegenerate: () => void;
	loginHref: string;
}) {
	const label = who === 'groom' ? 'chú rể' : 'cô dâu';
	const canGenerate = canGenerateGiftQr(gift, banks);
	// A QR with no bank/account behind it is not shown (see `syncGiftQr`). While the
	// bank list is still loading a legacy config cannot be verified, so it stays
	// visible rather than flickering away.
	const qrUrl = canGenerate || banksLoading ? gift.qrImage : undefined;

	return (
		<div>
			{showQr ? (
				<div className="mb-3">
					<div className="flex items-center justify-between gap-2">
						<p className="text-xs font-medium text-slate-600">QR {label}</p>
						<button
							type="button"
							onClick={onRegenerate}
							disabled={generating || !canGenerate}
							className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-pink-300 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{generating ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<RefreshCw className="h-3 w-3" />
							)}
							Tạo lại
						</button>
					</div>

					<div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white">
						{qrUrl ? (
							<Image
								src={qrUrl}
								alt={`QR ${label}`}
								fill
								sizes="128px"
								className="object-contain"
							/>
						) : (
							<span className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] text-slate-400">
								Nhập ngân hàng và số tài khoản để tạo mã QR
							</span>
						)}

						{generating ? (
							<div className="absolute inset-0 flex items-center justify-center bg-white/70">
								<Loader2 className="h-5 w-5 animate-spin text-pink-600" />
							</div>
						) : null}
					</div>

					{/* The QR is a bare code, so the account details the guest will
					    see are spelled out underneath it. */}
					{qrUrl ? (
						<div className="mt-2 w-32 text-[11px] leading-snug text-slate-500">
							<p className="truncate font-medium text-slate-700" title={gift.name}>
								{gift.name || '—'}
							</p>
							<p className="truncate">{gift.bank}</p>
							<p className="truncate tabular-nums">{gift.account}</p>
						</div>
					) : null}

					{error ? (
						<div className="mt-2 rounded-xl border border-pink-100 bg-pink-50 p-3 text-xs text-pink-600">
							<p>{error.message}</p>
							{error.needsLogin ? (
								<div className="mt-2 flex gap-2">
									<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng nhập</Link>
									<span className="text-pink-700">/</span>
									<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng ký</Link>
								</div>
							) : null}
						</div>
					) : null}
				</div>
			) : null}

			<div className="grid gap-2">
				<Field label={`Ngân hàng (${label})`}>
					<BankSelect
						value={gift.bank}
						banks={banks}
						loading={banksLoading}
						onSelect={onSelectBank}
					/>
				</Field>
				<Field label={`Số tài khoản (${label})`}>
					<input
						inputMode="numeric"
						autoComplete="off"
						value={gift.account}
						onChange={(event) => onAccountChange(event.target.value)}
						className="input"
					/>
				</Field>
				<Field label={`Tên chủ tài khoản (${label})`}>
					<input
						value={gift.name}
						onChange={(event) => onNameChange(event.target.value)}
						className="input"
					/>
				</Field>
			</div>
		</div>
	);
}

