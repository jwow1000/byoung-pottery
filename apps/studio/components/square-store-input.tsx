import {Badge, Card, Flex, Stack, Text} from '@sanity/ui'
import type {ObjectInputProps} from 'sanity'

type SquareStore = {
  itemId?: string
  name?: string
  price?: number
  currency?: string
  available?: number
  status?: 'active' | 'archived' | 'deleted'
  lastSyncedAt?: string
}

const dashboardHost =
  process.env.SANITY_STUDIO_SQUARE_ENVIRONMENT === 'production'
    ? 'https://app.squareup.com'
    : 'https://app.squareupsandbox.com'

export function SquareStoreInput({value}: ObjectInputProps<SquareStore>) {
  if (!value?.itemId) {
    return (
      <Card padding={4} radius={2} tone="neutral" border>
        <Text size={1} muted>
          Not linked to Square, so this piece is shown as portfolio work and isn&apos;t for sale. To sell
          it, create the item in Square Dashboard. It will appear here as a new draft on the next sync.
        </Text>
      </Card>
    )
  }

  const price =
    value.price != null
      ? new Intl.NumberFormat('en-US', {style: 'currency', currency: value.currency ?? 'USD'}).format(
          value.price / 100,
        )
      : '—'
  const stock =
    value.status !== 'active'
      ? {tone: 'critical' as const, label: value.status === 'archived' ? 'Archived in Square' : 'Deleted from Square'}
      : value.available == null
        ? {tone: 'primary' as const, label: 'Stock not tracked'}
        : value.available > 0
          ? {tone: 'positive' as const, label: `${value.available} in stock`}
          : {tone: 'caution' as const, label: 'Sold out'}

  return (
    <Card padding={4} radius={2} border>
      <Stack gap={4}>
        <Flex align="center" justify="space-between" gap={3}>
          <Text size={3} weight="semibold">{price}</Text>
          <Badge tone={stock.tone}>{stock.label}</Badge>
        </Flex>
        <Stack gap={3}>
          <Text size={1} muted>
            Price and stock are managed in Square and synced automatically.{' '}
            <a href={`${dashboardHost}/dashboard/items/library/${value.itemId}`} target="_blank" rel="noreferrer">
              Edit in Square ↗
            </a>
          </Text>
          <Text size={0} muted>
            {value.name && <>Square name: {value.name} · </>}
            {value.lastSyncedAt && <>Last synced {new Date(value.lastSyncedAt).toLocaleString()}</>}
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}
