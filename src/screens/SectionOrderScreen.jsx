import {StyleSheet, View, Text, Pressable, Dimensions} from "react-native"
import DraggableFlatlist, {ScaleDecorator} from "react-native-draggable-flatlist"
import {Colors, Radius, Spacing, Typography} from "../constants/theme"
import { useAppSettings } from "@/contexts/AppContext"
import { useState } from "react"
import { IndexesSection, MoversSection, MostActiveSection } from "./HomeScreen"

const PREVIEW_INDEXES = [
    {symbol: "TEST1", value: "10,000", change: 1.25},
    {symbol: "TEST2", value: "10,000", change: -0.80},
]
const PREVIEW_GAINERS = [
    {symbol: "TEST3", change: 12.34},
    {symbol: "TEST4", change: 8.21},
    {symbol: "TEST5", change: 12.34},
    {symbol: "TEST6", change: 8.21},
    {symbol: "TEST7", change: 12.34},
    {symbol: "TEST8", change: 8.21},
]
const PREVIEW_LOSERS = [
    {symbol: "TEST9", change: -12.34},
    {symbol: "TEST10", change: -8.21},
    {symbol: "TEST15", change: -8.21},
    {symbol: "TEST16", change: -8.21},
    {symbol: "TEST17", change: -8.21},
    {symbol: "TEST18", change: -8.21}
]
const PREVIEW_ACTIVE = [
    {symbol: "TEST11", volume: "10.0M", change: 1.25},
    {symbol: "TEST12", volume: "10.0M", change: -0.80},
    {symbol: "TEST13", volume: "10.0M", change: 1.25},
    {symbol: "TEST14", volume: "10.0M", change: -0.80}
]

const SCALE = 0.85

function SectionPreview({id}) {
    let content
    if (id === "indexes") content = <IndexesSection data={PREVIEW_INDEXES} />
    else if (id === "movers") content = <MoversSection gainers={PREVIEW_GAINERS} losers={PREVIEW_LOSERS} />
    else if (id === "mostActive") content = <MostActiveSection data={PREVIEW_ACTIVE} />
    else return null

    return (
        <View style = {styles.previewClip} pointerEvents="none">
            <View style = {[styles.previewInner, {transform: [{scale: SCALE}]}]}>
                {content}
            </View>
        </View>
    )
}

function ReorderRow({item, drag, isActive}) {
    return (
        <ScaleDecorator>
            <Pressable style = {[styles.row, isActive && styles.rowActive]} onPressIn={drag} disabled = {isActive}>
                {/* <Text style = {styles.rowLabel}>{SECTION_LABELS[item]}</Text> */}
                <SectionPreview id={item} />
            </Pressable>
        </ScaleDecorator>
    )
}

export default function SectionOrderScreen() {
    const {settings, updateSettings} = useAppSettings()
    const [localOrder, setLocalOrder] = useState(settings.sectionOrder ?? ["indexes", "movers", "mostActive"])

    return (
        <View style = {styles.container}>
            <Text style = {styles.headerTitle}>Section order</Text>
            <Text style = {styles.hint}>Press and hold a row to drag</Text>
            <DraggableFlatlist
                style = {{borderRadius: Radius.super}}
                data = {localOrder}
                keyExtractor = {(item) => item}
                onDragEnd = {({data}) => {
                    setLocalOrder(data)
                    updateSettings("sectionOrder", data)
                }}
                renderItem = {({item, drag, isActive}) => (
                    <ReorderRow item={item} drag={drag} isActive={isActive} />
                )}
                containerStyle = {styles.card}
                
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.dark,
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xxl,
    },
    headerTitle: {
        color: Colors.theme.light,
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.normal,
        marginBottom: Spacing.xxs
    },
    hint: {
        color: Colors.symbol.volume,
        fontSize: 12,
        marginBottom: Spacing.xl
    },
    card: {
        borderRadius: Radius.super,
    },
    row: {
        gap: Spacing.sm,
        backgroundColor: Colors.theme.dark,
    },
    rowActive: {
        backgroundColor: Colors.symbol.active
    },
    rowLabel: {
        color: Colors.theme.light,
        fontSize: Typography.size.md
    },
    previewClip: {
        overflow: "hidden",
        maxHeight: 250 //tune
    },
    previewInner: {
        transformOrigin: "center"
    }
})