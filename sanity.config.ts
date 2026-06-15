import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {profileType} from './sanity/schemas/profile'
import {experienceType} from './sanity/schemas/experience'
import {skillType} from './sanity/schemas/skill'
import {projectType} from './sanity/schemas/project'
import {educationType} from './sanity/schemas/education'
import {postType} from './sanity/schemas/post'
import {socialLinkType} from './sanity/schemas/socialLink'

export default defineConfig({
  name: 'portfolio',
  title: 'Personal Portfolio',
  projectId: 'wwt75mik',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: [
      profileType,
      experienceType,
      skillType,
      projectType,
      educationType,
      postType,
      socialLinkType,
    ],
  },
})
