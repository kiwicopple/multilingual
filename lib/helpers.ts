import { serialize } from "next-mdx-remote/serialize"

// Convert an array of objects to a Set of objects by a key
export function arrayToMapByKey<T extends { [key: string]: any }>(
  array: T[],
  key: string
): Map<string, T> {
  const map: Map<string, T> = new Map()
  array.forEach((item) => {
    map.set(item[key], item)
  })
  return map
}

export function serializeMarkdown(markdown: string) {
  return serialize(markdown, {
    mdxOptions: {
      development: false, // Causing errors, even in development
    },
  })
}
