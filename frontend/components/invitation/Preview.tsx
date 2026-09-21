'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { buildLoginHref } from '@/lib/authRedirect';

type InvitationTab = 'select' | 'input' | 'preview' | 'share';

interface PreviewProps {
	activeTab: InvitationTab;
	invitationTabLoading: boolean;
	invitationTabError: string | null;
	invitationTabUrl: string | null;
	isLoggedIn: boolean;
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
	invitationTabUrl,
	isLoggedIn
}: PreviewProps) {
	// Send the user back to this very step after they sign in.
	const loginHref = buildLoginHref(`/invitation#${activeTab}`);

	return (
		<section id="preview" className={`mx-auto max-w-7xl ${activeTab === 'preview' ? '' : 'hidden'}`}>
			<div className="mt-6 rounded-2xl border border-slate-200">
				{invitationTabLoading ? (
					<div className="flex min-h-[60vh] items-center justify-center text-slate-500">
						<Loader2 className="mr-2 h-5 w-5 animate-spin text-pink-500" />
						Đang tải thiệp cưới...
					</div>
				) : invitationTabError ? (
					<div className="rounded-xl border border-pink-100 bg-pink-50 p-4 text-center text-sm text-pink-600">
						<p className="font-medium">{invitationTabError}</p>
						{!isLoggedIn ? (
							<div className="mt-3 flex items-center justify-center gap-3">
								<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng nhập</Link>
								<span className="text-pink-700">/</span>
								<Link href={loginHref} className="font-semibold text-pink-700 underline hover:text-pink-800">Đăng ký</Link>
							</div>
						) : null}
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
