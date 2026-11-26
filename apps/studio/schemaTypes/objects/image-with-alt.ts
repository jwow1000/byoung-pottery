import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      description: 'Describe the piece for screen readers, e.g. "Speckled stoneware mug with celadon glaze"',
      validation: (rule) => rule.required(),
    }),
  ],
})
