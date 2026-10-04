import { Playfair_Display } from 'next/font/google';

// Geist is latin-only; Playfair Display ships a Vietnamese subset for headings.
export const displayFont = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-display',
  display: 'swap',
});
