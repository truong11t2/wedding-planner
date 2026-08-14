'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
	Copy,
	Eye,
	Link as LinkIcon,
	Loader2,
	Plus,
	Trash2,
	Upload
} from 'lucide-react';
import {
	invitationTemplates,
	defaultInvitationTemplate,
	type TemplateCategory,
	type TemplateTone
} from '@/data/invitationTemplates';
import { useAuth } from '@/context/AuthContext';
import {
	generateInvitation,
	getMyInvitation,
	renderInvitationPreview,
	type InvitationConfig,
	type InvitationScheduleItem
} from '@/api/invitation';
import { uploadPhotos as apiUploadPhotos } from '@/api/photo';
import { BACKEND_ORIGIN } from '@/api/config';



const defaultTemplate = defaultInvitationTemplate;

function buildDefaultConfig(): InvitationConfig {
	return {
		groomShort: 'Gia Bảo',
		brideShort: 'Minh Anh',
		groomFull: 'Nguyễn Gia Bảo',
		brideFull: 'Trần Minh Anh',
		groomRole: 'Trưởng Nam',
		brideRole: 'Út Nữ',
		monogram: 'GB',
		weddingDateISO: '2026-12-20T18:00:00',
		groomParents: {
			father: 'Ông Nguyễn Văn Long',
			mother: 'Bà Lê Thị Hồng',
			address: '12 Trần Phú, Hải Châu, Đà Nẵng'
		},
		brideParents: {
			father: 'Ông Trần Văn Nam',
			mother: 'Bà Phạm Thị Lan',
			address: '45 Lê Duẩn, Quận 1, TP.HCM'
		},
		ceremony: {
			time: '09:00',
			dateLabel: '20 · 12',
			lunar: '(Nhằm ngày 11 tháng 11 năm Bính Ngọ)'
		},
		reception: {
			welcomeTime: '17:30',
			startTime: '18:00',
			venueName: 'The Adora Center, 431 Hoàng Văn Thụ, Tân Bình, TP.HCM',
			mapQuery: 'The Adora Center 431 Hoang Van Thu Tan Binh'
		},
		schedule: [
			{ time: '17:30', label: 'Đón khách' },
			{ time: '18:00', label: 'Khai tiệc' },
			{ time: '18:20', label: 'Nghi thức rót rượu, cắt bánh' },
			{ time: '19:00', label: 'Phục vụ tiệc chính' },
			{ time: '21:00', label: 'Kết thúc tiệc' }
		],
		gallery: [
		],
		gifts: {
			groom: { bank: 'Vietcombank', account: '0123 4567 89', name: 'NGUYEN GIA BAO', qrImage: '' },
			bride: { bank: 'BIDV', account: '9876 5432 10', name: 'TRAN MINH ANH', qrImage: '' }
		},
		musicUrl: ''
	};
}

function formatDateLabel(dateStr: string): string {
	if (!dateStr) return '';
	const [, month, day] = dateStr.split('-');
	return `${day} · ${month}`;
}

