import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { StyleSheet, View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import Art, { flameArt, trendingDownArt, trendingUpArt } from "@/assets/svgArt";
import StockLineChart from "@/components/StockLineChart"
import { useAppSettings } from "@/contexts/AppContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const {width} = Dimensions.get("window")

//placeholder data
const INDEXES = [
    {symbol: "S&P 500", value: "6,412.30", change: 0.64},
    {symbol: "Nasdaq", value: "21,-408.90", change: -0.71},
    {symbol: "NYSE comp", value: "24,758.62", change: 0.30},
    {symbol: "Dow 300", value: "10,000", change: 100.2}
]

const GAINERS = [
    {symbol: "TEST1", change: 34.14},
    {symbol: "TEST2", change: 27.97},
    {symbol: "TEST3", change: 34.14},
    {symbol: "TEST4", change: 27.97},
    {symbol: "TEST5", change: 34.14},
    {symbol: "TEST6", change: 27.97},
    {symbol: "TEST7", change: 34.14},
    {symbol: "TEST8", change: 27.97},
    {symbol: "TEST9", change: 34.14},
    {symbol: "TEST10", change: 27.97},
    {symbol: "TEST11", change: 34.14},
    {symbol: "TEST12", change: 27.97},
]

const LOSERS = [
    {symbol: "TEST13", change: -34.14},
    {symbol: "TEST14", change: -27.97},
    {symbol: "TEST15", change: -34.14},
    {symbol: "TEST16", change: -27.97},
    {symbol: "TEST17", change: -34.14},
    {symbol: "TEST18", change: -27.97},
    {symbol: "TEST19", change: -34.14},
    {symbol: "TEST20", change: -27.97},
    {symbol: "TEST21", change: -34.14},
    {symbol: "TEST22", change: -27.97},
    {symbol: "TEST23", change: -34.14},
    {symbol: "TEST24", change: -27.97},
]

const MOST_ACTIVE = [
    { symbol: "AAPL", volume: "84.2M", change: 1.2 },
    { symbol: "TSLA", volume: "71.5M", change: -0.8 },
    { symbol: "SPY", volume: "65.9M", change: 0.6 },
    { symbol: "AsAPL", volume: "84.2M", change: 1.2 },
    { symbol: "TSsLA", volume: "71.5M", change: -0.8 },
    { symbol: "SsPY", volume: "65.9M", change: 0.6 }
]

const SECTIONS = {
    indexes: {Component: IndexesSection, settingsKey: "showIndices"},
    movers: {Component: MoversSection, settingsKey: "showMovers"},
    mostActive: {Component: MostActiveSection, settingsKey: "showMostActive"}
}

function ChangeText({value}) {
    const isUp = value >= 0
    return (
        <Text style = {{color: isUp ? Colors.theme.up : Colors.theme.down}}>
            {isUp ? "+" : ""}{value.toFixed(2)}%
        </Text>
    )
}

function IndexCard({item, onPress = null}) {
    return (
        <Pressable style = {styles.indexCard} onPress = {onPress}>
            <Text style = {styles.indexSymbol}>{item.symbol}</Text>
            <Text style = {styles.indexValue}>{item.value}</Text>
            <ChangeText value = {item.change} />
            < StockLineChart/>
        </Pressable>
    )
}

function MoverRow({item}) {
    return (
        <View style = {styles.moverRow}>
            <Text style = {styles.moverSymbol}>{item.symbol}</Text>
            <ChangeText value = {item.change} />
        </View>
    )
}

export function IndexesSection({data = INDEXES}) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {styles.indexStrip}>
            {data.map((item) => (
                <IndexCard key = {item.symbol} item={item}/>
            ))}
        </ScrollView>
    )
}

export function MoversSection({gainers = GAINERS, losers = LOSERS}) {
    const {settings} = useAppSettings()
    const isStacked = settings.layout !== "Side by side"
    const limit = Number(settings.rowsPerList ?? 3)
    return (
        <View style = {[styles.moversContainer, {flexDirection: isStacked ? "column" : "row"}]}>
            <View style = {[styles.moversCard, isStacked && styles.moversCardStacked, {marginRight: isStacked ? 0 : Spacing.sm, marginBottom: isStacked ? Spacing.sm : 0}]}>
                <View style = {{flexDirection: "row"}}>
                    <Art art = {trendingUpArt} box = {"0 0 24 24"} size = {24} color = {Colors.theme.up} isStroke = {true} />
                    <View style = {{width: Spacing.xl}} />
                    <Text style = {styles.sectionLabel}>Top gainers</Text>
                </View>

                {gainers.slice(0, limit).map((item) => (
                    <MoverRow key = {item.symbol} item = {item} />
                ))}
            </View>

            <View style = {[styles.moversCard, isStacked && styles.moversCardStacked, {marginLeft: isStacked ? 0 : Spacing.sm}]}>
                <View style = {{flexDirection: "row"}}>
                    <Art art = {trendingDownArt} box = {"0 0 24 24"} size = {24} color = {Colors.theme.down} isStroke = {true} />
                    <View style = {{width: Spacing.xl}} />
                    <Text style = {styles.sectionLabel}>Top losers</Text>
                </View>
                {losers.slice(0, limit).map((item) => (
                    <MoverRow key = {item.symbol} item = {item} />
                ))}
            </View>
        </View>
    )
}

export function MostActiveSection({data = MOST_ACTIVE}) {
    return (
        <View>
            <View style = {{flexDirection: "row"}}>
                <Art art = {flameArt} box = {"0 0 24 24"} size = {24} color = {Colors.icons.mostActiveFlame} isStroke = {true} />
                <View style = {styles.spacer} />
                <Text style = {styles.sectionLabel}>Most Active</Text>
            </View>
            
            <View style = {styles.activeCard}>
                {data.map((item) => (
                    <View key = {item.symbol} style = {styles.activeRow}>
                        <View>
                            <Text style = {styles.moverSymbol}>{item.symbol}</Text>
                            <Text style = {styles.volumeText}>Vol {item.volume}</Text>
                        </View>
                        <StockLineChart height = {30} />
                        <ChangeText value = {item.change} />
                    </View>
                ))}
            </View>
        </View>
    )
}


export default function HomeScreen() {
    const {settings} = useAppSettings()
    const insets = useSafeAreaInsets()
    const order = settings.sectionOrder ?? ["indexes", "movers", "mostActive"]
    return (
        <ScrollView style = {styles.container} contentContainerStyle = {{paddingBottom: 80 + insets.bottom, paddingHorizontal: Spacing.xxl, gap: Spacing.super}}>
            <View style = {styles.header}>
                <Text style = {styles.headerTitle}>Markets</Text>
                <View style = {styles.statusPill}>
                    <View style = {styles.statusDot} />
                    <Text style = {styles.statusText}>Open</Text>
                </View>
            </View>

            {order.map((id) => {
                const section = SECTIONS[id]
                if (!section) return null
                if (section.settingsKey && !settings[section.settingsKey]) return null
                const {Component} = section
                return <Component key = {id} />
            })}
        </ScrollView>
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
        backgroundColor: Colors.theme.up
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
        minWidth: 120
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
        paddingHorizontal: Spacing.lg
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