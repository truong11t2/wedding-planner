const API_BASE_URL = process.env.BACKEND_ADDRESS || 'http://localhost:5000';

export interface Photo {
  id: string;
  name: string;
  url: string;           // Full size image URL
  thumbnailUrl: string;  // Thumbnail URL
  mediumUrl?: string;    // Medium size URL
  size: number;          // Original file size
  processedSizes?: {     // Processed file sizes
    thumbnail: number;
    medium: number;
    full: number;
  };
  uploadDate: string;    // When uploaded to our system
  takenDate: string;     // When photo was actually taken (from EXIF)
  category: string;
  tags: string[];
  isFavorite: boolean;
  description?: string;
  exifData?: {           // EXIF metadata from backend
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    flash?: boolean;
    location?: {
      latitude?: number;
      longitude?: number;
    };
  };
  originalMetadata?: {   // Original image metadata
    width?: number;
    height?: number;
    format?: string;
    colorSpace?: string;
    hasAlpha?: boolean;
  };
}

export interface PhotoStats {
  total: number;
  favorites: number;
  categories: number;
  totalSize: number;
  byCategory: Record<string, number>;
  recentUploads: Photo[];
}

// Get user's photos
export const getPhotos = async (): Promise<{
  success: boolean;
  data?: Photo[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get photos',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting photos:', error);
    return {
      success: false,
      message: 'Network error while fetching photos',
    };
  }
};

// Save entire photos collection
export const savePhotos = async (photos: Photo[]): Promise<{
  success: boolean;
  data?: Photo[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photos }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to save photos',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error saving photos:', error);
    return {
      success: false,
      message: 'Network error while saving photos',
    };
  }
};

// Upload photos using FormData
export const uploadPhotos = async (
  files: File[], 
  category: string, 
  description?: string, 
  tags?: string[]
): Promise<{
  success: boolean;
  data?: Photo[];
  errors?: Array<{filename: string, error: string}>;
  message?: string;
}> => {
  try {
    // Create FormData
    const formData = new FormData();
    
    // Add files
    files.forEach(file => {
      formData.append('photos', file);
    });

    // Add metadata
    formData.append('category', category);
    if (description) formData.append('description', description);
    if (tags && tags.length > 0) formData.append('tags', tags.join(','));

    const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to upload photos',
        errors: data.errors
      };
    }

    return {
      success: true,
      data: data.data,
      errors: data.errors,
      message: data.message,
    };
  } catch (error) {
    console.error('Error uploading photos:', error);
    return {
      success: false,
      message: 'Network error while uploading photos',
    };
  }
};

// Update photo
export const updatePhoto = async (photoId: string, updates: Partial<Photo>): Promise<{
  success: boolean;
  data?: Photo;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/${photoId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update photo',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error updating photo:', error);
    return {
      success: false,
      message: 'Network error while updating photo',
    };
  }
};

// Delete photo
export const deletePhoto = async (photoId: string): Promise<{
  success: boolean;
  data?: Photo;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/${photoId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete photo',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error deleting photo:', error);
    return {
      success: false,
      message: 'Network error while deleting photo',
    };
  }
};

// Toggle photo favorite
export const togglePhotoFavorite = async (photoId: string): Promise<{
  success: boolean;
  data?: Photo;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/${photoId}/favorite`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to toggle favorite',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return {
      success: false,
      message: 'Network error while toggling favorite',
    };
  }
};

// Get photos by category
export const getPhotosByCategory = async (category: string): Promise<{
  success: boolean;
  data?: Photo[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/category/${category}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get photos by category',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting photos by category:', error);
    return {
      success: false,
      message: 'Network error while fetching photos by category',
    };
  }
};

// Search photos
export const searchPhotos = async (query: string): Promise<{
  success: boolean;
  data?: Photo[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to search photos',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error searching photos:', error);
    return {
      success: false,
      message: 'Network error while searching photos',
    };
  }
};

// Get photo statistics
export const getPhotoStats = async (): Promise<{
  success: boolean;
  data?: PhotoStats;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/stats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get photo statistics',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting photo statistics:', error);
    return {
      success: false,
      message: 'Network error while fetching photo statistics',
    };
  }
};
