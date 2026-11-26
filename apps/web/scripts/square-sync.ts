// One-off sync from Square into Sanity: `pnpm square:sync`
import {syncSquareCatalog} from '../src/lib/square/sync'

async function main() {
  const result = await syncSquareCatalog()
  console.log(`Updated ${result.updated} piece(s); marked ${result.removed} as deleted in Square.`)
  if (result.created.length) {
    console.log(`Created ${result.created.length} new draft(s) — add photos in the Studio, then publish:`)
    for (const title of result.created) console.log(`  • ${title}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
