'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';

export interface PhotoGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
  columnsLarge?: number;
  columnsMedium?: number;
  aspectRatio?: string;
}

export default function PhotoGallery({ 
  images, 
  columnsLarge = 3,
  columnsMedium = 2,
  aspectRatio = 'aspect-square'
}: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const getGridColsClass = () => {
    return `grid-cols-1 md:grid-cols-${columnsMedium} lg:grid-cols-${columnsLarge}`;
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = () => {
    if (zoom > 1) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition(prev => ({
        x: prev.x + event.movementX,
        y: prev.y + event.movementY
      }));
    }
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (selectedIndex !== null) {
      resetZoom();
    }
  }, [selectedIndex]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-${columnsMedium} lg:grid-cols-${columnsLarge}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative ${aspectRatio} overflow-hidden rounded-lg cursor-pointer group`}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="rounded-full bg-black/50 p-2 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="rounded-full bg-black/50 p-2 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
              className="rounded-full bg-black/50 p-2 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Reset zoom"
            >
              <RefreshCcw size={18} />
            </button>
            <span className="text-sm text-white">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Image container */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden"
            onWheel={(e) => {
              e.stopPropagation();
              handleWheel(e);
            }}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              fill
              className={`object-contain transition-transform duration-200 ${zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'}`}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transformOrigin: 'center'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMouseDown();
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (zoom === 1) handleZoomIn();
              }}
              draggable={false}
            />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
