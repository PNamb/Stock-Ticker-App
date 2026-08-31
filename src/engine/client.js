import { FMP_API_KEY, FMP_URL, MASSIVE_API_KEY, MASSIVE_URL, TWELVE_DATA_API_KEY, TWELVE_DATA_URL } from "./config";

export class APIError extends Error {
    constructor(message, status) {
        super(message)
        this.name = "APIError"
        this.status = status
    }
}

export async function fmpFetch(path, params = {}) {
    if (!FMP_API_KEY) throw new APIError("No API key detected", 0)
    if (!FMP_URL) throw new APIError("No API URL detected", 0)
    
    const query = new URLSearchParams({...params, apikey: FMP_API_KEY})
    const url = `${FMP_URL}${path}?${query.toString()}`

    let response
    try {
        response = await fetch(url)
    } catch (e) {
        throw new APIError(`Network error calling ${path}: ${e.message}`, 0)
    }

    if (!response.ok) {
        throw new APIError(`FMP request failed: ${path} (${response.status})`, response.status)
    }

    const data = await response.json()

    if (data && data["Error Message"]) {
        throw new APIError(data["Error Message"], 200)
    }

    return data
}

export async function massiveFetch(path, params = {}) {
    if (!MASSIVE_API_KEY) throw new APIError("No API key detected", 0)
    if (!MASSIVE_URL) throw new APIError("No API URL detected", 0)
    
    const query = new URLSearchParams({...params, apiKey: MASSIVE_API_KEY})
    const url = `${MASSIVE_URL}${path}?${query.toString()}`
    let response

    try {
        response = await fetch(url)
    } catch (e) {
        throw new APIError(`Network error calling ${path}: ${e.message}`, 0)
    }
    if (!response.ok) {
        throw new APIError(`MASSIVE request failed: ${url} | ${path} (${response.status})`, response.status)
    }

    const data = await response.json()
    if (data.status && data.status !== "OK" && data.status !== "DELAYED") {
        throw new APIError(data.error ?? `Massive error: ${data.status}`, 200)
    }
    return data
}

export async function twelveDataFetch(path, params = {}) {
    if (!TWELVE_DATA_API_KEY) throw new APIError("No API key detected", 0)
    if (!TWELVE_DATA_URL) throw new APIError("No API URL detected", 0)

    const query = new URLSearchParams({...params, apikey: TWELVE_DATA_API_KEY})
    const url = `${TWELVE_DATA_URL}${path}?${query.toString()}`

    let response
    console.log(`[CLIENT-TEST] ${url}`)

    try {
        response = await fetch(url)
    } catch (e) {
        throw new APIError(`Network error calling ${path}: ${e.message}`, 0)
    }
    if (!response.ok) {
        throw new APIError(`Twelve Data request failed: ${url} | ${path} (${response.status})`, response.status)
    }

    const data = await response.json()
    if (data.status === "error") {
        throw new APIError(data.message ?? `Twelve Data error: ${data.code}`, data.code ?? 200)
    }
    return data
}