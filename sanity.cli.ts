import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'wwt75mik',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
