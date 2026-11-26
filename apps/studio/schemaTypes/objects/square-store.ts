import {defineField, defineType} from 'sanity'
import {SquareStoreInput} from '../../components/square-store-input'

// Written by the Square sync (apps/web/src/lib/square/sync.ts), never by hand.
// Edit price and stock in Square Dashboard; changes flow back here automatically.
export const squareStore = defineType({
  name: 'squareStore',
  title: 'Square',
  type: 'object',
  readOnly: true,
  components: {input: SquareStoreInput},
  fields: [
    defineField({name: 'itemId', title: 'Square Item ID', type: 'string'}),
    defineField({name: 'variationId', title: 'Square Variation ID', type: 'string'}),
    defineField({name: 'name', title: 'Name in Square', type: 'string'}),
    defineField({name: 'price', type: 'number', description: 'Smallest currency unit, e.g. cents'}),
    defineField({name: 'currency', type: 'string'}),
    defineField({
      name: 'available',
      type: 'number',
      description: 'Units in stock. Empty when Square is not tracking inventory for this item.',
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Archived in Square', value: 'archived'},
          {title: 'Deleted from Square', value: 'deleted'},
        ],
      },
    }),
    defineField({name: 'lastSyncedAt', type: 'datetime'}),
  ],
})
