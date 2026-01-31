import { API_BASE_URL, ENDPOINTS } from './config';

interface AlbumPhoto {
  id: string;
  url: string;
  caption: string;
  order: number;
}

interface GenerateAlbumData {
  coupleNames: string;
  albumTitle: string;
  weddingDate: string;
  photos: AlbumPhoto[];
}

interface AlbumResponse {
  success: boolean;
  message: string;
  album: {
    id: string;
    publicUrl: string;
    htmlFileName: string;
  };
}

interface GetAlbumResponse {
  success: boolean;
  album: {
    id: string;
    coupleNames: string;
    albumTitle: string;
    weddingDate: string;
    publicUrl: string;
    photos: AlbumPhoto[];
    isPublished: boolean;
  };
}

export async function generateAlbum(data: GenerateAlbumData): Promise<AlbumResponse> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ALBUM.GENERATE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate album');
  }

  return response.json();
}

export async function getAlbum(): Promise<GetAlbumResponse> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ALBUM.BASE}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch album');
  }

  return response.json();
}

export async function updateAlbum(data: GenerateAlbumData): Promise<AlbumResponse> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ALBUM.UPDATE}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update album');
  }

  return response.json();
}

export async function deleteAlbum(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ALBUM.BASE}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete album');
  }

  return response.json();
}
