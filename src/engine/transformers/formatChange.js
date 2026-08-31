//change once we know what each FMP call returns

//using https://financialmodelingprep.com/stable/quote; returns one item
export function toIndexItem(raw) {
    return {
        symbol: raw.name,
        value: formatIndexValue(raw.price),
        changePercentage: raw.changePercentage ?? raw.changesPercentage,
        changeAbsolute: raw.change
    }
}

//using https://financialmodelingprep.com/stable/biggest-gainers (for gainers); returns 50 gainers
//and https://financialmodelingprep.com/stable/biggest-losers (for losers); returns 50 losers
export function toMoverItem(raw) {
    return {
        symbol: raw.symbol,
        changePercentage: raw.changesPercentage ?? raw.changePercentage,
        changeAbsolute: raw.change
    }
}

//using https://financialmodelingprep.com/stable/most-actives; returns 50 most active
export function toMostActiveItem(raw) {
    return {
        symbol: raw.symbol,
        volume: formatVolume(123456789),
        changePercentage: raw.changesPercentage ?? 0,
        changeAbsolute: raw.change
    }
}

export function toMassiveChart(raw) {
    return {
        timestamp: raw.t,
        value: raw.c,
        open: raw.o,
        close: raw.c,
        high: raw.h,
        low: raw.l,
        volume: raw.v,
    }
}

export function toTwelveDataChart(raw) {
    return {
        timestamp: new Date(raw.datetime).getTime(),
        value: Number(raw.close),
        open: Number(raw.open),
        close: Number(raw.close),
        high: Number(raw.high),
        low: Number(raw.low),
        volume: Number(raw.volume)
    }
}

//helper functions
const MARKET_OPEN_MIN = 9 * 60 + 30
const MARKET_CLOSE_MIN = 16 * 60

export function isRegularHours(timestamp) {
    const et = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
        hour12: false
    })

    const [h, m] = et.split(":").map(Number)
    const minutesSinceMidnight = h * 60 + m

    return minutesSinceMidnight >= MARKET_OPEN_MIN && minutesSinceMidnight < MARKET_CLOSE_MIN
}

function formatIndexValue(price) {
    if (price === null) return "--.--"
    return Number(price).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})
}

function formatVolume(volume) {
    if (volume === null) return "----"
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return String(volume)
}