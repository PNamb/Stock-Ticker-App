import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { Colors, Spacing, Radius, Typography } from "@/constants/theme";
import { useEffect, useState } from "react";
import AnimatedSwitch from "@/components/AnimatedSwitch"
import {DEFAULT_SETTINGS, useAppSettings} from "@/contexts/AppContext"
import { useRouter } from "expo-router";
import Animated, { LinearTransition, FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

function OptionsPanel({options, selectedValue, onSelect}) {
    return (
        <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(360)}
            style={styles.panel}
        >
            {options.map((opt) => (
                <Pressable
                    key={opt}
                    style = {({pressed}) => [styles.optionRow, {backgroundColor: pressed ? Colors.theme.pressed : Colors.background.widget}]}
                    onPress={() => onSelect(opt)}
                >
                    <Text style = {styles.optionText}>{opt}</Text>
                    {opt === selectedValue && <Text style = {styles.checkmark}>✓</Text>}
                </Pressable>
            ))}
        </Animated.View>
    )
}


function SettingsRow({label, subLabel, value, onPress, type = "nav", switchValue, onSwitchChange, options, isExpanded, onToggle, onSelectOptions}) {
    const isExpandable = type === "nav" && options?.length > 0
    const handlePress = isExpandable ? onToggle : onPress
    const chevronTurn = useSharedValue(isExpanded ? 90 : 0)

    useEffect(() => {
        chevronTurn.value = withTiming(isExpanded ? 90 : 0, {duration: 150})
    }, [isExpanded])

    const chevronTurnStyle = useAnimatedStyle(() => {
        return {
            transform: [{rotate: `${chevronTurn.value}deg`}]
        }
    })
    return (
        <Animated.View layout={LinearTransition}>
            <Pressable style = {({pressed}) => [styles.row, {backgroundColor: pressed ? Colors.theme.pressed : Colors.background.widget}]} onPress={handlePress} disabled = {type === "switch"}>
                <View style = {{flex: 1}}>
                    <Text style = {styles.rowLabel}>{label}</Text>
                    {subLabel && <Text style = {styles.rowSubLabel}>{subLabel}</Text>}
                </View>

                {type === "switch" && (
                    <AnimatedSwitch 
                        value = {switchValue}
                        onPress = {onSwitchChange}
                    />
                )}

                {type === "nav" && (
                    <View style = {{flexDirection: "row", alignItems: "center", gap: 4}}>
                        {value && <Text style = {styles.rowValue}>{value}</Text>}
                        <View style = {styles.spacer} />
                        <Animated.Text style = {[styles.chevron, isExpandable && chevronTurnStyle]}>
                            ❯ {/* not ">" */}
                        </Animated.Text>
                    </View> 
                )}
            </Pressable>
            {isExpandable && isExpanded && (
                <OptionsPanel
                    options = {options}
                    selectedValue={value}
                    onSelect={onSelectOptions}
                />
            )}
        </Animated.View>
    )
}

function SettingsSection({title, children}) {
    return (
        <Animated.View style = {styles.section} layout={LinearTransition}>
            <Text style = {styles.sectionTitle}>{title}</Text>
            <Animated.View style = {styles.sectionCard} layout={LinearTransition}>
                {children}
            </Animated.View>
        </Animated.View>
    )
}

