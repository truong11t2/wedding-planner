'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import ImageUploadCard, { LabeledImageUploadCard } from '@/components/common/ImageUploadCard';
import { useAuth } from '@/context/AuthContext';
import type { Photo } from '@/api/photo';
import type { PhotoUploadResult } from '@/lib/usePhotoLibrary';
import { MAX_GALLERY_IMAGES } from '@/api/invitation';
import type { InvitationConfig, InvitationPhotos, InvitationScheduleItem, InvitationStoryItem } from '@/api/invitation';
import type { InvitationTemplate } from '@/data/invitationTemplates';
import type { InvitationTemplateFormFeatures } from '@/data/invitationConfigs';
import { buildLoginHref } from '@/lib/authRedirect';
import songs from '@/public/music/songs.json';

type InvitationTab = 'select' | 'input' | 'preview' | 'share';
type Song = { name: string; singer?: string; lang?: string; url: string };

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
	updateGroomParent: (field: keyof InvitationConfig['groomParents'], value: string) => void;
	updateBrideParent: (field: keyof InvitationConfig['brideParents'], value: string) => void;
	updateCeremony: (field: keyof InvitationConfig['ceremony'], value: string) => void;
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

	const [uploadingQrFor, setUploadingQrFor] = useState<'groom' | 'bride' | null>(null);
	const [qrUploadError, setQrUploadError] = useState<string | null>(null);

	const [uploadingPhotoField, setUploadingPhotoField] = useState<keyof InvitationPhotos | null>(null);
	const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

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

	const handleQrImageUpload = async (who: 'groom' | 'bride', file: File | null) => {
		if (!file) return;

		if (!isLoggedIn) {
			setQrUploadError('Vui lòng đăng nhập hoặc đăng ký để tải ảnh QR lên.');
			return;
		}

		setQrUploadError(null);
		setUploadingQrFor(who);
		try {
			const response = await onUploadPhotos([file], 'invitation', '', ['invitation', 'qr']);
			if (response.success && response.data && response.data.length > 0) {
				updateGift(who, 'qrImage', response.data[0].url);
			} else {
				setQrUploadError(response.message || 'Không thể tải ảnh QR lên. Vui lòng thử lại.');
			}
		} catch (error) {
			setQrUploadError(error instanceof Error ? error.message : 'Không thể tải ảnh QR lên. Vui lòng thử lại.');
		} finally {
			setUploadingQrFor(null);
		}
	};


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

			<form className="mt-6 space-y-8" onSubmit={(event) => event.preventDefault()}>
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
					{/* {config.story ? (
						<div className="mt-6 border-t border-slate-100 pt-6">
							<h3 className="text-sm font-semibold text-slate-900">Chuyện Tình</h3>
							<p className="mt-1 text-xs text-slate-500">Thêm từng cột mốc trong chuyện tình của hai bạn</p>
							<div className="mt-4 space-y-2">
								{config.story.map((item, index) => (
									<div key={index} className="flex items-center gap-2">
										<input
											placeholder="Mốc thời gian (VD: Mùa thu 2021)"
											value={item.date}
											onChange={(e) => updateStoryItem(index, 'date', e.target.value)}
											className="input max-w-48"
										/>
										<input
											placeholder="Nội dung (VD: Lần đầu gặp gỡ tại một quán cà phê nhỏ ven sông.)"
											value={item.text}
											onChange={(e) => updateStoryItem(index, 'text', e.target.value)}
											className="input"
										/>
										<button
											type="button"
											onClick={() => removeStoryRow(index)}
											className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-pink-300 hover:text-pink-600"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
							<button
								type="button"
								onClick={addStoryRow}
								className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-pink-300 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-50"
							>
								<Plus className="h-3.5 w-3.5" />
								Thêm cột mốc
							</button>
						</div>
					) : null} */}

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
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Gia Đình Hai Bên</h2>
					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						<Field label="Cha chú rể">
							<input value={config.groomParents.father} onChange={(e) => updateGroomParent('father', e.target.value)} className="input" />
						</Field>
						<Field label="Mẹ chú rể">
							<input value={config.groomParents.mother} onChange={(e) => updateGroomParent('mother', e.target.value)} className="input" />
						</Field>
						<Field label="Địa chỉ nhà trai" full>
							<input value={config.groomParents.address} onChange={(e) => updateGroomParent('address', e.target.value)} className="input" />
						</Field>
						<Field label="Cha cô dâu">
							<input value={config.brideParents.father} onChange={(e) => updateBrideParent('father', e.target.value)} className="input" />
						</Field>
						<Field label="Mẹ cô dâu">
							<input value={config.brideParents.mother} onChange={(e) => updateBrideParent('mother', e.target.value)} className="input" />
						</Field>
						<Field label="Địa chỉ nhà gái" full>
							<input value={config.brideParents.address} onChange={(e) => updateBrideParent('address', e.target.value)} className="input" />
						</Field>
					</div>
				</section>

				{/* Lễ cưới */}
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
								value={config.ceremony.time}
								onChange={(e) => {
									updateCeremony('time', e.target.value);
									e.target.blur();
								}}
								className="input"
							/>
						</Field>
						<div />
						{features.lunar ? (
							<Field label="Ngày âm lịch (tuỳ chọn)" full>
								<input
									placeholder="VD: Nhằm ngày 11 tháng 11 năm Bính Ngọ"
									value={config.ceremony.lunar}
									onChange={(e) => updateCeremony('lunar', e.target.value)}
									className="input"
								/>
							</Field>
						) : null}
					</div>
				</section>

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
						{features.welcomeTime ? (
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
						) : null}
						{features.startTime ? (
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
						) : null}
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
				{features.schedule ? (
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
				) : null}

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
					{features.qrGift ? (
					<p className="mt-1 text-xs text-slate-500">Thông tin ngân hàng (tuỳ chọn)</p>
					) : null}
					<div className="mt-4 grid gap-6 sm:grid-cols-2">
						<div>
							{features.qrGift ? (
							<>
							<p className="mb-2 text-xs font-medium text-slate-600">QR chú rể</p>
							<ImageUploadCard
								variant="square"
								value={config.gifts.groom.qrImage}
								alt="QR chú rể"
								sizes="128px"
								placeholderText="Tải ảnh QR"
								uploading={uploadingQrFor === 'groom'}
								onUpload={(file) => handleQrImageUpload('groom', file)}
								onRemove={(options) => handleRemovePhoto(config.gifts?.groom?.qrImage, () => updateGift('groom', 'qrImage', ''), options)}
								touchRemoveLabel="Xoá"
								touchReplaceLabel="Đổi"
							/>
							</>
							) : null}
							<div className="mt-3 grid gap-2">
								<Field label="Ngân hàng (chú rể)">
									<input value={config.gifts.groom.bank} onChange={(e) => updateGift('groom', 'bank', e.target.value)} className="input" />
								</Field>
								<Field label="Số tài khoản (chú rể)">
									<input value={config.gifts.groom.account} onChange={(e) => updateGift('groom', 'account', e.target.value)} className="input" />
								</Field>
								<Field label="Tên chủ tài khoản (chú rể)">
									<input value={config.gifts.groom.name} onChange={(e) => updateGift('groom', 'name', e.target.value)} className="input" />
								</Field>
							</div>
						</div>
						<div>
							{features.qrGift ? (
							<>
							<p className="mb-2 text-xs font-medium text-slate-600">QR cô dâu</p>
							<ImageUploadCard
								variant="square"
								value={config.gifts.bride.qrImage}
								alt="QR cô dâu"
								sizes="128px"
								placeholderText="Tải ảnh QR"
								uploading={uploadingQrFor === 'bride'}
								onUpload={(file) => handleQrImageUpload('bride', file)}
								onRemove={(options) => handleRemovePhoto(config.gifts?.bride?.qrImage, () => updateGift('bride', 'qrImage', ''), options)}
								touchRemoveLabel="Xoá"
								touchReplaceLabel="Đổi"
							/>
							</>
							) : null}
							<div className="mt-3 grid gap-2">
								<Field label="Ngân hàng (cô dâu)">
									<input value={config.gifts.bride.bank} onChange={(e) => updateGift('bride', 'bank', e.target.value)} className="input" />
								</Field>
								<Field label="Số tài khoản (cô dâu)">
									<input value={config.gifts.bride.account} onChange={(e) => updateGift('bride', 'account', e.target.value)} className="input" />
								</Field>
								<Field label="Tên chủ tài khoản (cô dâu)">
									<input value={config.gifts.bride.name} onChange={(e) => updateGift('bride', 'name', e.target.value)} className="input" />
								</Field>
							</div>
						</div>
					</div>
					{qrUploadError ? (
						<div className="mt-3 rounded-xl border border-pink-100 bg-pink-50 p-3 text-xs text-pink-600">
							<p>{qrUploadError}</p>
							<div className="mt-2 flex gap-2">
								<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng nhập</Link>
								<span className="text-pink-700">/</span>
								<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng ký</Link>
							</div>
						</div>
					) : null}
				</section>
			</form>

			{/* Sticky "Lưu" button — runs the same backend request as "3. Xem thiệp",
			    which stores the form in the current user's account. The outcome is
			    announced by the host page through a toast. The wrapper only exists
			    to pin the button; it has no background of its own. */}
			<div className="sticky bottom-3 md:bottom-6 z-20 flex justify-end">
				<button
					type="button"
					onClick={onSave}
					disabled={isSaving}
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

