import React from "react";
import { useLocalSearchParams } from "expo-router";
import ChartScreen from "@/screens/ChartScreen"

export default function chart() {
    const {symbol} = useLocalSearchParams<{symbol: string}>()
    return <ChartScreen ticker = {symbol} />
}