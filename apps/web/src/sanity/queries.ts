import {defineQuery} from 'next-sanity'

const PRODUCT_CARD = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  "image": images[0],
  "price": store.price,
  "currency": store.currency,
  "available": store.available
`

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  title,
  tagline,
  heroImage,
  shopAnnouncement,
  contactEmail,
  instagram,
  seo,
  "featuredProducts": featuredProducts[]->[defined(slug.current)]{${PRODUCT_CARD}}
}`)

export const PRODUCTS_QUERY = defineQuery(`*[_type == "product" && defined(slug.current) && store.status == "active"]
  | order(_createdAt desc){${PRODUCT_CARD}}`)

export const PRODUCT_SLUGS_QUERY = defineQuery(`*[_type == "product" && defined(slug.current)]{
  "slug": slug.current
}`)

export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  images,
  description,
  clayBody,
  glaze,
  firing,
  dimensions,
  care,
  form,
  technique,
  store{variationId, price, currency, available, status},
  seo,
  collection->{title, "slug": slug.current}
}`)

export const ABOUT_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  heading,
  portrait,
  bio,
  artistStatement,
  seo
}`)

export const UPCOMING_EXHIBITIONS_QUERY = defineQuery(`*[_type == "exhibition" && coalesce(endDate, startDate) >= string::split(now(), "T")[0]]
  | order(startDate asc){_id, title, venue, location, startDate, endDate, url}`)
