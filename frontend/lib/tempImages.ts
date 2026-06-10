/**
 * Temporary Unsplash Image URLs for Development
 * 
 * Replace component image URLs with these until you have actual images.
 * These are high-quality, free wedding photos from Unsplash.
 */

export const TEMP_IMAGES = {
  // Hero Section
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&q=80',
  
  // Feature Split Section
  photography: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&q=80',
  copywriting: 'https://images.unsplash.com/photo-1513434165166-9c52b22db15c?w=800&h=600&fit=crop&q=80',
  
  // Gallery Section
  gallery: {
    main: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=800&fit=crop&q=80',
    img2: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=600&fit=crop&q=80',
    img3: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop&q=80',
    img4: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop&q=80',
    img5: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=600&fit=crop&q=80',
  },
  
  // Testimonials Section
  avatars: {
    avatar1: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&h=200&fit=crop&q=80',
    avatar2: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=200&h=200&fit=crop&q=80',
    avatar3: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200&h=200&fit=crop&q=80',
  },
};

/**
 * USAGE EXAMPLES:
 * 
 * In HeroSection.tsx:
 * style={{ backgroundImage: `url('${TEMP_IMAGES.hero}')` }}
 * 
 * In FeatureSplit.tsx:
 * style={{ backgroundImage: `url('${TEMP_IMAGES.photography}')` }}
 * 
 * In GallerySection.tsx:
 * const galleryImages = [
 *   { url: TEMP_IMAGES.gallery.main, title: '...', ... },
 *   { url: TEMP_IMAGES.gallery.img2, title: '...', ... },
 *   ...
 * ];
 * 
 * In TestimonialsSection.tsx:
 * { avatar: TEMP_IMAGES.avatars.avatar1, ... }
 */

export default TEMP_IMAGES;
