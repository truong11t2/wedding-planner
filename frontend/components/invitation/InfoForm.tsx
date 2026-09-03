'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { uploadPhotos as apiUploadPhotos } from '@/api/photo';
import type { InvitationConfig, InvitationPhotos, InvitationScheduleItem, InvitationStoryItem } from '@/api/invitation';
import type { InvitationTemplate } from '@/data/invitationTemplates';
import songs from '@/public/music/songs.json';

type InvitationTab = 'template' | 'info' | 'invitation' | 'share';
type Song = { name: string; singer?: string; lang?: string; url: string };

interface InfoFormProps {
	activeTab: InvitationTab;
	setActiveTab: (tab: InvitationTab) => void;
	selectedTemplate: InvitationTemplate;
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
}

/**
 * Tab 2 — "Nhập thông tin": the wedding information form.
 *
 * Kept as its own file so `app/invitation/page.tsx` stays focused on template
 * selection, preview and sharing. This component owns all the state that only
 * the form uses (music player, Google Maps embed warning, gallery/QR uploads)
 * and receives the shared `config` plus update handlers as props.
 */
export default function InfoForm({
	activeTab,
	setActiveTab,
	selectedTemplate,
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
	handleWeddingDateChange
}: InfoFormProps) {
	const router = useRouter();
	const { isLoggedIn } = useAuth();

	const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);
	const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);

	const [uploadingQrFor, setUploadingQrFor] = useState<'groom' | 'bride' | null>(null);
	const [qrUploadError, setQrUploadError] = useState<string | null>(null);

	const [uploadingPhotoField, setUploadingPhotoField] = useState<keyof InvitationPhotos | null>(null);
	const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

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
			setQrUploadError('Vui lòng đăng nhập để tải ảnh QR lên.');
			router.push('/login');
			return;
		}

		setQrUploadError(null);
		setUploadingQrFor(who);
		try {
			const response = await apiUploadPhotos([file], 'invitation', '', ['invitation', 'qr']);
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

	const removeQrImage = (who: 'groom' | 'bride') => {
		updateGift(who, 'qrImage', '');
	};

	const handleGalleryFileUpload = async (index: number, file: File | null) => {
		if (!file) return;

		if (!isLoggedIn) {
			setGalleryUploadError('Vui lòng đăng nhập để tải ảnh lên.');
			router.push('/login');
			return;
		}

		setGalleryUploadError(null);
		setUploadingGalleryIndex(index);
		try {
			const response = await apiUploadPhotos([file], 'invitation', '', ['invitation']);
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
			setPhotoUploadError('Vui lòng đăng nhập để tải ảnh lên.');
			router.push('/login');
			return;
		}

		setPhotoUploadError(null);
		setUploadingPhotoField(field);
		try {
			const response = await apiUploadPhotos([file], 'invitation', '', ['invitation']);
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

	return (
		<section className={`mx-auto max-w-7xl ${activeTab === 'info' ? '' : 'hidden'}`}>
			<div className="rounded-2xl border border-pink-100 bg-pink-50/70 mt-6 p-4 text-sm text-pink-600">
				<div className="flex items-center justify-between gap-3">
					<p className="inline-flex items-center gap-1 font-semibold">
						Đang dùng mẫu: {selectedTemplate.name}
					</p>
					<button
						type="button"
						onClick={() => setActiveTab('template')}
						className="shrink-0 rounded-lg border border-pink-300 bg-white px-3 py-1.5 text-xs font-medium text-pink-700 transition hover:bg-pink-50"
					>
						Đổi mẫu
					</button>
				</div>
				<p className="mt-1">Điền đầy đủ thông tin bên dưới, sau đó bấm &ldquo;Xem thiệp &rdquo;.</p>
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
						<Field label="Chữ lồng viết tắt (2-3 ký tự, hiện ở bìa)" full>
							<input
								maxLength={3}
								value={config.monogram}
								onChange={(e) => updateField('monogram', e.target.value.toUpperCase())}
								className="input"
							/>
						</Field>
					</div>

					{/* Chuyện tình (chỉ với mẫu hỗ trợ, VD: Thiệp cưới song long) */}
					{config.story ? (
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
					) : null}

					{/* Ảnh trên thiệp (chỉ với mẫu hỗ trợ, VD: Thiệp cưới song long) */}
					{config.photos ? (
						<div className="mt-6 border-t border-slate-100 pt-6">
							<h3 className="text-sm font-semibold text-slate-900">Ảnh Trên Thiệp</h3>
							<p className="mt-1 text-xs text-slate-500">Tải ảnh lên để hiển thị trong thiệp</p>
							<div className="mt-4 grid gap-3 sm:grid-cols-3">
								<PhotoUploadField
									label="Ảnh bìa"
									value={config.photos.coverPhoto}
									uploading={uploadingPhotoField === 'coverPhoto'}
									onUpload={(file) => handlePhotoFileUpload('coverPhoto', file)}
									onRemove={() => updatePhoto('coverPhoto', '')}
								/>
								<PhotoUploadField
									label="Ảnh chú rể"
									value={config.photos.groomPhoto}
									uploading={uploadingPhotoField === 'groomPhoto'}
									onUpload={(file) => handlePhotoFileUpload('groomPhoto', file)}
									onRemove={() => updatePhoto('groomPhoto', '')}
								/>
								<PhotoUploadField
									label="Ảnh cô dâu"
									value={config.photos.bridePhoto}
									uploading={uploadingPhotoField === 'bridePhoto'}
									onUpload={(file) => handlePhotoFileUpload('bridePhoto', file)}
									onRemove={() => updatePhoto('bridePhoto', '')}
								/>
							</div>
							{photoUploadError ? <p className="mt-3 text-xs text-pink-600">{photoUploadError}</p> : null}
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
						{config.ceremony.lunar ? (
							<Field label="Ngày âm lịch (ghi chú, tuỳ chọn)" full>
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
						{config.reception.welcomeTime ? (
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
						{config.reception.startTime ? (
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
						<Field label="Tên &amp; địa chỉ nhà hàng / trung tâm tiệc cưới" full>
							<input
								required
								value={config.reception.venueName}
								onChange={(e) => updateReception('venueName', e.target.value)}
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
				{config.schedule ? (
					<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
						<h2 className="text-base font-semibold text-slate-900">Lịch Trình Ngày Cưới</h2>
						<p className="mt-1 text-xs text-slate-500">Thêm từng mốc thời gian trong ngày</p>
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
					<p className="mt-1 text-xs text-slate-500">Tải ảnh cưới của bạn lên để hiển thị trong thiệp</p>
					<div className="mt-4 grid gap-3 sm:grid-cols-3">
						{config.gallery.map((url, index) => (
							<div key={index} className="relative">
								{url ? (
									<div className="group relative aspect-3/4 w-full overflow-hidden rounded-xl border border-slate-200">
										<Image
											src={url}
											alt={`Ảnh cưới ${index + 1}`}
											fill
											sizes="(max-width: 640px) 100vw, 33vw"
											className="object-cover"
										/>
										<div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
											<label className="cursor-pointer rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white">
												<Upload className="h-4 w-4" />
												<input
													type="file"
													accept="image/*"
													className="hidden"
													disabled={uploadingGalleryIndex === index}
													onChange={(e) => handleGalleryFileUpload(index, e.target.files?.[0] ?? null)}
												/>
											</label>
											<button
												type="button"
												onClick={() => removeGalleryRow(index)}
												className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-pink-600"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
										{uploadingGalleryIndex === index ? (
											<div className="absolute inset-0 flex items-center justify-center bg-black/40">
												<Loader2 className="h-6 w-6 animate-spin text-white" />
											</div>
										) : null}
									</div>
								) : (
									<label className="flex aspect-3/4 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-slate-400 transition hover:border-pink-300 hover:text-pink-500">
										{uploadingGalleryIndex === index ? (
											<Loader2 className="h-6 w-6 animate-spin" />
										) : (
											<>
												<Upload className="h-6 w-6" />
												<span className="text-xs font-medium">Tải ảnh lên</span>
											</>
										)}
										<input
											type="file"
											accept="image/*"
											className="hidden"
											disabled={uploadingGalleryIndex === index}
											onChange={(e) => handleGalleryFileUpload(index, e.target.files?.[0] ?? null)}
										/>
									</label>
								)}
								{url ? (
									<button
										type="button"
										onClick={() => removeGalleryRow(index)}
										className="mt-1.5 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-pink-300 hover:text-pink-600 sm:hidden"
									>
										<Trash2 className="h-3.5 w-3.5" />
										Xoá
									</button>
								) : null}
							</div>
						))}
					</div>
					{galleryUploadError ? <p className="mt-3 text-xs text-pink-600">{galleryUploadError}</p> : null}
					<button
						type="button"
						onClick={addGalleryRow}
						className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-pink-300 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-50"
					>
						<Plus className="h-3.5 w-3.5" />
						Thêm ảnh
					</button>
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
					{config.gifts ? (
					<p className="mt-1 text-xs text-slate-500">Tải lên ảnh chụp mã QR chuyển khoản của ngân hàng (tuỳ chọn)</p>
					) : null}
					<div className="mt-4 grid gap-6 sm:grid-cols-2">
						<div>
							{config.gifts ? (
							<>
							<p className="mb-2 text-xs font-medium text-slate-600">QR chú rể</p>
							{config.gifts.groom.qrImage ? (
								<div className="group relative h-32 w-32 overflow-hidden rounded-lg border border-slate-200">
									<Image
										src={config.gifts.groom.qrImage}
										alt="QR chú rể"
										fill
										sizes="128px"
										className="object-cover"
									/>
									<div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
										<label className="cursor-pointer rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white">
											<Upload className="h-4 w-4" />
											<input
												type="file"
												accept="image/*"
												className="hidden"
												disabled={uploadingQrFor === 'groom'}
												onChange={(e) => handleQrImageUpload('groom', e.target.files?.[0] ?? null)}
											/>
										</label>
										<button
											type="button"
											onClick={() => removeQrImage('groom')}
											className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-pink-600"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
									{uploadingQrFor === 'groom' ? (
										<div className="absolute inset-0 flex items-center justify-center bg-black/40">
											<Loader2 className="h-5 w-5 animate-spin text-white" />
										</div>
									) : null}
								</div>
							) : (
								<label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 text-slate-400 transition hover:border-pink-300 hover:text-pink-500">
									{uploadingQrFor === 'groom' ? (
										<Loader2 className="h-5 w-5 animate-spin" />
									) : (
										<>
											<Upload className="h-5 w-5" />
											<span className="text-[11px] font-medium">Tải ảnh QR</span>
										</>
									)}
									<input
										type="file"
										accept="image/*"
										className="hidden"
										disabled={uploadingQrFor === 'groom'}
										onChange={(e) => handleQrImageUpload('groom', e.target.files?.[0] ?? null)}
									/>
								</label>
							)}
							</>
							) : null}
							<div className="mt-3 grid gap-2">
								<Field label="Ngân hàng (chú rể)">
									<input value={config.gifts.groom.bank} onChange={(e) => updateGift('groom', 'bank', e.target.value)} className="input" />
								</Field>
								<Field label="Tên chủ tài khoản (chú rể)">
									<input value={config.gifts.groom.name} onChange={(e) => updateGift('groom', 'name', e.target.value)} className="input" />
								</Field>
							</div>
						</div>
						<div>
							{config.gifts ? (
							<>
							<p className="mb-2 text-xs font-medium text-slate-600">QR cô dâu</p>
							{config.gifts.bride.qrImage ? (
								<div className="group relative h-32 w-32 overflow-hidden rounded-lg border border-slate-200">
									<Image
										src={config.gifts.bride.qrImage}
										alt="QR cô dâu"
										fill
										sizes="128px"
										className="object-cover"
									/>
									<div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
										<label className="cursor-pointer rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white">
											<Upload className="h-4 w-4" />
											<input
												type="file"
												accept="image/*"
												className="hidden"
												disabled={uploadingQrFor === 'bride'}
												onChange={(e) => handleQrImageUpload('bride', e.target.files?.[0] ?? null)}
											/>
										</label>
										<button
											type="button"
											onClick={() => removeQrImage('bride')}
											className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-pink-600"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
									{uploadingQrFor === 'bride' ? (
										<div className="absolute inset-0 flex items-center justify-center bg-black/40">
											<Loader2 className="h-5 w-5 animate-spin text-white" />
										</div>
									) : null}
								</div>
							) : (
								<label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 text-slate-400 transition hover:border-pink-300 hover:text-pink-500">
									{uploadingQrFor === 'bride' ? (
										<Loader2 className="h-5 w-5 animate-spin" />
									) : (
										<>
											<Upload className="h-5 w-5" />
											<span className="text-[11px] font-medium">Tải ảnh QR</span>
										</>
									)}
									<input
										type="file"
										accept="image/*"
										className="hidden"
										disabled={uploadingQrFor === 'bride'}
										onChange={(e) => handleQrImageUpload('bride', e.target.files?.[0] ?? null)}
									/>
								</label>
							)}
							</>
							) : null}
							<div className="mt-3 grid gap-2">
								<Field label="Ngân hàng (cô dâu)">
									<input value={config.gifts.bride.bank} onChange={(e) => updateGift('bride', 'bank', e.target.value)} className="input" />
								</Field>
								<Field label="Tên chủ tài khoản (cô dâu)">
									<input value={config.gifts.bride.name} onChange={(e) => updateGift('bride', 'name', e.target.value)} className="input" />
								</Field>
							</div>
						</div>
					</div>
					{qrUploadError ? <p className="mt-3 text-xs text-pink-600">{qrUploadError}</p> : null}
				</section>
			</form>
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

function PhotoUploadField({
	label,
	value,
	uploading,
	onUpload,
	onRemove
}: {
	label: string;
	value: string;
	uploading: boolean;
	onUpload: (file: File | null) => void;
	onRemove: () => void;
}) {
	return (
		<div>
			<p className="mb-2 text-xs font-medium text-slate-600">{label}</p>
			{value ? (
				<div className="group relative aspect-3/4 w-full overflow-hidden rounded-xl border border-slate-200">
					<Image src={value} alt={label} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
					<div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
						<label className="cursor-pointer rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white">
							<Upload className="h-4 w-4" />
							<input
								type="file"
								accept="image/*"
								className="hidden"
								disabled={uploading}
								onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
							/>
						</label>
						<button
							type="button"
							onClick={onRemove}
							className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-pink-600"
						>
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
					{uploading ? (
						<div className="absolute inset-0 flex items-center justify-center bg-black/40">
							<Loader2 className="h-6 w-6 animate-spin text-white" />
						</div>
					) : null}
				</div>
			) : (
				<label className="flex aspect-3/4 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-slate-400 transition hover:border-pink-300 hover:text-pink-500">
					{uploading ? (
						<Loader2 className="h-6 w-6 animate-spin" />
					) : (
						<>
							<Upload className="h-6 w-6" />
							<span className="text-xs font-medium">Tải ảnh lên</span>
						</>
					)}
					<input
						type="file"
						accept="image/*"
						className="hidden"
						disabled={uploading}
						onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
					/>
				</label>
			)}
		</div>
	);
}
