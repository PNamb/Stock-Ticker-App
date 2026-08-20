import {StyleSheet, View, Text, Pressable} from "react-native"
import DraggableFlatlist, {ScaleDecorator} from "react-native-draggable-flatlist"
import {Colors, Radius, Spacing, Typography} from "../constants/theme"
import { useAppSettings } from "@/contexts/AppContext"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"

const SECTION_LABELS = {
    indexes: "Indexes",
    movers: "Gainers / Losers",
    mostActive: "Most active"
}

function ReorderRow({item, drag, isActive}) {
    return (
        <ScaleDecorator>
            <Pressable style = {[styles.row, isActive && styles.rowActive]} onPressIn = {drag} disabled = {isActive}>
                <Text style = {styles.handle}>≡</Text>
                <Text style = {styles.rowLabel}>{SECTION_LABELS[item]}</Text>
            </Pressable>
        </ScaleDecorator>
    )
}

export default function SectionOrderScreen() {
    const {settings, updateSettings} = useAppSettings()
    const [localOrder, setLocalOrder] = useState(settings.sectionOrder ?? ["indexes", "movers", "mostActive"])
    const router = useRouter()

    const handleBack = () => {
        router.push("/settings")
    }

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
            {console.log(settings)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.dark,
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xxl
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
        backgroundColor: Colors.background.widget,
        borderRadius: Radius.super
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.lg,
        padding: Spacing.xl,
        borderTopWidth: 0.5,
        borderTopColor: Colors.symbol.borderTop,
        backgroundColor: Colors.background.widget
    },
    rowActive: {
        backgroundColor: Colors.symbol.active
    },
    rowLabel: {
        color: Colors.theme.light,
        fontSize: Typography.size.md,
        flex: 1
    },
    handle: {
        color: Colors.symbol.volume,
        fontSize: Typography.size.lg
    }
})