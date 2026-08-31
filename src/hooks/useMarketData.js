import { useCallback, useEffect, useRef, useState } from "react";
import { getIndexes } from "../engine/markets/getIndexes";
import { getMovers } from "../engine/markets/getMovers";
import { getMostActive } from "../engine/markets/getMostActive"
import { has as cacheHas, peek as cachePeek } from "@/engine/cache";

const CACHE_KEYS = [
    "indexes",
    "movers",
    "mostActive"
]

function allCached() {
    return CACHE_KEYS.every((key) => cacheHas(key))
}

function initialData() {
    const cachedMovers = cacheHas("movers") ? cachePeek("movers") : null
    return {
        indexes: cacheHas("indexes") ? cachePeek("indexes") : [],
        gainers: cachedMovers ? cachedMovers.gainers : [],
        losers: cachedMovers ? cachedMovers.losers : [],
        mostActive: cacheHas("mostActive") ? cachePeek("mostActive") : []
    }
}

export function useMarketData() {
    
    const [data, setData] = useState(initialData)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const load = useCallback(async ({force = false} = {}) => {
        if (force || !allCached()) {
            setIsLoading(true)    
        }
        setError(null)

        try {
            const [indexes, movers, mostActive] = await Promise.all([
                getIndexes({force}),
                getMovers({force}),
                getMostActive({force})
            ])

            if (!isMounted.current) return

            setData({
                indexes,
                gainers: movers.gainers,
                losers: movers.losers,
                mostActive
            })
        } catch (e) {
            if (!isMounted.current) return
            console.log("[USEMARKETDATA] MARKET DATA ERROR:", e.message, e.status)
            setError(e)
        } finally {
            if (isMounted.current) setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const refresh = useCallback(() => load({force: true}), [load])

    return {
        ...data,
        isLoading,
        error,
        refresh
    }
}