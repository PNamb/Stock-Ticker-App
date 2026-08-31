import { Colors } from "@/constants/theme";
import Svg, {Polyline} from "react-native-svg"

function generateExponentialData(isUp, points = 12) {
    const steepness = 3

    return Array.from({length: points}, (_, i) => {
        const t = i / (points - 1)

        const raw = Math.exp(steepness * t)
        const value = isUp ? raw : -raw
        return {timestamp: i, value}
    })
}

export default function MiniLineChart({data, width = 180, height = 30, isUp}) {
    const chartData = data ?? generateExponentialData(isUp) 

    const values = chartData.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * width
        const y = height - ((d.value - min) / range) * height
        return `${x},${y}`
    }).join(" ")

    const strokeColor = isUp ? Colors.theme.up : Colors.theme.down

    return (
        <Svg width={width} height={height}>
            <Polyline
                points={points}
                fill="none"
                stroke={strokeColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}