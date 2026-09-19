'use client';

import { useCallback, useEffect, useState } from 'react';
import {
	Photo,
	getPhotos,
	uploadPhotos as apiUploadPhotos,
	deletePhoto as apiDeletePhoto,
	togglePhotoFavorite as apiToggleFavorite
} from '@/api/photo';

export type PhotoToast = (message: string, type?: 'success' | 'error') => void;

/** Shape returned by the shared `handleUpload` (same as the API call). */
export type PhotoUploadResult = Awaited<ReturnType<typeof apiUploadPhotos>>;

export interface UsePhotoLibraryOptions {
	/** Loads the library on mount. Pass `isLoggedIn` so guests skip the request. */
	enabled?: boolean;
	/** Surfaces success/error messages to the host page (e.g. its toast). */
	onToast?: PhotoToast;
	/** Runs after a photo was deleted on the backend (clear viewer/selection state). */
	onPhotoDeleted?: (photo: Photo) => void;
}

/**
 * Shared photo-library state and actions.
 *
 * Extracted from `app/photos/page.tsx` so the same `handleUpload` and
 * `handleDeletePhoto` implementations can be reused by other pages (the
 * invitation builder uploads and deletes the very same photos).
 */
export function handlePhoto({ enabled = true, onToast, onPhotoDeleted }: UsePhotoLibraryOptions = {}) {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);

	const showToast = useCallback<PhotoToast>(
		(message, type = 'success') => {
			onToast?.(message, type);
		},
		[onToast]
	);

	// Load photos from backend when the owner is signed in.
	useEffect(() => {
		if (!enabled) {
			return;
		}

		let cancelled = false;
		setLoading(true);

		const loadPhotosData = async () => {
			try {
				const response = await getPhotos();
				if (!cancelled) {
					// Initialize with an empty array when no photos exist.
					setPhotos(response.success && response.data ? response.data : []);
				}
			} catch {
				if (!cancelled) {
					showToast('Không thể tải hình', 'error');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		loadPhotosData();

		return () => {
			cancelled = true;
		};
	}, [enabled, showToast]);

	const handleUpload = useCallback(
		async (
			files: File[],
			category: string,
			description?: string,
			tags?: string[]
		): Promise<PhotoUploadResult> => {
			try {
				const response = await apiUploadPhotos(files, category, description, tags);

				if (response.success && response.data) {
					setPhotos((prev) => [...response.data!, ...prev]);

					let message = `Đã tải lên thành công ${response.data.length} hình${response.data.length !== 1 ? 's' : ''}`;

					if (response.errors && response.errors.length > 0) {
						message += `. ${response.errors.length} hình không thể xử lý.`;
						// eslint-disable-next-line no-console
						console.warn('Upload errors:', response.errors);
					}

					showToast(message, 'success');
				} else {
					showToast(response.message || 'Không thể tải hình', 'error');

					if (response.errors) {
						// eslint-disable-next-line no-console
						console.error('Upload errors:', response.errors);
					}
				}

				return response;
			} catch {
				showToast('Không thể tải hình', 'error');
				return { success: false, message: 'Không thể tải hình' };
			}
		},
		[showToast]
	);

	const handleToggleFavorite = useCallback(
		async (photoId: string) => {
			try {
				const response = await apiToggleFavorite(photoId);
				if (response.success && response.data) {
					setPhotos((prev) => prev.map((photo) => (photo.id === photoId ? response.data! : photo)));

					const photo = photos.find((p) => p.id === photoId);
					if (photo) {
						showToast(
							response.data.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích',
							'success'
						);
					}
				} else {
					showToast(response.message || 'Không thể cập nhật yêu thích', 'error');
				}
			} catch {
				showToast('Không thể cập nhật yêu thích', 'error');
			}
		},
		[photos, showToast]
	);

	/** Confirms, deletes on the backend and drops the photo from local state. Resolves `true` when deleted. */
	const handleDeletePhoto = useCallback(
		async (photoId: string): Promise<boolean> => {
			const photo = photos.find((p) => p.id === photoId);
			if (!photo || !window.confirm(`Bạn có chắc chắn muốn xóa "${photo.name}"?`)) {
				return false;
			}

			try {
				const response = await apiDeletePhoto(photoId);
				if (response.success) {
					setPhotos((prev) => prev.filter((p) => p.id !== photoId));
					onPhotoDeleted?.(photo);
					showToast(`Đã xóa "${photo.name}"`, 'success');
					return true;
				}

				showToast(response.message || 'Không thể xóa hình', 'error');
				return false;
			} catch {
				showToast('Không thể xóa hình', 'error');
				return false;
			}
		},
		[photos, showToast, onPhotoDeleted]
	);

	return { photos, setPhotos, loading, handleUpload, handleDeletePhoto, handleToggleFavorite };
}
