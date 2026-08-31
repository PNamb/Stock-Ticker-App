import { fmpFetch } from "../client"
import { withCache } from "../cache"
import { toIndexItem } from "../transformers/formatChange"

const TRACKED_INDEXES = ["^GSPC", "^IXIC", "^RUT", "^DJI"] //S&P 500, Nasdaq composite, Russell 2000, Dow Jones

export async function getIndexes({force = false} = {}) {
    return withCache("indexes", async () => {
        const raw = await Promise.all(
            TRACKED_INDEXES.map((index) => fmpFetch("/quote", {symbol: index}))
        )
        const flattened = raw.flat()
        return flattened.map(toIndexItem)
    }, {force})
}