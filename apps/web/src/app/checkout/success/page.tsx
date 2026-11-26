import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-20 text-center">
      <h1 className="font-serif text-4xl">Thank you!</h1>
      <p className="text-muted">Your order is in. You&apos;ll get a receipt from Square by email shortly.</p>
      <Link href="/shop" className="inline-block underline underline-offset-4">Back to the shop</Link>
    </div>
  )
}
