import {fmpFetch} from "../client"
import { withCache } from "../cache"
import { toMostActiveItem } from "../transformers/formatChange"

export async function getMostActive({force = false} = {}) {
    return withCache("mostActive", async () => {
        const raw = await fmpFetch("/most-actives")
        return raw.map(toMostActiveItem)
    }, {force})
}