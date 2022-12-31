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
