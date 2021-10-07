type IdentityFunctions<T> = {
  [k in keyof T]: T[k] extends (...args: infer P) => any
    ? (...args: P) => IdentityFunctions<T>
    : T[k]
}

export function identity<T>(this: T, callback: () => void): T {
  callback()
  return this
}

export function identify<T, P extends any[]>(
  callback: (...args: P) => void
): (...args: P) => T {
  return function (this: T, ...args: P) {
    callback(...args)
    return this
  }
}

export function identifyFunctions<T extends object>(
  container: T
): IdentityFunctions<T> {
  const newContainer = {} as IdentityFunctions<T>
  const keys = Reflect.ownKeys(container) as (keyof T)[]

  for (let key of keys) {
    const attr = container[key]

    if (typeof attr !== "function") {
      newContainer[key] = container[key] as any
    } else {
      newContainer[key] = identify<T, any[]>(container[key] as any) as any
    }
  }

  return newContainer
}
