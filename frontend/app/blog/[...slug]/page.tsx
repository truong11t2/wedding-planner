import { getBlogPost } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '@/styles/article.module.css';
import { MDXComponents } from '@/components/mdx/MDXComponents';


interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function BlogPost({ params }: PageProps) {
  // Await the params before using them
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <div className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>•</span>
          <span>{post.author}</span>
        </div>
        <div className={styles.coverImage}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      <div className={`${styles.content} prose prose-lg`}>
        <MDXRemote 
          source={post.content} 
          components={MDXComponents}
        />
      </div>
    </article>
  );
}