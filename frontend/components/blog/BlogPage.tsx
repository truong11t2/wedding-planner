import { getBlogPosts } from '@/lib/mdx';
import BlogCard from './BlogCard';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-black">
        Wedding Planning Blog
      </h1>
      <p className="pb-8 text-gray-600 text-lg">
        Tips, ideas, and inspiration for your perfect day
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}