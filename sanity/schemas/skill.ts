import {defineField, defineType} from 'sanity'

export const skillType = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Frontend', value: 'frontend'},
          {title: 'Backend', value: 'backend'},
          {title: 'DevOps', value: 'devops'},
          {title: 'Database', value: 'database'},
          {title: 'Language', value: 'language'},
          {title: 'Tool', value: 'tool'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'number',
      description: 'Proficiency from 1 (beginner) to 5 (expert)',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon identifier (e.g. simple-icons name or emoji)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
})
