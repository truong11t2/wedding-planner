'use client';

import { Copy, Trash2 } from 'lucide-react';

type InvitationTab = 'template' | 'info' | 'invitation' | 'share';

interface ShareProps {
	activeTab: InvitationTab;
	isPaid: boolean | undefined;
	previewFileName: string | null;
	saveError: string | null;
	shareUrl: string | null;
	copied: boolean;
	copiedLinkId: string | null;
	guestName: string;
	generatedLinks: Array<{ id: string; guestName: string; url: string }>;
	setGuestName: (value: string) => void;
	handleGenerateLink: () => void;
	handleCopyLink: (url?: string) => void;
	handleDeleteLink: (linkId: string) => void;
}

/**
 * Tab 4 — "Chia sẻ": the share-link panel.
 *
 * Shows the generated share link with a copy button. Link generation is
 * orchestrated by the parent (`handleGenerateLink`), copying is handled
 * here via `handleCopyLink`.
 */
export default function Share({
	activeTab,
	isPaid,
	previewFileName,
	saveError,
	shareUrl,
	copied,
	copiedLinkId,
	guestName,
	generatedLinks,
	setGuestName,
	handleGenerateLink,
	handleCopyLink,
	handleDeleteLink
}: ShareProps) {
	return (
		<section className={`mx-auto max-w-7xl ${activeTab === 'share' ? '' : 'hidden'}`}>
			<div className="mt-6 border-t border-slate-100 pt-6">
				{!isPaid ? (
					//TODO: change text in future
					<p className="mt-2 text-center">
						Link đã được tạo. Bạn có thể chia sẻ thiệp cưới với mọi người.
					</p>
				) : !previewFileName ? (
					<p className="mt-2 text-center">
						Xem thiệp demo trước khi tạo link gửi cho khách.
					</p>
				) : null}
				{saveError ? <p className="mt-2 text-center text-sm text-pink-600">{saveError}</p> : null}

				<div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
					<label htmlFor="guestNameInput" className="mb-2 block text-sm font-medium text-slate-700">
						Tên người mời
					</label>
					<div className="flex flex-col gap-2 sm:flex-row">
						<input
							id="guestNameInput"
							value={guestName}
							onChange={(e) => setGuestName(e.target.value)}
							placeholder="VD: Chị Lan, Anh Tài, Gia đình bạn Nam..."
							className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-pink-300"
						/>
						<button
							type="button"
							onClick={handleGenerateLink}
							className="inline-flex items-center justify-center rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
						>
							Tạo Link
						</button>
					</div>
					<p className="mt-2 text-xs text-slate-500">
						Mỗi tên người mời sẽ tạo ra một liên kết riêng, giúp bạn theo dõi khách mời dễ dàng hơn.
					</p>
				</div>

				{generatedLinks.length > 0 ? (
					<div className="mt-5 space-y-3">
						{generatedLinks.map((link) => (
							<div key={link.id} className="rounded-xl border border-slate-200 bg-white p-3">
								<div className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
									{link.guestName}
								</div>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<input
										readOnly
										value={link.url}
										onFocus={(e) => e.target.select()}
										className="flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
									/>
									<button
										type="button"
										onClick={() => handleCopyLink(link.url)}
										className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-pink-300 hover:text-pink-600"
									>
										<Copy className="h-4 w-4" />
										{copiedLinkId === link.id ? 'Đã sao chép!' : 'Sao chép'}
									</button>
									<button
										type="button"
										onClick={() => handleDeleteLink(link.id)}
										aria-label={`Xóa link của ${link.guestName}`}
										className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
									>
										<Trash2 className="h-4 w-4" />
										Xóa
									</button>
								</div>
							</div>
						))}
					</div>
				) : shareUrl ? (
					<div className="mt-4 flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center">
						<input
							readOnly
							value={shareUrl}
							onFocus={(e) => e.target.select()}
							className="flex-1 truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
						/>
						<button
							type="button"
							onClick={() => handleCopyLink(shareUrl)}
							className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-pink-300 hover:text-pink-600"
						>
							<Copy className="h-4 w-4" />
							{copied ? 'Đã sao chép!' : 'Sao chép'}
						</button>
					</div>
				) : null}
			</div>
		</section>
	);
}
