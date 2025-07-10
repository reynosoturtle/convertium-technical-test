export function deepMerge<T>(target: T, source: Partial<T>): T {
  if (typeof target !== 'object' || target === null) return source as T;
  if (typeof source !== 'object' || source === null) return target;

  const result: any = Array.isArray(target) ? [...target] : { ...target };

  for (const key in source) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal, srcVal);
    } else {
      result[key] = srcVal;
    }
  }

  return result;
}
