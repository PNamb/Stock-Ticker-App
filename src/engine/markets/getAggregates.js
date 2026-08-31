import {twelveDataFetch} from "../client"
import {withCache} from "../cache"
import {toTwelveDataChart} from "../transformers/formatChange"

function toInterval(multiplier, timespan) {
    if (timespan === "day") return "1day"
    if (timespan === "minute") return `${multiplier}min`
    if (timespan === "hour") return `${multiplier}h`
    return `${multiplier}${timespan}`
}

export async function getAggregates(ticker, {multiplier = 1, timespan = "minute", from, to, force = false} = {}) {
    const interval = toInterval(multiplier, timespan)
    const key = `aggs:${ticker}:${interval}:${from}:${to}`

    return withCache(key, async () => {
        const raw = await twelveDataFetch("/time_series", {
            symbol: ticker,
            interval,
            date: "today",
            order: "asc"
        })
        const results = raw.values ?? []
        return results.map(toTwelveDataChart)
    }, {force})
}