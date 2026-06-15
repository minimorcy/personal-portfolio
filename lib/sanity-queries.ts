export const PROFILE_QUERY = `*[_type == "profile"][0]`

export const EXPERIENCES_QUERY = `*[_type == "experience"] | order(startDate desc)`

export const SKILLS_QUERY = `*[_type == "skill"] | order(category asc, name asc)`

export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && featured == true] | order(_createdAt desc)`

export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc)`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]`

export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc)`

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]`

export const EDUCATION_QUERY = `*[_type == "education"] | order(startDate desc)`

export const SOCIAL_LINKS_QUERY = `*[_type == "socialLink"] | order(order asc)`
