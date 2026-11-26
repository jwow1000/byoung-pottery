import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site Settings').id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem().title('About Page').id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.divider(),
      S.listItem()
        .title('Ceramic Pieces')
        .schemaType('product')
        .child(
          S.list()
            .title('Ceramic Pieces')
            .items([
              S.documentTypeListItem('product').title('All pieces'),
              S.listItem().title('Needs photos').child(
                S.documentList().title('Needs photos').schemaType('product')
                  .filter('_type == "product" && (!defined(images) || count(images) == 0)'),
              ),
              S.listItem().title('For sale').child(
                S.documentList().title('For sale').schemaType('product')
                  .filter('_type == "product" && store.status == "active" && coalesce(store.available, 1) > 0'),
              ),
              S.listItem().title('Sold out').child(
                S.documentList().title('Sold out').schemaType('product')
                  .filter('_type == "product" && store.status == "active" && store.available == 0'),
              ),
              S.listItem().title('Portfolio (not in Square)').child(
                S.documentList().title('Portfolio').schemaType('product')
                  .filter('_type == "product" && !defined(store.itemId)'),
              ),
            ]),
        ),
      S.documentTypeListItem('collection').title('Collections'),
      S.documentTypeListItem('exhibition').title('Exhibitions & Markets'),
    ])
