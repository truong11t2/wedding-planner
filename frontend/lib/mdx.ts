import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, Vendor } from './types'

const blogDirectory = path.join(process.cwd(), 'content/blog')
const vendorsDirectory = path.join(process.cwd(), 'content/vendor')

export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(blogDirectory)
  
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(blogDirectory, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      
      return {
        id: data.id,
        slug: file.replace('.mdx', ''),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        content,
        coverImage: data.coverImage,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
  return posts
}

export async function getVendors(): Promise<Vendor[]> {
  const files = fs.readdirSync(vendorsDirectory)
  
  const vendors = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(vendorsDirectory, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      
      return {
        slug: file.replace('.mdx', ''),
        content,
        name: data.name,
        category: data.category,
        image: data.image,
        description: data.description,
        price: data.price,
        rating: data.rating,
        location: data.location,
        id: data.id,
        services: data.services,
        pricing: data.pricing,
        contact: data.contact,
        // Add other properties as needed
        ...data,
      }
    })
    
  return vendors
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      content,
      ...data,
    } as BlogPost
  } catch (error) {
    return null
  }
}

export async function getVendor(slug: string) {
  try {
    const fullPath = path.join(vendorsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      content,
      name: data.name,
      category: data.category,
      image: data.image,
      description: data.description,
      price: data.price,
      rating: data.rating,
      location: data.location,
      // Add other properties as needed
      ...data,
    };
  } catch (error) {
    return null;
  }
}