export default function SettingsScreen() {
    const {settings, updateSettings} = useAppSettings()
    const router = useRouter()
    const [expandedKey, setExpandedKey] = useState(null)

    const toggleRow = (key) => {
        setExpandedKey((prev) => (prev === key ? null : key))
    }

    const handleSelectOptions = (key, val) => {
        updateSettings(key, val)
        setExpandedKey(null)
    }

    const displaySettingsRow = (settingsList) => (
        settingsList.map((setting) => (
            <SettingsRow key = {setting.label}
                label = {setting.label}
                subLabel = {setting.subLabel ?? null}
                value = {setting.value ?? null}
                onPress = {setting.onPress ?? null}
                type = {setting.type ?? "nav"}
                switchValue = {setting.switchValue ?? null}
                onSwitchChange = {setting.onSwitchChange ?? null}
                options = {setting.options ?? null}
                isExpanded = {expandedKey === setting.key}
                onToggle = {() => toggleRow(setting.key)}
                onSelectOptions = {(val) => handleSelectOptions(setting.key, val)}
            />
        ))
    )

    const HOMESCREEN_SETTINGS = [
        { key: "sectionOrder", label: "Section order", subLabel: "Drag to Reorder", onPress: () => router.push("/sectionOrder") },
        { key: "layout", label: "Gainers/losers layout", value: settings.layout ?? DEFAULT_SETTINGS.layout, options: ["Side by side", "Stacked"] },
        { key: "universe", label: "Movers Universe", value: settings.universe ?? DEFAULT_SETTINGS.universe, options: ["S&P 500", "Nasdaq 100", "Dow 30"] },
        { key: "rowsPerList", label: "Rows per List", value: String(settings.rowsPerList ?? DEFAULT_SETTINGS.rowsPerList), options: ["3", "5", "10"] },
        { label: "Show gainers/losers", type: "switch", switchValue: settings.showMovers, onSwitchChange: (v) => updateSettings("showMovers", v) },
        { label: "Show most active", type: "switch", switchValue: settings.showMostActive, onSwitchChange: (v) => updateSettings("showMostActive", v) },
        { label: "Show Indexes", type: "switch", switchValue: settings.showIndices, onSwitchChange: (v) => updateSettings("showIndices", v) }
    ];

    const DISPLAY_SETTINGS = [
        {key: "format", label: "Change format", value: settings.format ?? DEFAULT_SETTINGS.format, options: ["Percent", "Absolute"]},
        {label: "Live updates", type: "switch", switchValue: settings.liveUpdates, onSwitchChange: (v) => updateSettings("liveUpdates", v)}
    ]


    return (
        <ScrollView style = {styles.container} contentContainerStyle = {{paddingBottom: 24}}>
            <View style = {styles.header}>
                <Text style = {styles.headerTitle}>Settings</Text>
            </View>
            <SettingsSection title = "Display">
                {displaySettingsRow(DISPLAY_SETTINGS)}
            </SettingsSection>

            <SettingsSection title = "Home Screen">
                {displaySettingsRow(HOMESCREEN_SETTINGS)}
            </SettingsSection>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.theme.dark
    },
    spacer: {
        width: Spacing.xxs
    },
    header: {
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.sm
    },
    headerTitle: {
        color: Colors.theme.light,
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.normal
    },
    section: {
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xl
    },
    sectionTitle: {
        color: Colors.symbol.sectionTitle,
        fontSize: Typography.size.sm,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: Spacing.sm
    },
    sectionCard: {
        borderRadius: Radius.lg,
        overflow: "hidden",
    },
    row: {
        minHeight: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderTopWidth: 0.5,
        borderTopColor: Colors.symbol.borderTop
    },
    rowLabel: {
        color: Colors.theme.light,
        fontSize: Typography.size.md
    },
    rowSubLabel: {
        color: Colors.symbol.volume,
        fontSize: Typography.size.sm,
        marginTop: 2
    },
    rowValue: {
        color: Colors.symbol.volume,
        fontSize: Typography.size.md
    },
    chevron: {
        color: Colors.symbol.chevron,
        fontSize: 12
    },
    panel: {
        borderTopWidth: 0.5,
        borderTopColor: Colors.symbol.borderTop,
    },
    optionRow: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.xl,
        paddingLeft: 26,
        paddingVertical: Spacing.md,
        borderTopWidth: 0.5,
        borderTopColor: Colors.symbol.borderTop
    },
    optionText: {
        color: Colors.theme.light,
        fontSize: Typography.size.md
    },
    checkmark: {
        color: Colors.theme.up,
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold
    }
})