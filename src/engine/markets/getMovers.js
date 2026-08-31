import {fmpFetch} from "../client"
import { withCache } from "../cache"
import { toMoverItem } from "../transformers/formatChange"

export async function getMovers({force = false} = {}) {
    return withCache("movers", async () => {
        const [gainersRaw, losersRaw] = await Promise.all([
            fmpFetch("/biggest-gainers"),
            fmpFetch("/biggest-losers")
        ])
        return {
            gainers: gainersRaw.map(toMoverItem),
            losers: losersRaw.map(toMoverItem)
        }
    }, {force})
}