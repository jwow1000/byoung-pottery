import {defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons/Folder'

export const collection = defineType({
  name: 'collection',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (rule) => rule.required()}),
    defineField({name: 'coverImage', type: 'imageWithAlt'}),
    defineField({name: 'description', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'title', media: 'coverImage'}},
})
