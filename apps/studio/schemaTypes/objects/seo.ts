import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.max(60).warning('Keep under 60 characters')}),
    defineField({name: 'description', type: 'text', rows: 3, validation: (rule) => rule.max(160).warning('Keep under 160 characters')}),
    defineField({name: 'image', type: 'image'}),
  ],
})
