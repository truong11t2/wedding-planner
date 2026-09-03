'use client';

import { invitationTemplates } from '@/data/invitationTemplates';

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
							<button
								type="button"
								onClick={() => handleSelectTemplate(template.id)}
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
									onClick={() => handleSelectTemplate(template.id)}
									className={`mt-2 w-full rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
										isSelected
											? 'border-pink-300 bg-pink-50 text-pink-700'
											: 'border-slate-200 text-slate-600 hover:border-pink-200 hover:text-pink-600'
									}`}
								>
									{isSelected ? 'Đang chọn mẫu này' : 'Chọn mẫu này'}
								</button>
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
		</section>
	);
}