export default function InvitationPage() {
	const router = useRouter();
	const { isLoggedIn } = useAuth();
	const [activeTab, setActiveTab] = useState<'template' | 'info'>('template');
	const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'Tất cả'>('Tất cả');
	const [selectedTone, setSelectedTone] = useState<TemplateTone | 'Tất cả'>('Tất cả');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplate.id);

	const [config, setConfig] = useState<InvitationConfig>(buildDefaultConfig());
	const [weddingDate, setWeddingDate] = useState('2026-12-20');

	const [isRendering, setIsRendering] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewFileName, setPreviewFileName] = useState<string | null>(null);
	const [renderError, setRenderError] = useState<string | null>(null);

	const [isSaving, setIsSaving] = useState(false);
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);
	const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);

	const [uploadingQrFor, setUploadingQrFor] = useState<'groom' | 'bride' | null>(null);
	const [qrUploadError, setQrUploadError] = useState<string | null>(null);

	const [isLoadingExisting, setIsLoadingExisting] = useState(true);

	// Load the user's previously saved invitation (if any) from the database
	// so the form is pre-filled instead of always starting from the defaults.
	useEffect(() => {
		let cancelled = false;

		const loadExistingInvitation = async () => {
			if (!isLoggedIn) {
				setIsLoadingExisting(false);
				return;
			}

			try {
				const response = await getMyInvitation();
				if (!cancelled && response.success && response.invitation) {
					const { invitation } = response;
					if (invitation.config) {
						setConfig(invitation.config);
						if (invitation.config.weddingDateISO) {
							setWeddingDate(invitation.config.weddingDateISO.split('T')[0]);
						}
					}
					if (invitation.templateId) {
						setSelectedTemplateId(invitation.templateId);
					}
				}
			} catch {
				// No existing invitation yet (or fetch failed) — silently keep defaults.
			} finally {
				if (!cancelled) {
					setIsLoadingExisting(false);
				}
			}
		};

		loadExistingInvitation();

		return () => {
			cancelled = true;
		};
	}, [isLoggedIn]);

	const filteredTemplates = useMemo(() => {
		return invitationTemplates.filter((template) => {
			const byCategory = selectedCategory === 'Tất cả' || template.category === selectedCategory;
			const byTone = selectedTone === 'Tất cả' || template.tone === selectedTone;
			const bySearch =
				searchTerm.trim().length === 0 ||
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.category.toLowerCase().includes(searchTerm.toLowerCase());

			return byCategory && byTone && bySearch;
		});
	}, [searchTerm, selectedCategory, selectedTone]);

	const selectedTemplate =
		invitationTemplates.find((template) => template.id === selectedTemplateId) ?? defaultTemplate;

	const canPreview = useMemo(() => {
		return Boolean(
			config.groomFull.trim() &&
				config.brideFull.trim() &&
				config.groomShort.trim() &&
				config.brideShort.trim() &&
				weddingDate &&
				config.reception.startTime &&
				config.reception.venueName.trim()
		);
	}, [config, weddingDate]);

	const updateField = <K extends keyof InvitationConfig>(key: K, value: InvitationConfig[K]) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
	};

	const updateGroomParent = (field: keyof InvitationConfig['groomParents'], value: string) => {
		setConfig((prev) => ({ ...prev, groomParents: { ...prev.groomParents, [field]: value } }));
	};

	const updateBrideParent = (field: keyof InvitationConfig['brideParents'], value: string) => {
		setConfig((prev) => ({ ...prev, brideParents: { ...prev.brideParents, [field]: value } }));
	};

	const updateCeremony = (field: keyof InvitationConfig['ceremony'], value: string) => {
		setConfig((prev) => ({ ...prev, ceremony: { ...prev.ceremony, [field]: value } }));
	};

	const updateReception = (field: keyof InvitationConfig['reception'], value: string) => {
		setConfig((prev) => ({ ...prev, reception: { ...prev.reception, [field]: value } }));
	};

	const updateGift = (who: 'groom' | 'bride', field: keyof InvitationConfig['gifts']['groom'], value: string) => {
		setConfig((prev) => ({
			...prev,
			gifts: { ...prev.gifts, [who]: { ...prev.gifts[who], [field]: value } }
		}));
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

	const updateScheduleItem = (index: number, field: keyof InvitationScheduleItem, value: string) => {
		setConfig((prev) => {
			const schedule = [...prev.schedule];
			schedule[index] = { ...schedule[index], [field]: value };
			return { ...prev, schedule };
		});
	};

	const addScheduleRow = () => {
		setConfig((prev) => ({ ...prev, schedule: [...prev.schedule, { time: '', label: '' }] }));
	};

	const removeScheduleRow = (index: number) => {
		setConfig((prev) => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== index) }));
	};

	const updateGalleryItem = (index: number, value: string) => {
		setConfig((prev) => {
			const gallery = [...prev.gallery];
			gallery[index] = value;
			return { ...prev, gallery };
		});
	};

	const addGalleryRow = () => {
		setConfig((prev) => ({ ...prev, gallery: [...prev.gallery, ''] }));
	};

	const removeGalleryRow = (index: number) => {
		setConfig((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
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

	const handleWeddingDateChange = (value: string) => {
		setWeddingDate(value);
		updateField('ceremony', { ...config.ceremony, dateLabel: formatDateLabel(value) } as InvitationConfig['ceremony']);
	};

	const buildFinalConfig = (): InvitationConfig => {
		const startTime = config.reception.startTime || '18:00';
		return {
			...config,
			weddingDateISO: weddingDate ? `${weddingDate}T${startTime}:00` : config.weddingDateISO,
			schedule: config.schedule.filter((item) => item.time.trim() || item.label.trim()),
			gallery: config.gallery.map((url) => url.trim()).filter(Boolean)
		};
	};

	const handlePreview = async () => {
		setRenderError(null);
		setIsRendering(true);

		if (!isLoggedIn) {
			setRenderError('Vui lòng đăng nhập để xem thiệp demo.');
			setIsRendering(false);
			router.push('/login');
			return;
		}

		// Open the tab synchronously (within the click handler) so popup blockers
		// don't block it — we'll navigate it to the real URL once ready.
		// IMPORTANT: do NOT pass "noopener" here, otherwise the returned window
		// reference is null/inaccessible and we can't set its location later.
		const newTab = window.open('about:blank', '_blank');

		try {
			const finalConfig = buildFinalConfig();
			const response = await renderInvitationPreview(selectedTemplate.id, finalConfig);
			// Cache-bust so the browser always fetches the latest overwritten file
			const fullUrl = `${BACKEND_ORIGIN}${response.publicUrl}?t=${Date.now()}`;
			setPreviewUrl(fullUrl);
			setPreviewFileName(response.htmlFileName);

			if (newTab && !newTab.closed) {
				newTab.location.href = fullUrl;
			} else {
				window.open(fullUrl, '_blank');
			}
		} catch (error) {
			newTab?.close();
			setRenderError(error instanceof Error ? error.message : 'Không thể tạo thiệp demo. Vui lòng thử lại.');
		} finally {
			setIsRendering(false);
		}
	};

	const handleGenerateLink = async () => {
		setSaveError(null);
		setCopied(false);

		if (!isLoggedIn) {
			setSaveError('Vui lòng đăng nhập để tạo link thiệp mời gửi cho khách.');
			router.push('/login');
			return;
		}

		setIsSaving(true);
		try {
			const finalConfig = buildFinalConfig();
			const response = await generateInvitation(selectedTemplate.id, finalConfig, {
				groomName: finalConfig.groomFull,
				brideName: finalConfig.brideFull,
				eventDate: weddingDate
			});
			const fullUrl = `${BACKEND_ORIGIN}${response.invitation.publicUrl}`;
			setShareUrl(fullUrl);
		} catch (error) {
			setSaveError(error instanceof Error ? error.message : 'Không thể tạo link chia sẻ. Vui lòng thử lại.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleCopyLink = async () => {
		if (!shareUrl) return;
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setSaveError('Không thể sao chép link. Vui lòng sao chép thủ công.');
		}
	};

	if (isLoadingExisting) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center">
					<Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-500" />
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
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="flex gap-2 border-b border-slate-200">
				<button
					type="button"
					onClick={() => setActiveTab('template')}
					className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
						activeTab === 'template'
							? 'border-rose-500 text-rose-600'
							: 'border-transparent text-slate-500 hover:text-slate-700'
					}`}
				>
					1. Chọn mẫu thiệp
				</button>
				<button
					type="button"
					onClick={() => setActiveTab('info')}
					className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
						activeTab === 'info'
							? 'border-rose-500 text-rose-600'
							: 'border-transparent text-slate-500 hover:text-slate-700'
					}`}
				>
					2. Thông tin đám cưới
				</button>
			</div>
		</div>

		<section className={`mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 ${activeTab === 'template' ? '' : 'hidden'}`}>
			{/* <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-100">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<input
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Tìm mẫu theo tên hoặc phong cách..."
						className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
					/>
				</div>

				<div className="mt-4 grid gap-3 md:grid-cols-2">
					<div>
						<label className="mb-1.5 inline-flex items-center gap-1 text-sm font-medium text-slate-700">
							<Palette className="h-4 w-4" />
							Phong cách
						</label>
						<select
							value={selectedCategory}
							onChange={(event) => setSelectedCategory(event.target.value as TemplateCategory | 'Tất cả')}
							className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="mb-1.5 inline-flex items-center gap-1 text-sm font-medium text-slate-700">
							<Palette className="h-4 w-4" />
							Tông màu
						</label>
						<select
							value={selectedTone}
							onChange={(event) => setSelectedTone(event.target.value as TemplateTone | 'Tất cả')}
							className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
						>
							{tones.map((tone) => (
								<option key={tone} value={tone}>
									{tone}
								</option>
							))}
						</select>
					</div>
				</div>
			</div> */}

			<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{filteredTemplates.map((template) => {
					const isSelected = template.id === selectedTemplateId;

					return (
						<div
							key={template.id}
							className={`group rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
								isSelected ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200'
							}`}
						>
							<button
								type="button"
								onClick={() => setSelectedTemplateId(template.id)}
								className="block w-full text-left"
							>
								<div
									className="relative h-40 rounded-xl border border-white/60 p-4"
									style={{ background: template.background }}
								>
									{template.badge ? (
										<span className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-slate-700">
											{template.badge}
										</span>
									) : null}
									<div className="mt-2 text-center" style={{ color: template.accent }}>
										<p className="text-xs tracking-[0.28em]">WEDDING INVITATION</p>
										<p className="mt-5 text-xl font-semibold">A &amp; B</p>
										<p className="mt-2 text-xs">SAVE THE DATE</p>
									</div>
								</div>
							</button>

							<div className="px-1 pb-1 pt-3">
								<div className="flex items-center justify-between gap-3">
									<h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{template.name}</h3>
									<span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
										{template.tone}
									</span>
								</div>
								<p className="mt-1 text-xs text-slate-500">{template.category}</p>
								<button
									type="button"
									onClick={() => setSelectedTemplateId(template.id)}
									className={`mt-2 w-full rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
										isSelected
											? 'border-rose-300 bg-rose-50 text-rose-700'
											: 'border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600'
									}`}
								>
									{isSelected ? 'Đang chọn mẫu này' : 'Chọn mẫu này'}
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{filteredTemplates.length === 0 ? (
				<div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
					Không tìm thấy mẫu phù hợp. Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm.
				</div>
			) : null}

			<div className="mt-8 flex justify-end">
				<button
					type="button"
					onClick={() => setActiveTab('info')}
					className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
				>
					Tiếp tục: Nhập thông tin đám cưới
				</button>
			</div>
		</section>

		<section className={`mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8 ${activeTab === 'info' ? '' : 'hidden'}`}>
			<div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-rose-800">
				<div className="flex items-center justify-between gap-3">
					<p className="inline-flex items-center gap-1 font-semibold">
						Đang dùng mẫu: {selectedTemplate.name}
					</p>
					<button
						type="button"
						onClick={() => setActiveTab('template')}
						className="shrink-0 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
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
						<Field label="Ngày âm lịch (ghi chú, tuỳ chọn)" full>
							<input
								placeholder="VD: Nhằm ngày 11 tháng 11 năm Bính Ngọ"
								value={config.ceremony.lunar}
								onChange={(e) => updateCeremony('lunar', e.target.value)}
								className="input"
							/>
						</Field>
					</div>
				</section>

				{/* Tiệc cưới */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Tiệc Cưới</h2>
					<div className="mt-4 grid gap-3 sm:grid-cols-3">
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
						<div />
						<Field label="Tên &amp; địa chỉ nhà hàng / trung tâm tiệc cưới" full>
							<input
								required
								value={config.reception.venueName}
								onChange={(e) => updateReception('venueName', e.target.value)}
								className="input"
							/>
						</Field>
						<Field label="Từ khoá tìm trên Google Maps (tuỳ chọn)" full>
							<input
								placeholder="VD: The Adora Center 431 Hoàng Văn Thụ"
								value={config.reception.mapQuery}
								onChange={(e) => updateReception('mapQuery', e.target.value)}
								className="input"
							/>
						</Field>
					</div>
				</section>

				{/* Lịch trình */}
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
									className="input w-24"
								/>
								<input
									placeholder="Nội dung (VD: Đón khách)"
									value={item.label}
									onChange={(e) => updateScheduleItem(index, 'label', e.target.value)}
									className="input flex-1"
								/>
								<button
									type="button"
									onClick={() => removeScheduleRow(index)}
									className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-300 hover:text-red-600"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={addScheduleRow}
						className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
					>
						<Plus className="h-3.5 w-3.5" />
						Thêm mốc thời gian
					</button>
				</section>

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
												className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-red-600"
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
									<label className="flex aspect-3/4 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-slate-400 transition hover:border-rose-300 hover:text-rose-500">
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
										className="mt-1.5 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-red-300 hover:text-red-600 sm:hidden"
									>
										<Trash2 className="h-3.5 w-3.5" />
										Xoá
									</button>
								) : null}
							</div>
						))}
					</div>
					{galleryUploadError ? <p className="mt-3 text-xs text-red-600">{galleryUploadError}</p> : null}
					<button
						type="button"
						onClick={addGalleryRow}
						className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
					>
						<Plus className="h-3.5 w-3.5" />
						Thêm ảnh
					</button>
				</section>

				{/* Nhạc nền */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Nhạc Nền</h2>
					<p className="mt-1 text-xs text-slate-500">
						Dán link file nhạc (mp3), tuỳ chọn — nhạc sẽ tự phát khi khách bấm &ldquo;Mở Thiệp&rdquo;
					</p>
					<div className="mt-4">
						<input
							type="url"
							placeholder="https://... (file .mp3)"
							value={config.musicUrl}
							onChange={(e) => updateField('musicUrl', e.target.value)}
							className="input"
						/>
					</div>
				</section>

				{/* Mừng cưới online */}
				<section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
					<h2 className="text-base font-semibold text-slate-900">Mừng Cưới Online</h2>
					<p className="mt-1 text-xs text-slate-500">Tải lên ảnh chụp mã QR chuyển khoản của ngân hàng (tuỳ chọn)</p>
					<div className="mt-4 grid gap-6 sm:grid-cols-2">
						<div>
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
											className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-red-600"
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
								<label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 text-slate-400 transition hover:border-rose-300 hover:text-rose-500">
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
											className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-red-600"
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
								<label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 text-slate-400 transition hover:border-rose-300 hover:text-rose-500">
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
					{qrUploadError ? <p className="mt-3 text-xs text-red-600">{qrUploadError}</p> : null}
				</section>

				{/* Actions */}
				<section className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
					<button
						type="button"
						onClick={handlePreview}
						disabled={!canPreview || isRendering}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isRendering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
						Xem thiệp
					</button>
					{!canPreview ? (
						<p className="mt-2 text-center text-xs text-slate-500">
							Vui lòng điền đủ tên cô dâu/chú rể, ngày cưới, giờ khai tiệc và tên nhà hàng để xem demo.
						</p>
					) : null}
					{renderError ? <p className="mt-2 text-center text-sm text-red-600">{renderError}</p> : null}

					{/* {previewUrl ? (
						<div className="mt-4 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-600">
							Thiệp demo đã mở ở tab mới.{' '}
							<a href={previewUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-rose-600 underline">
								Mở lại nếu bị đóng
							</a>
						</div>
					) : null} */}

					<div className="mt-6 border-t border-slate-100 pt-6">
						<button
							type="button"
							onClick={handleGenerateLink}
							disabled={!previewFileName || isSaving}
							className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
							Tạo link gửi cho khách
						</button>
						{!previewFileName ? (
							<p className="mt-2 text-center text-xs text-slate-500">
								Xem thiệp demo trước khi tạo link gửi cho khách.
							</p>
						) : null}
						{saveError ? <p className="mt-2 text-center text-sm text-red-600">{saveError}</p> : null}

						{shareUrl ? (
							<div className="mt-4 flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center">
								<input
									readOnly
									value={shareUrl}
									onFocus={(e) => e.target.select()}
									className="flex-1 truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
								/>
								<button
									type="button"
									onClick={handleCopyLink}
									className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
								>
									<Copy className="h-4 w-4" />
									{copied ? 'Đã sao chép!' : 'Sao chép'}
								</button>
							</div>
						) : null}
					</div>
				</section>
			</form>
		</section>

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

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
	return (
		<div className={full ? 'sm:col-span-2' : ''}>
			<label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
			{children}
		</div>
	);
}

