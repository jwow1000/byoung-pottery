# B. Young Pottery

Monorepo for the website: a Next.js storefront, a Sanity Studio for content, and Square for commerce.

```
apps/
  web/     Next.js 16 (App Router, Cache Components, Tailwind)  → localhost:3000
  studio/  Sanity Studio v6                                     → localhost:3333
```

## How Square and Sanity connect

```
Square Dashboard ──webhook──▶ /api/square/webhook ──▶ Sanity "Ceramic Piece" docs ──▶ website
 (price, stock)               (or `pnpm square:sync`)   (photos, story, clay, glaze…)     │
        ▲                                                                                  │
        └──────────────── "Buy now" → Square-hosted checkout ◀─────────────────────────────┘
```

- **Square owns commerce:** price, stock, checkout, orders, receipts and shipping.
- **Sanity owns the story:** photos, description, form, clay body, glaze, technique, firing, dimensions, care, collections.
- **The sync** (`apps/web/src/lib/square/sync.ts`) copies every Square item into a read-only **Square** tab on its Sanity piece. It creates a *draft* piece when it finds a new Square item, and never touches the fields the artist edits.
- The site reads price and stock from Sanity, so pages stay fast. "Buy now" checks live stock with Square, then sends the buyer to a Square Payment Link (`apps/web/src/app/actions.ts`).
- Pieces with no Square item are portfolio work: they appear in the Studio but not in the shop.

## Setup

Requires Node ≥ 22.12 (`nvm use`) and pnpm.

```sh
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env
# fill in Sanity project ID and Square sandbox credentials
pnpm dev
```

Allow the site to talk to Sanity:

```sh
cd apps/studio && npx sanity cors add http://localhost:3000 --credentials
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs web + studio together (Turborepo) |
| `pnpm build` | Builds both apps |
| `pnpm --filter web square:sync` | Pulls the Square catalog into Sanity now |
| `pnpm typegen` | Regenerates `apps/web/src/sanity/types.ts` from schema + GROQ queries |
| `pnpm --filter studio deploy` | Deploys the Studio to `*.sanity.studio` |

## Selling a piece

1. In Square Dashboard → Items, create the item with its price. For one-of-a-kind work, turn on stock tracking and set the stock to 1.
2. Within seconds (webhook) or after `pnpm --filter web square:sync`, a draft appears in the Studio under **Ceramic Pieces → Needs photos**.
3. Add photos, a description and the ceramic details, then publish. It's now live in the shop.
4. When it sells, Square sets the stock to 0 and the site shows **Sold out** automatically.

## Square webhook (once per environment)

Square Developer Console → your app → Webhooks → Add subscription:
- URL: `https://<your-site>/api/square/webhook`. It must exactly match `SQUARE_WEBHOOK_URL`.
- Events: `catalog.version.updated` and `inventory.count.updated`
- Copy the signature key into `SQUARE_WEBHOOK_SIGNATURE_KEY`.

For local testing, use the manual sync script, or expose localhost with a tunnel such as ngrok.
