import { getVendor } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '@/styles/article.module.css';
import { Star } from 'lucide-react';
import { MDXComponents } from '@/components/mdx/MDXComponents';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function VendorPage({ params }: PageProps) {
  // Await the params before using them
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  const vendor = await getVendor(slug);

  if (!vendor) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <div className={styles.header}>
        <div className="flex justify-between items-center mb-4">
          <h1 className={styles.title}>{vendor.name}</h1>
          <span className="text-2xl font-bold text-gray-700">{vendor.price}</span>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <span className="ml-2 font-semibold text-lg text-gray-600">{vendor.rating}</span>
          </div>
          <span className="text-gray-600">•</span>
          <span className="text-gray-600">{vendor.category}</span>
        </div>

        <div className={styles.coverImage}>
          <Image
            src={vendor.image}
            alt={vendor.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      <div className={`${styles.content} prose prose-lg`}>
        <MDXRemote 
          source={vendor.content} 
          components={MDXComponents}
        />
      </div>
    </article>
  );
}