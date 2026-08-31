import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { StyleSheet, View, Text, ScrollView, Pressable, Dimensions, FlatList, RefreshControl } from "react-native";
import Art, { flameArt, trendingDownArt, trendingUpArt } from "@/assets/svgArt";
import MiniLineChart from "@/components/MiniLineChart"
import { useAppSettings } from "@/contexts/AppContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {useMarketData} from "@/hooks/useMarketData"
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

const {width} = Dimensions.get("window")

const MOVER_ROW_HEIGHT = 35
const ACTIVE_ROW_HEIGHT = 60

//time logic is temporary; will add to engine files later
const time = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    hour12: false
})

const hour = parseInt(time, 10)

const SECTIONS = {
    indexes: {Component: IndexesSection, settingsKey: "showIndices"},
    movers: {Component: MoversSection, settingsKey: "showMovers"},
    mostActive: {Component: MostActiveSection, settingsKey: "showMostActive"}
}

function ChangeText({changePercentage, changeAbsolute}) {
    const {settings} = useAppSettings()
    const isAbsolute = settings.format === "Absolute"
    const value = isAbsolute ? changeAbsolute : changePercentage
    const isUp = value >= 0
    return (
        <Text style = {{color: isUp ? Colors.theme.up : Colors.theme.down}}>
            {isUp ? "+" : ""}{value.toFixed(2)}{isAbsolute ? "" : "%"}
        </Text>
    )
}

function IndexCard({item, onPress = null}) {
    return (
        <Pressable style = {styles.indexCard} onPress = {onPress}>
            <Text style = {styles.indexSymbol}>{item.symbol}</Text>
            <Text style = {styles.indexValue}>{item.value}</Text>
            <ChangeText changePercentage = {item.changePercentage} changeAbsolute = {item.changeAbsolute} />
            < MiniLineChart isUp={item.changePercentage >= 0}/>
        </Pressable>
    )
}

function MoverRow({item}) {
    return (
        <View style = {styles.moverRow}>
            <Text style = {styles.moverSymbol}>{item.symbol}</Text>
            <ChangeText changePercentage = {item.changePercentage} changeAbsolute = {item.changeAbsolute} />
        </View>
    )
}

function MostActiveRow({item, onPress = null}) {
    return (
        <Pressable style = {styles.activeRow} onPress={onPress}>
            <View>
                <Text style = {styles.moverSymbol}>{item.symbol}</Text>
                <Text style = {styles.volumeText}>Vol {item.volume}</Text>
            </View>

            <MiniLineChart isUp={item.changePercentage >= 0}/>
            <ChangeText changePercentage = {item.changePercentage} changeAbsolute = {item.changeAbsolute} />
        </Pressable>
    )
}

//wire into FMP rather than Massive; Massive doesn't let you access charting data with 
export function IndexesSection({data = INDEXES, scrollEnabled = true}) {
    const router = useRouter()
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {styles.indexStrip} scrollEnabled = {scrollEnabled}>
            {data.map((item) => (
                <IndexCard key = {item.symbol} item={item} onPress={scrollEnabled ? () => router.push(`/chart/${item.symbol}`) : null}/>
            ))}
        </ScrollView>
    )
}

