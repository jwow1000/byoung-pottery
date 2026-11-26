import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

// A ceramic piece. Editorial content lives here; price, stock and checkout
// live in Square and are synced into `store` (see objects/square-store.ts).
// Pieces without a Square link are shown as portfolio work.
export const product = defineType({
  name: 'product',
  title: 'Ceramic Piece',
  type: 'document',
  icon: TagIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'details', title: 'Ceramic Details'},
    {name: 'store', title: 'Square'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      options: {layout: 'grid'},
      validation: (rule) => rule.min(1).error('Add at least one photo'),
    }),
    defineField({name: 'description', type: 'richText', group: 'content'}),
    defineField({
      name: 'form',
      type: 'string',
      group: 'content',
      description: 'What kind of piece this is. Used for filtering in the shop.',
      options: {
        list: [
          {title: 'Mug / Cup', value: 'mug'},
          {title: 'Bowl', value: 'bowl'},
          {title: 'Plate', value: 'plate'},
          {title: 'Vase', value: 'vase'},
          {title: 'Planter', value: 'planter'},
          {title: 'Serving ware', value: 'serving'},
          {title: 'Sculpture', value: 'sculpture'},
          {title: 'Set', value: 'set'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({name: 'collection', type: 'reference', group: 'content', to: [{type: 'collection'}]}),
    defineField({name: 'clayBody', type: 'string', group: 'details', description: 'e.g. Speckled stoneware, porcelain'}),
    defineField({name: 'glaze', type: 'string', group: 'details'}),
    defineField({
      name: 'technique',
      type: 'string',
      group: 'details',
      options: {
        list: [
          {title: 'Wheel thrown', value: 'thrown'},
          {title: 'Hand built', value: 'handbuilt'},
          {title: 'Slip cast', value: 'slipcast'},
          {title: 'Thrown & altered', value: 'altered'},
        ],
      },
    }),
    defineField({
      name: 'firing',
      type: 'string',
      group: 'details',
      options: {
        list: [
          {title: 'Cone 6 oxidation', value: 'cone6-ox'},
          {title: 'Cone 10 reduction', value: 'cone10-red'},
          {title: 'Wood fired', value: 'wood'},
          {title: 'Soda fired', value: 'soda'},
          {title: 'Raku', value: 'raku'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'dimensions',
      type: 'object',
      group: 'details',
      options: {columns: 3},
      fields: [
        defineField({name: 'height', type: 'number', description: 'inches'}),
        defineField({name: 'width', type: 'number', description: 'inches'}),
        defineField({name: 'capacity', type: 'string', description: 'e.g. 12 oz'}),
      ],
    }),
    defineField({
      name: 'care',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Dishwasher safe', value: 'dishwasher'},
          {title: 'Microwave safe', value: 'microwave'},
          {title: 'Food safe', value: 'food'},
          {title: 'Decorative only', value: 'decorative'},
        ],
      },
    }),
    defineField({name: 'store', type: 'squareStore', group: 'store'}),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      itemId: 'store.itemId',
      price: 'store.price',
      currency: 'store.currency',
      available: 'store.available',
      status: 'store.status',
    },
    prepare: ({title, media, itemId, price, currency, available, status}) => {
      let subtitle = 'Portfolio · not for sale'
      if (itemId) {
        const amount =
          price != null
            ? new Intl.NumberFormat('en-US', {style: 'currency', currency: currency ?? 'USD'}).format(price / 100)
            : 'No price'
        subtitle =
          status !== 'active' ? `${amount} · ${status} in Square` : available === 0 ? `${amount} · Sold out` : amount
      }
      return {title, media, subtitle}
    },
  },
})
