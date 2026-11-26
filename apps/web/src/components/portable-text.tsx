import {PortableText as BasePortableText, type PortableTextComponents} from '@portabletext/react'
import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {ComponentProps} from 'react'

const components: PortableTextComponents = {
  types: {
    imageWithAlt: ({value}) => (
      <Image
        src={urlFor(value).width(1200).url()}
        alt={value.alt ?? ''}
        width={1200}
        height={800}
        className="my-6 h-auto w-full"
      />
    ),
  },
}

export function PortableText({value}: Pick<ComponentProps<typeof BasePortableText>, 'value'>) {
  return (
    <div className="space-y-4 leading-relaxed">
      <BasePortableText value={value} components={components} />
    </div>
  )
}
