'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { invitationTemplates } from '@/data/invitationTemplates';
import { BACKEND_ORIGIN } from '@/api/config';

type InvitationTab = 'template' | 'info' | 'invitation' | 'share';

interface TemplateSelectProps {
	activeTab: InvitationTab;
	setActiveTab: (tab: InvitationTab) => void;
	selectedTemplateId: string;
	handleSelectTemplate: (templateId: string) => void | Promise<void>;
}

/**
 * Tab 1 — "Chọn mẫu": the template gallery.
 *
 * Renders the grid of invitation templates, the empty state and the
 * "continue" button. Template switching itself (loading the template's
 * default config, resetting previews) is orchestrated by the parent via
 * `handleSelectTemplate`.
 */
export default function TemplateSelect({
	activeTab,
	setActiveTab,
	selectedTemplateId,
	handleSelectTemplate
}: TemplateSelectProps) {
	const [descriptionTemplateId, setDescriptionTemplateId] = useState<string | null>(null);
	const descriptionTemplate = invitationTemplates.find((template) => template.id === descriptionTemplateId);

	useEffect(() => {
		if (!descriptionTemplate) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setDescriptionTemplateId(null);
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [descriptionTemplate]);

	return (
		<section className={`mx-auto max-w-7xl ${activeTab === 'template' ? '' : 'hidden'}`}>
			<div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{invitationTemplates.map((template) => {
					const isSelected = template.id === selectedTemplateId;

					return (
						<div
							key={template.id}
							className={`group rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
								isSelected ? 'border-pink-400 ring-2 ring-pink-200' : 'border-slate-200'
							}`}
						>
							<div className="template-preview relative h-120 overflow-hidden rounded-xl border border-white/60 bg-white">
								<div className="template-preview__content">
									<iframe
										src={`${BACKEND_ORIGIN}/templates/invitation/${template.id}.html`}
										title={`${template.name} invitation template`}
										loading="lazy"
										className="block h-160 w-full border-0"
									/>
								</div>
							</div>

							<div className="px-1 pb-1 pt-3">
								<div className="flex items-center justify-between gap-3">
									<h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{template.name}</h3>
									<span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
										{template.tone}
									</span>
								</div>
								<p className="mt-1 text-xs text-slate-500">{template.category}</p>
								<div className="mt-2 grid grid-cols-2 gap-2">
								<button
									type="button"
									onClick={() => handleSelectTemplate(template.id)}
									className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
										isSelected
											? 'border-pink-300 bg-pink-50 text-pink-700'
											: 'border-slate-200 text-slate-600 hover:border-pink-200 hover:text-pink-600'
									}`}
								>
									{isSelected ? 'Đang chọn mẫu này' : 'Chọn mẫu này'}
								</button>
								<button
									type="button"
									onClick={() => setDescriptionTemplateId(template.id)}
									className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 transition hover:border-pink-200 hover:text-pink-600"
								>
									Mô tả
								</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{invitationTemplates.length === 0 ? (
				<div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
					Không tìm thấy mẫu phù hợp. Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm.
				</div>
			) : null}

			<div className="mt-8 flex justify-end">
				<button
					type="button"
					onClick={() => setActiveTab('info')}
					className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
				>
					Tiếp tục: Nhập thông tin đám cưới
				</button>
			</div>

			{descriptionTemplate ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
					role="presentation"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget) setDescriptionTemplateId(null);
					}}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="template-description-title"
						className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">Mô tả mẫu thiệp</p>
								<h2 id="template-description-title" className="mt-2 text-xl font-semibold text-slate-900">
									{descriptionTemplate.name}
								</h2>
							</div>
							<button
								type="button"
								onClick={() => setDescriptionTemplateId(null)}
								aria-label="Đóng mô tả"
								className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<p className="mt-4 text-sm leading-6 text-slate-600">{descriptionTemplate.description}</p>
						<div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
							<span className="rounded-full bg-slate-100 px-3 py-1">Phong cách: {descriptionTemplate.category}</span>
							<span className="rounded-full bg-slate-100 px-3 py-1">Tông màu: {descriptionTemplate.tone}</span>
						</div>
						<button
							type="button"
							onClick={() => {
								handleSelectTemplate(descriptionTemplate.id);
								setDescriptionTemplateId(null);
							}}
							className="mt-6 w-full rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
						>
							Chọn mẫu này
						</button>
					</div>
				</div>
			) : null}
		</section>
	);
}
