import {StyleSheet, View, Text, Pressable, Dimensions} from "react-native"
import DraggableFlatlist, {ScaleDecorator} from "react-native-draggable-flatlist"
import {Colors, Radius, Spacing, Typography} from "../constants/theme"
import { useAppSettings } from "@/contexts/AppContext"
import { useState } from "react"
import { IndexesSection, MoversSection, MostActiveSection } from "./HomeScreen"
import { useMarketData } from "@/hooks/useMarketData"

const SCALE = 0.9

function SectionPreview({id}) {
    const {indexes, gainers, losers, mostActive} = useMarketData()
    let content
    if (id === "indexes") content = <IndexesSection data={indexes} scrollEnabled = {false} />
    else if (id === "movers") content = <MoversSection gainers={gainers} losers={losers} scrollEnabled = {false} />
    else if (id === "mostActive") content = <MostActiveSection data={mostActive} scrollEnabled = {false} />
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
    },
    previewInner: {
        transformOrigin: "center"
    }
})