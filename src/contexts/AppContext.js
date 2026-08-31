import React, {createContext, useContext, useEffect, useState, useRef, useCallback} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

const AppContext = createContext(null)
const STORAGE_KEY = "@stock_settings"

export const DEFAULT_SETTINGS = {
    format: "Percent",
    showMovers: true,
    rowsPerList: "5",
    showMostActive: true,
    refreshToUpdate: true,
    sectionOrder: ["indexes", "movers", "mostActive"],
    layout: "Side by side",
    showIndices: true
}

export function AppProvider({children}) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [isLoaded, setIsLoaded] = useState(false)
    const hasLoaded = useRef(false)

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY)
                if (stored) {
                    setSettings({...DEFAULT_SETTINGS, ...JSON.parse(stored)})
                }
            } catch (e) {
                console.warn("Failed to load settings", e)
            } finally {
                hasLoaded.current = true
                setIsLoaded(true)
            }
        })()
    }, [])

    useEffect(() => {
        if (!hasLoaded.current) return
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch((e) => {
            console.warn("Failed to save settings", e)
        })
    }, [settings])

    const updateSettings = useCallback((key, value) => {
        setSettings((prev) => ({...prev, [key]: value}))
    }, [])

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS)
    }, [])

    return (
        <AppContext.Provider value = {{settings, updateSettings, resetSettings, isLoaded, }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppSettings() {
    const ctx = useContext(AppContext)
    if (!ctx) {
        throw new Error("useAppSettings must be used within an AppProvider")
    }
    return ctx
}