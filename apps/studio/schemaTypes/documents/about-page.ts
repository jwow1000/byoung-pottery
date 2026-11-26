import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const aboutPage = defineType({
  name: 'aboutPage',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'portrait', type: 'imageWithAlt'}),
    defineField({name: 'bio', type: 'richText'}),
    defineField({name: 'artistStatement', type: 'richText'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'About Page'})},
})
