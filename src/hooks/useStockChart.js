import { useCallback, useEffect, useRef, useState } from "react"
import {getAggregates} from "../engine/markets/getAggregates"

export function useStockChart(ticker, {multiplier = 1, timespan = "minute", from, to} = {}) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const isMounted = useRef(true)

    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const load = useCallback(async ({force = false} = {}) => {
        if (!ticker || !from || !to) return
        setIsLoading(true)
        setError(null)
        
        try {
            const result = await getAggregates(ticker, {multiplier, timespan, from, to})
            if (!isMounted.current) return
            setData(result)
            console.log(`set data: ${result}`)
        } catch (e) {
            if (!isMounted.current) return
            console.log("[USESTOCKCHART] CHART DATA ERROR:", e.message, e.status)
            setError(e)
        } finally {
            if (isMounted.current) setIsLoading(false)
        }
    }, [ticker, multiplier, timespan, from, to])

    useEffect(() => {
        load()
    }, [load])

    const refresh = useCallback(() => load({force: true}), [load])

    return {data, isLoading, error, refresh}
}