import {ProductCard, type ProductCardData} from './product-card'

export function ProductGrid({products}: {products: ProductCardData[]}) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  )
}
