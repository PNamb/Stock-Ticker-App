import { Colors } from "@/constants/theme";
import React from "react";
import {Dimensions} from "react-native"
import {LineChart} from "react-native-wagmi-charts"

const {width} = Dimensions.get("window")

const mockData = [
    {timestamp: 1625945400000, value: 33575.25},
    {timestamp: 1625946300000, value: 33545.25},
    {timestamp: 1625947200000, value: 33510.25},
    {timestamp: 1625948100000, value: 33215.25}
]

export default function StockLineChart({height = 60}) {
    return (
        <LineChart.Provider data = {mockData}>
            <LineChart width = {width/2} height = {height}>
                <LineChart.Path color = {Colors.theme.up} width = {3} />
            </LineChart>
        </LineChart.Provider>
    )
}