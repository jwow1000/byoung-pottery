import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'title', title: 'Site Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'heroImage', type: 'imageWithAlt'}),
    defineField({
      name: 'featuredProducts',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'shopAnnouncement',
      type: 'string',
      description: 'Optional banner, e.g. "Next shop update: Dec 5 at 10am PT"',
    }),
    defineField({name: 'contactEmail', type: 'string', validation: (rule) => rule.email()}),
    defineField({name: 'instagram', type: 'url'}),
    defineField({name: 'seo', title: 'Default SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
