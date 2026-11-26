import {aboutPage} from './documents/about-page'
import {collection} from './documents/collection'
import {exhibition} from './documents/exhibition'
import {product} from './documents/product'
import {siteSettings} from './documents/site-settings'
import {imageWithAlt} from './objects/image-with-alt'
import {richText} from './objects/rich-text'
import {seo} from './objects/seo'
import {squareStore} from './objects/square-store'

export const schemaTypes = [
  siteSettings,
  aboutPage,
  product,
  collection,
  exhibition,
  imageWithAlt,
  richText,
  seo,
  squareStore,
]
