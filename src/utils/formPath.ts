export function getAtPath(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => (o == null ? undefined : o[key]), obj)
}

export function setAtPath(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const last = keys.pop()!
  let cur = obj
  for (const key of keys) {
    if (cur[key] == null || typeof cur[key] !== 'object') {
      cur[key] = {}
    }
    cur = cur[key]
  }
  cur[last] = value
}
