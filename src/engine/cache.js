const store = new Map() //key to value
const inFlight = new Map() //unfulfilled keys; key to promise

export async function withCache(key, fetcher, {force = false} = {}) {
    if (!force && store.has(key)) {
        return store.get(key)
    }

    if (inFlight.has(key)) {
        return inFlight.get(key)
    }

    const promise = fetcher()
        .then((value) => {
            store.set(key, value)
            inFlight.delete(key)
            return value
        })
        .catch((e) => {
            inFlight.delete(key)
            throw e
        })
    
    inFlight.set(key, promise)
    return promise
}

export function has(key) {
    return store.has(key)
}

export function peek(key) {
    return store.get(key)
}

export function invalidate(key) {
    store.delete(key)
}

export function clearCache() {
    store.clear()
    inFlight.clear()
}