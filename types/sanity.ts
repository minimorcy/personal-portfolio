export interface Profile {
  _id: string
  name: string
  title?: string
  bio?: string
  avatar?: SanityImage
  location?: string
  email?: string
  socialLinks?: SocialLink[]
}

export interface Experience {
  _id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  description?: string
  technologies?: string[]
  logo?: SanityImage
}

export interface Skill {
  _id: string
  name: string
  category: string
  level: number
  icon?: string
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  mainImage?: SanityImage
  demoUrl?: string
  repoUrl?: string
  technologies?: string[]
  featured?: boolean
}

export interface Education {
  _id: string
  institution: string
  degree: string
  startDate: string
  endDate?: string
  description?: string
  logo?: SanityImage
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  body?: PortableTextBlock[]
  publishedAt: string
  tags?: string[]
  coverImage?: SanityImage
}

export interface SocialLink {
  _id: string
  platform: string
  url: string
  icon?: string
  order?: number
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
}

export interface PortableTextBlock {
  _key: string
  _type: string
  children?: {
    _key: string
    _type: string
    text: string
    marks?: string[]
  }[]
  markDefs?: unknown[]
  style?: string
}
