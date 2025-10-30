'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/common/Toast';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Download, 
  Eye, 
  X, 
  Grid3X3, 
  List,
  Search,
  Filter,
  Heart,
  Share2,
  Calendar,
  Camera,
  Users,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface Photo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  uploadDate: Date;
  category: string;
  tags: string[];
  isFavorite: boolean;
  description?: string;
  location?: string;
  people?: string[];
}

interface PhotoViewerProps {
  photo: Photo;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleFavorite: (photoId: string) => void;
  onDelete: (photoId: string) => void;
}

function PhotoViewer({ 
  photo, 
  photos, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrevious, 
  onToggleFavorite,
  onDelete 
}: PhotoViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onPrevious();
        break;
      case 'ArrowRight':
        onNext();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
    }
  }, [onClose, onNext, onPrevious]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {currentIndex + 1} of {photos.length}
            </span>
            <h3 className="font-medium">{photo.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(photo.id)}
              className={`p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors ${
                photo.isFavorite ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className={`h-5 w-5 ${photo.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-sm"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => onDelete(photo.id)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-red-400"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
        disabled={currentIndex === photos.length - 1}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center p-16 overflow-hidden">
        <img
          src={photo.url}
          alt={photo.name}
          className={`max-w-full max-h-full object-contain transition-transform ${
            zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: 'center'
          }}
          onMouseDown={handleMouseDown}
          onClick={() => zoom === 1 && handleZoomIn()}
          draggable={false}
        />
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto shadow-2xl">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Photo Details</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{photo.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <p className="text-gray-900">{photo.category}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Upload Date</label>
                <p className="text-gray-900">{photo.uploadDate.toLocaleDateString()}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Size</label>
                <p className="text-gray-900">{(photo.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              {photo.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{photo.description}</p>
                </div>
              )}

              {photo.location && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{photo.location}</p>
                </div>
              )}

              {photo.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {photo.people && photo.people.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">People</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {photo.people.map((person) => (
                      <span
                        key={person}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = photo.url;
                  link.download = photo.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], category: string, description: string, tags: string[]) => void;
}

function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState('ceremony');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'ceremony', 'reception', 'engagement', 'pre-wedding', 
    'getting-ready', 'portraits', 'candid', 'details', 'venue', 'other'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length > 0) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      onUpload(files, category, description, tagArray);
      setFiles([]);
      setDescription('');
      setTags('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upload Photos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop photos here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PNG, JPG, GIF up to 10MB each
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Select Photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Selected Files ({files.length})</h3>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                rows={3}
                placeholder="Describe these photos..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter tags separated by commas (e.g., bride, groom, family)"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={files.length === 0}
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload {files.length} Photo{files.length !== 1 ? 's' : ''}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PhotosPage() {
  const { isLoggedIn } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as const
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Initialize with sample photos
  React.useEffect(() => {
    if (isLoggedIn) {
      const samplePhotos: Photo[] = [
        {
          id: '1',
          name: 'engagement-ring.jpg',
          url: '/api/placeholder/800/600',
          thumbnailUrl: '/api/placeholder/300/200',
          size: 2500000,
          uploadDate: new Date('2024-01-15'),
          category: 'engagement',
          tags: ['ring', 'proposal', 'romantic'],
          isFavorite: true,
          description: 'The perfect moment when everything began',
          location: 'Central Park, NYC'
        },
        {
          id: '2',
          name: 'ceremony-kiss.jpg',
          url: '/api/placeholder/800/600',
          thumbnailUrl: '/api/placeholder/300/200',
          size: 3200000,
          uploadDate: new Date('2024-02-01'),
          category: 'ceremony',
          tags: ['ceremony', 'kiss', 'altar'],
          isFavorite: true,
          description: 'Our first kiss as married couple'
        },
        {
          id: '3',
          name: 'reception-dance.jpg',
          url: '/api/placeholder/800/600',
          thumbnailUrl: '/api/placeholder/300/200',
          size: 2800000,
          uploadDate: new Date('2024-02-01'),
          category: 'reception',
          tags: ['dance', 'celebration', 'party'],
          isFavorite: false,
          description: 'Dancing the night away'
        },
        {
          id: '4',
          name: 'getting-ready.jpg',
          url: '/api/placeholder/800/600',
          thumbnailUrl: '/api/placeholder/300/200',
          size: 1900000,
          uploadDate: new Date('2024-02-01'),
          category: 'getting-ready',
          tags: ['preparation', 'bride', 'makeup'],
          isFavorite: false,
          description: 'Final preparations before the big moment'
        },
        {
          id: '5',
          name: 'couple-portrait.jpg',
          url: '/api/placeholder/800/600',
          thumbnailUrl: '/api/placeholder/300/200',
          size: 2100000,
          uploadDate: new Date('2024-02-01'),
          category: 'portraits',
          tags: ['portrait', 'couple', 'love'],
          isFavorite: true,
          description: 'A moment of quiet love amidst the celebration'
        },
        {
          id: '6',
          name: 'venue-details.jpg',
          url: '/api/placeholder/800/600',
          thumbnailUrl: '/api/placeholder/300/200',
          size: 1700000,
          uploadDate: new Date('2024-02-01'),
          category: 'venue',
          tags: ['venue', 'decoration', 'flowers'],
          isFavorite: false,
          description: 'Beautiful venue decorations'
        }
      ];
      setPhotos(samplePhotos);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Access your wedding photos by logging in first.</p>
        </div>
      </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(photos.map(photo => photo.category)))];

  const filteredPhotos = photos.filter(photo => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      photo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (photo.description && photo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFavorites = !showFavoritesOnly || photo.isFavorite;
    
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  const handleUpload = async (files: File[], category: string, description: string, tags: string[]) => {
    // Simulate upload process
    const newPhotos: Photo[] = files.map((file, index) => ({
      id: Date.now().toString() + index,
      name: file.name,
      url: URL.createObjectURL(file), // In real app, this would be server URL
      thumbnailUrl: URL.createObjectURL(file),
      size: file.size,
      uploadDate: new Date(),
      category,
      tags,
      isFavorite: false,
      description: description || undefined
    }));

    setPhotos(prev => [...newPhotos, ...prev]);
    showToast(`Successfully uploaded ${files.length} photo${files.length !== 1 ? 's' : ''}`, 'success');
  };

  const handleToggleFavorite = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, isFavorite: !photo.isFavorite }
        : photo
    ));
    
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      showToast(
        photo.isFavorite ? 'Removed from favorites' : 'Added to favorites',
        'success'
      );
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo && window.confirm(`Are you sure you want to delete "${photo.name}"?`)) {
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      setSelectedPhoto(null);
      showToast(`Deleted "${photo.name}"`, 'success');
    }
  };

  const openPhotoViewer = (photo: Photo) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(filteredPhotos.findIndex(p => p.id === photo.id));
  };

  const nextPhoto = () => {
    const nextIndex = Math.min(currentPhotoIndex + 1, filteredPhotos.length - 1);
    setCurrentPhotoIndex(nextIndex);
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const previousPhoto = () => {
    const prevIndex = Math.max(currentPhotoIndex - 1, 0);
    setCurrentPhotoIndex(prevIndex);
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  const favoriteCount = photos.filter(p => p.isFavorite).length;
  const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0);

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Photos</h1>
          <p className="text-gray-600">
            Capture and organize all your precious wedding memories.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{photos.length}</div>
            <div className="text-sm text-gray-500">Total Photos</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{favoriteCount}</div>
            <div className="text-sm text-gray-500">Favorites</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{categories.length - 1}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {(totalSize / 1024 / 1024).toFixed(1)}MB
            </div>
            <div className="text-sm text-gray-500">Total Size</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search photos, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>

              {/* Favorites Filter */}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`inline-flex items-center px-3 py-2 rounded-lg border transition-colors ${
                  showFavoritesOnly
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites Only
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${
                    viewMode === 'grid'
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${
                    viewMode === 'list'
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Upload Button */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
               <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </button>
            </div>
          </div>
        </div>

        {/* Photos Display */}
        {filteredPhotos.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => openPhotoViewer(photo)}
                  >
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPhotoViewer(photo);
                          }}
                          className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(photo.id);
                          }}
                          className={`p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors ${
                            photo.isFavorite ? 'text-red-500' : 'text-gray-700'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Favorite Badge */}
                    {photo.isFavorite && (
                      <div className="absolute top-2 right-2">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="divide-y divide-gray-200">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openPhotoViewer(photo)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {photo.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(photo.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                photo.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePhoto(photo.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {photo.uploadDate.toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Camera className="h-3 w-3 mr-1" />
                            {photo.category}
                          </span>
                          <span>{(photo.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        
                        {photo.description && (
                          <p className="mt-1 text-sm text-gray-600 truncate">
                            {photo.description}
                          </p>
                        )}
                        
                        {photo.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {photo.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {photo.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{photo.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {photos.length === 0 ? 'No photos yet' : 'No photos match your filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {photos.length === 0 
                ? 'Start building your wedding photo collection by uploading your first photos'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {photos.length === 0 && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Photos
              </button>
            )}
          </div>
        )}

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />

        {/* Photo Viewer */}
        {selectedPhoto && (
          <PhotoViewer
            photo={selectedPhoto}
            photos={filteredPhotos}
            currentIndex={currentPhotoIndex}
            onClose={() => setSelectedPhoto(null)}
            onNext={nextPhoto}
            onPrevious={previousPhoto}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeletePhoto}
          />
        )}
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}