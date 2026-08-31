export const FMP_API_KEY = process.env.EXPO_PUBLIC_FMP_API_KEY
export const MASSIVE_API_KEY = process.env.EXPO_PUBLIC_MASSIVE_API_KEY
export const TWELVE_DATA_API_KEY = process.env.EXPO_PUBLIC_TWELVE_DATA_API_KEY

export const FMP_URL = "https://financialmodelingprep.com/stable"
export const MASSIVE_URL = "https://api.massive.com"
export const TWELVE_DATA_URL = "https://api.twelvedata.com"

//unused; only use if API call limit is increased; 60 second auto-refresh
export const DEFAULT_CACHE_TTL_MS = 60 * 1000

export const UNIVERSE_TO_INDEX_SYMBOl = {
    "S&P 500" : "%5EGSPC",
    "Nasdaq 100": "%5ENDX",
    "NYSE comp": "%5ENYA",
    "Dow 30": "%5EDJI"
}