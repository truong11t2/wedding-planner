export interface BlogPost {
  id: string
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  content: string
  coverImage?: string
}

export interface Vendor {
  id: string
  slug: string
  name: string
  category: string
  description: string
  services: string[]
  pricing: string
  location: string
  contact: {
    phone?: string
    email: string
    website?: string
  }
  image: string
  rating?: number
  reviews?: number
}