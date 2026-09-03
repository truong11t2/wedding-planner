'use client';

import { Loader2 } from 'lucide-react';

type InvitationTab = 'template' | 'info' | 'invitation' | 'share';

interface PreviewProps {
	activeTab: InvitationTab;
	invitationTabLoading: boolean;
	invitationTabError: string | null;
	invitationTabUrl: string | null;
}

/**
 * Tab 3 — "Xem thiệp": the invitation preview.
 *
 * Renders the loading / error / iframe states. The preview URL is loaded
 * by the parent (`loadInvitationTabPreview`) and passed down.
 */
export default function Preview({
	activeTab,
	invitationTabLoading,
	invitationTabError,
	invitationTabUrl
}: PreviewProps) {
	return (
		<section className={`mx-auto max-w-7xl ${activeTab === 'invitation' ? '' : 'hidden'}`}>
			<div className="mt-6 rounded-2xl border border-slate-200">
				{invitationTabLoading ? (
					<div className="flex min-h-[60vh] items-center justify-center text-slate-500">
						<Loader2 className="mr-2 h-5 w-5 animate-spin text-pink-500" />
						Đang tải thiệp cưới...
					</div>
				) : invitationTabError ? (
					<div className="flex min-h-[60vh] items-center justify-center text-center text-sm text-pink-600">
						{invitationTabError}
					</div>
				) : invitationTabUrl ? (
					<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
						<iframe
							src={invitationTabUrl}
							title="Wedding invitation preview"
							className="h-[80vh] w-full border-0 bg-white"
						/>
					</div>
				) : (
					<div className="flex min-h-[60vh] items-center justify-center text-center text-sm text-slate-500">
						Chưa có thiệp để hiển thị. Hãy điền thông tin và bấm &ldquo;Xem thiệp&rdquo;.
					</div>
				)}
			</div>
		</section>
	);
}
