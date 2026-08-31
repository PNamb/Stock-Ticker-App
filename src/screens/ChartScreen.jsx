import { Colors, Typography, Spacing, Radius } from "../constants/theme";
import { StyleSheet, View, Text, ScrollView, RefreshControl, Pressable } from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useAppSettings} from "../contexts/AppContext"
import { useStockChart } from "../hooks/useStockChart";
import StockLineChart from "../components/StockLineChart";
import { useState } from "react";

function getTodayRange() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const today = `${year}-${month}-${day}`
    return { from: today, to: today }
}

export default function ChartScreen({ticker}) {
    const {settings} = useAppSettings()
    const insets = useSafeAreaInsets()
    const {from, to} = getTodayRange()
    const {data, isLoading, error, refresh} = useStockChart(ticker, {from, to})
    const [isRefreshing, setIsRefreshing] = useState(false)

    const onRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refresh()
        } finally {
            setIsRefreshing(false)
        }
    }

    const firstOpen = data[0]?.open ?? 0
    const lastClose = data.at(-1)?.close ?? 0
    const totalVolume = data.reduce((acc, val) => acc + Number(val.volume), 0) ?? 0
    const avgVolume = totalVolume / data.length ?? 0

    return (
        <ScrollView
            style = {styles.container}
            contentContainerStyle = {{paddingBottom: 80 + insets.bottom, paddingHorizontal: Spacing.xxl, gap: Spacing.super}}
            refreshControl={
                settings.refreshToUpdate ? (
                    <RefreshControl
                    refreshing = {isRefreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.theme.dark}
                    colors={[Colors.theme.up, Colors.theme.down]}
                    progressBackgroundColor={Colors.theme.dark}
                    />
                ) : undefined
            }
        >
            <View style = {styles.header}>
                <Text style = {styles.headerTitle}>{ticker}</Text>
            </View>

            {error ? (
                <View>
                    <Text>Couldn't load chart data</Text>
                    {console.log("[CHART SCREEN] CHART ERROR")}
                </View>
            ) : (
                <View style = {styles.chartContainer}>
                    <StockLineChart data={data} />
                    <View style = {{flexDirection: "row", justifyContent: "space-between"}}>
                        <Pressable style = {{width: 40, height: 40, backgroundColor: Colors.theme.down}}/>
                        <Pressable style = {{width: 40, height: 40, backgroundColor: Colors.theme.up}}/>
                        <Pressable style = {{width: 40, height: 40, backgroundColor: Colors.theme.light}}/>
                    </View>
                </View>
            )}

            <View style = {styles.chartInfoContainer}>
                <View style = {{flexDirection: "column"}}>
                <Text style = {{fontSize: Typography.size.lg, color: "#fff"}}>OPEN: {firstOpen} CLOSE: {lastClose}</Text>
                <Text style = {{fontSize: Typography.size.lg, color: "#fff"}}>VOLUME: {Math.round(totalVolume)} AVGVOLUME: {avgVolume.toFixed(2)}</Text>
                </View>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.dark
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.sm
    },
    headerTitle: {
        color: Colors.theme.light,
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.normal
    },
    chartContainer: {
        backgroundColor: Colors.background.widget,
        borderRadius: Radius.lg,
        borderWidth: 0.5,
        borderColor: Colors.theme.light
    },
    chartFooter: {
        flexDirection: "row", 
        justifyContent: "space-between"
    },
    chartFooterComponent: {

    },
    chartInfoContainer: {
        backgroundColor: Colors.background.widget,
        borderRadius: Radius.sm,
        borderWidth: 0.5,
        borderColor: Colors.theme.light,
    }
})