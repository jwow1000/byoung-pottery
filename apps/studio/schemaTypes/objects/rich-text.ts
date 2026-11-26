import {defineArrayMember, defineType} from 'sanity'

export const richText = defineType({
  name: 'richText',
  type: 'array',
  of: [defineArrayMember({type: 'block'}), defineArrayMember({type: 'imageWithAlt'})],
})
