import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const exhibition = defineType({
  name: 'exhibition',
  title: 'Exhibition / Market',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'venue', type: 'string'}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'startDate', type: 'date', validation: (rule) => rule.required()}),
    defineField({
      name: 'endDate',
      type: 'date',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const start = context.document?.startDate as string | undefined
          return !start || !endDate || endDate >= start || 'End date must be after start date'
        }),
    }),
    defineField({name: 'url', title: 'Event URL', type: 'url'}),
    defineField({name: 'image', type: 'imageWithAlt'}),
  ],
  orderings: [{title: 'Date', name: 'startDateDesc', by: [{field: 'startDate', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'startDate', media: 'image'},
  },
})
