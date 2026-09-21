'use client';

import { useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';

/**
 * Visual variants for the upload box:
 * - `portrait` — 3:4 cards used for the cover / groom / bride photos and each gallery slot.
 * - `square` — 128px boxes used for the groom / bride payment QR codes.
 */
export type ImageUploadVariant = 'portrait' | 'square';

interface VariantStyles {
	/** Classes for the filled preview box (needs a positioning context for `next/image` `fill`). */
	box: string;
	/** Classes for the empty, clickable placeholder. */
	placeholder: string;
	/** Size of the upload / spinner icons. */
	icon: string;
	/** Font size of the placeholder caption. */
	placeholderText: string;
}

const VARIANTS: Record<ImageUploadVariant, VariantStyles> = {
	portrait: {
		box: 'aspect-3/4 w-full rounded-xl',
		placeholder: 'aspect-3/4 w-full gap-2 rounded-xl',
		icon: 'h-6 w-6',
		placeholderText: 'text-xs'
	},
	square: {
		box: 'h-32 w-32 rounded-lg',
		placeholder: 'h-32 w-32 gap-1.5 rounded-lg',
		icon: 'h-5 w-5',
		placeholderText: 'text-[11px]'
	}
};

const DEFAULT_SIZES = '(max-width: 640px) 100vw, 33vw';

/** Shown before a photo is replaced, because replacing also deletes it. */
const REPLACE_CONFIRM_MESSAGE = 'Bạn có chắc muốn đổi ảnh này? Ảnh hiện tại sẽ bị xoá.';

export interface ImageUploadCardProps {
	/** Current image URL. An empty value renders the dashed placeholder instead. */
	value?: string;
	/** Alt text for the preview image. */
	alt: string;
	/** True while this card's file is uploading — shows a spinner over the box. */
	uploading?: boolean;
	/** Receives the picked file, or `null` when the file dialog was cancelled. */
	onUpload: (file: File | null) => void;
	/**
	 * Called by the hover overlay. Return `false` to abort — e.g. the delete
	 * confirmation was dismissed — and the new file is not uploaded.
	 *
	 * `skipConfirm` is `true` when this runs as part of a replace, because the
	 * replacement prompt already told the user the current photo gets deleted.
	 */
	onRemove: (options?: { skipConfirm?: boolean }) => boolean | void | Promise<boolean | void>;
	/** Box proportions. Defaults to `portrait`. */
	variant?: ImageUploadVariant;
	/** `next/image` sizes attribute. Defaults to a third-of-a-grid cell. */
	sizes?: string;
	/** Caption under the upload icon in the empty state. */
	placeholderText?: string;
	/**
	 * What picking a file does when the slot is already filled. Defaults to
	 * `await onRemove()` then `onUpload(file)`.
	 *
	 * Only needed where removing first is wrong — e.g. gallery slots, whose
	 * `onRemove` drops the array entry and shifts every later index.
	 */
	onReplace?: (file: File) => void | Promise<void>;
	/**
	 * Replace button rendered under the box on touch devices — phones *and*
	 * tablets — where the hover overlay can never be triggered.
	 */
	touchReplaceLabel?: string;
	/** Delete button rendered under the box on touch devices. */
	touchRemoveLabel?: string;
}

/**
 * One image slot: a preview with a hover overlay (replace / delete) when
 * filled, or a clickable dashed placeholder when empty.
 *
 * Centralises the upload input wiring and the upload/delete affordances that
 * the invitation builder previously repeated for the gallery, the payment QR
 * codes and the cover / groom / bride photos.
 */
export default function ImageUploadCard({
	value,
	alt,
	uploading = false,
	onUpload,
	onRemove,
	onReplace,
	variant = 'portrait',
	sizes = DEFAULT_SIZES,
	placeholderText = 'Tải ảnh lên',
	touchReplaceLabel,
	touchRemoveLabel
}: ImageUploadCardProps) {
	const styles = VARIANTS[variant];
	const fileInputRef = useRef<HTMLInputElement>(null);

	/**
	 * A filled slot asks first, because replacing also deletes the photo that is
	 * there now. An empty slot just opens the picker.
	 */
	const openPicker = () => {
		if (value && !window.confirm(REPLACE_CONFIRM_MESSAGE)) {
			return;
		}
		fileInputRef.current?.click();
	};

	const handleFilePicked = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;
		// Reset so picking the same file again still fires `onChange`.
		event.target.value = '';

		if (!file) return;

		if (!value) {
			onUpload(file);
			return;
		}

		if (onReplace) {
			await onReplace(file);
			return;
		}

		// `onRemove` is awaited so the delete finishes before the new upload —
		// both can target the same S3 key when the file name is unchanged.
		// `skipConfirm` avoids a second prompt; the replacement one already ran.
		if ((await onRemove({ skipConfirm: true })) === false) return;

		onUpload(file);
	};

	return (
		<div className="relative">
			{value ? (
				<div className={`group relative overflow-hidden border border-slate-200 ${styles.box}`}>
					<Image src={value} alt={alt} fill sizes={sizes} className="object-cover" />

					{/* One hidden input shared by the hover icon and the mobile button. */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						disabled={uploading}
						onChange={handleFilePicked}
					/>

					<div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
						<button
							type="button"
							onClick={openPicker}
							className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-green-600"
						>
							<RefreshCw className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => onRemove()}
							className="rounded-lg bg-white/90 p-2 text-slate-700 transition hover:bg-white hover:text-pink-600"
						>
							<Trash2 className="h-4 w-4" />
						</button>
					</div>

					{uploading ? (
						<div className="absolute inset-0 flex items-center justify-center bg-black/40">
							<Loader2 className={`${styles.icon} animate-spin text-white`} />
						</div>
					) : null}
				</div>
			) : (
				<label
					className={`flex cursor-pointer flex-col items-center justify-center border border-dashed border-slate-300 text-slate-400 transition hover:border-pink-300 hover:text-pink-500 ${styles.placeholder}`}
				>
					{uploading ? (
						<Loader2 className={`${styles.icon} animate-spin`} />
					) : (
						<>
							<Upload className={styles.icon} />
							<span className={`${styles.placeholderText} font-medium`}>{placeholderText}</span>
						</>
					)}
					<input
						type="file"
						accept="image/*"
						className="hidden"
						disabled={uploading}
						onChange={(event) => onUpload(event.target.files?.[0] ?? null)}
					/>
				</label>
			)}
            <div className="columns-2 gap-2 w-[128px]">
                {/*
                 * Touch-device fallbacks. Visibility keys off the pointer type
                 * (`pointer-coarse`) rather than the viewport width, so tablets
                 * get them too — `sm:hidden` used to hide them from 640px up.
                 */}
                {touchReplaceLabel && value ? (
                    <button
                        type="button"
                        onClick={openPicker}
                        className="mt-1.5 hidden w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-pink-300 hover:text-pink-600 pointer-coarse:inline-flex"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        {touchReplaceLabel}
                    </button>
                ) : null}
                {touchRemoveLabel && value ? (
                    <button
                        type="button"
                        onClick={() => onRemove()}
                        className="mt-1.5 hidden w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-pink-300 hover:text-pink-600 pointer-coarse:inline-flex"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        {touchRemoveLabel}
                    </button>
                ) : null}
            </div>
		</div>
	);
}

export interface LabeledImageUploadCardProps extends Omit<ImageUploadCardProps, 'alt'> {
	/** Caption rendered above the box; also the default alt text. */
	label: string;
	/** Alt text override. Defaults to `label`. */
	alt?: string;
}

/** `ImageUploadCard` with a caption above it — the form-field flavour. */
export function LabeledImageUploadCard({ label, alt, ...cardProps }: LabeledImageUploadCardProps) {
	return (
		<div>
			<p className="mb-2 text-xs font-medium text-slate-600">{label}</p>
			<ImageUploadCard alt={alt ?? label} {...cardProps} />
		</div>
	);
}
