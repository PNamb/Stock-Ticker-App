import {Colors} from "../constants/theme"
import {LineChart} from "react-native-wagmi-charts"
import { Dimensions} from "react-native"

const {width} = Dimensions.get("window")

export default function StockLineChart({data, height = width / 1.1}) {
    console.log(data)
    const isUp = data.length > 1 && data.at(-1).value >= data.at(0).value
    return (
        <LineChart.Provider data={data}>
            <LineChart width={width / 1.088} height={height}>
                <LineChart.Path color={isUp ? Colors.theme.up : Colors.theme.down} width={3}>
                    <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.CursorCrosshair color = {Colors.theme.light}>
                    <LineChart.Tooltip textStyle = {{color: Colors.theme.light}} />
                </LineChart.CursorCrosshair>
            </LineChart>
        </LineChart.Provider>
    )
}