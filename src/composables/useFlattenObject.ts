export function useFlattenObject() {
  function flattenObject(
    obj: Record<string, any>,
    prefix = ''
  ): Record<string, any> {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      const path = prefix ? `${prefix}.${key}` : key

      if (val && typeof val === 'object' && !Array.isArray(val)) {
        Object.assign(acc, flattenObject(val, path))
      } else {
        acc[path] = val
      }

      return acc
    }, {} as Record<string, any>)
  }

  return { flattenObject }
}
