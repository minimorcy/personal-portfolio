type BreadcrumbItem = {
  name: string
  url: string
}

type PersonSchema = {
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  url: string
  image?: string
  jobTitle?: string
  sameAs?: string[]
}

type WebSiteSchema = {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  url: string
  name: string
  description?: string
}

type BreadcrumbListSchema = {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }[]
}

type ArticleSchema = {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  url: string
  datePublished: string
  dateModified: string
  author: {
    '@type': 'Person'
    name: string
  }
  image?: string
}

export function generatePersonSchema(
  name: string,
  url: string,
  image?: string,
  jobTitle?: string,
  sameAs?: string[],
): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    ...(image && { image }),
    ...(jobTitle && { jobTitle }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
  }
}

export function generateWebSiteSchema(
  url: string,
  name: string,
  description?: string,
): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    ...(description && { description }),
  }
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleSchema(
  title: string,
  url: string,
  datePublished: string,
  dateModified: string,
  author: string,
  image?: string,
): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    url,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    ...(image && { image }),
  }
}