export function MoversSection({gainers = GAINERS, losers = LOSERS, scrollEnabled = true}) {
    const {settings} = useAppSettings()
    const isStacked = settings.layout !== "Side by side"
    const limit = Number(settings.rowsPerList ?? 3)
    const listHeight = limit * MOVER_ROW_HEIGHT
    return (
        <View style = {[styles.moversContainer, {flexDirection: isStacked ? "column" : "row"}]}>
            <View style = {[styles.moversCard, isStacked && styles.moversCardStacked, {marginRight: isStacked ? 0 : Spacing.sm, marginBottom: isStacked ? Spacing.sm : 0}]}>
                <View style = {{flexDirection: "row"}}>
                    <Art art = {trendingUpArt} box = {"0 0 24 24"} size = {24} color = {Colors.theme.up} isStroke = {true} />
                    <View style = {{width: Spacing.xl}} />
                    <Text style = {styles.sectionLabel}>Top gainers</Text>
                </View>

                <ScrollView style = {{height: listHeight}} nestedScrollEnabled showsVerticalScrollIndicator = {false} scrollEnabled = {scrollEnabled}>
                    {gainers.map((item) => (
                        <MoverRow key = {item.symbol} item={item} />
                    ))}
                </ScrollView>
            </View>

            <View style = {[styles.moversCard, isStacked && styles.moversCardStacked, {marginLeft: isStacked ? 0 : Spacing.sm}]}>
                <View style = {{flexDirection: "row"}}>
                    <Art art = {trendingDownArt} box = {"0 0 24 24"} size = {24} color = {Colors.theme.down} isStroke = {true} />
                    <View style = {{width: Spacing.xl}} />
                    <Text style = {styles.sectionLabel}>Top losers</Text>
                </View>

                <ScrollView style = {{height: listHeight}} nestedScrollEnabled showsVerticalScrollIndicator = {false} scrollEnabled = {scrollEnabled}>
                    {losers.map((item) => (
                        <MoverRow key = {item.symbol} item={item} />
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export function MostActiveSection({data = MOST_ACTIVE, scrollEnabled = true}) {
    const {settings} = useAppSettings()
    const router = useRouter()
    const limit = Number(settings.rowsPerList ?? 3)
    const listHeight = limit * ACTIVE_ROW_HEIGHT

    const [renderCount, setRenderCount] = useState(limit)

    useEffect(() => {
        if (renderCount < data.length) {
            const timer = setTimeout(() => setRenderCount(data.length), 500);
            return () => clearTimeout(timer);
        }
    }, [])

    return (
        <View>
            <View style = {{flexDirection: "row"}}>
                <Art art = {flameArt} box = {"0 0 24 24"} size = {24} color = {Colors.icons.mostActiveFlame} isStroke = {true} />
                <View style = {styles.spacer} />
                <Text style = {styles.sectionLabel}>Most Active</Text>
            </View>

            <View style = {styles.activeCard}>
                <ScrollView style = {{height: listHeight}} nestedScrollEnabled showsVerticalScrollIndicator = {false} scrollEnabled = {scrollEnabled}>
                    {data.map((item) => (
                        <MostActiveRow key={item.symbol} item={item} onPress={scrollEnabled ? () => router.push(`/chart/${item.symbol}`) : null}/>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default function HomeScreen() {
    const {settings} = useAppSettings()
    const insets = useSafeAreaInsets()
    const {indexes, gainers, losers, mostActive, isLoading, error, refresh} = useMarketData()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const order = settings.sectionOrder ?? ["indexes", "movers", "mostActive"]
    const isOpen = hour > 10 && hour < 16

    const onRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refresh()
        } finally {
            setIsRefreshing(false)
        }
    }

    const visibileSections = order.filter((id) => {
        const section = SECTIONS[id]
        if (!section) return false
        if (section.settingsKey && !settings[section.settingsKey]) return false
        return true
    })

    const renderSection = ({item: id}) => {
        const {Component} = SECTIONS[id]
        if (id === "movers") return <Component gainers={gainers} losers={losers} />
        if (id === "mostActive") return <Component data={mostActive} />
        if (id === "indexes") return <Component data={indexes} />
        return <Component />
    }

    return (
        <FlatList 
            style = {styles.container} 
            contentContainerStyle = {{paddingBottom: 80 + insets.bottom, paddingHorizontal: Spacing.xxl, gap: Spacing.super}}
            data={visibileSections}
            keyExtractor={(id) => id}
            renderItem={renderSection}
            ListHeaderComponent={
                <>
                    <View style = {styles.header}>
                        <Text style = {styles.headerTitle}>Markets</Text>
                        <View style = {styles.statusPill}>
                            <View style = {[styles.statusDot, {backgroundColor: isOpen ? Colors.theme.up : Colors.theme.pressed}]} />
                            <Text style = {styles.statusText}>Open</Text>
                        </View>
                    </View>
                    {error && (
                        <View>
                            <Text>Couldn't load market data</Text>
                            {console.log("[HOMESCREEN] MARKET ERROR", indexes)}
                        </View>
                    )}
                </>
            }
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
        />
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.dark
    },
    spacer: {
        width: Spacing.sm
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
    statusPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.xs,
        backgroundColor: Colors.background.widget,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xxs,
        borderRadius: Radius.super
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        color: "#c7bfbf",
        fontSize: Typography.size.sm
    },
    indexStrip: {
        gap: Spacing.md
    },
    indexCard: {
        backgroundColor: Colors.background.widget,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        minWidth: 120,
        // maxWidth: 250
    },
    indexSymbol: {
        color: Colors.theme.light,
        fontSize: Typography.size.md,
        marginBottom: Spacing.xxs
    },
    indexValue: {
        color: Colors.symbol.volume,
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.normal,
        marginBottom: 2
    },
    moversContainer: {
        justifyContent: "space-between",
    },
    moversCard: {
        flex: 1,
        maxWidth: width / 2.25,
        backgroundColor: Colors.background.widget,
        borderRadius: Radius.lg,
        padding: Spacing.lg
    },
    moversCardStacked: {
        alignSelf: "center"
    },
    sectionLabel: {
        color: Colors.theme.light,
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.normal,
        marginBottom: Spacing.md
    },
    moverRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.xxl,
        borderTopWidth: 0.5,
        borderTopColor: Colors.symbol.borderTop,
        maxWidth: 180
    }, 
    moverSymbol: {
        color: Colors.theme.light,
        fontSize: Typography.size.md
    },
    activeCard: {
        backgroundColor: Colors.background.widget,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.lg,
    },
    activeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 9,
        borderTopWidth: 0.5,
        borderTopColor: Colors.symbol.borderTop
    },
    volumeText: {
        color: Colors.symbol.volume,
        fontSize: Typography.size.sm,
        marginTop: 1
    }
})