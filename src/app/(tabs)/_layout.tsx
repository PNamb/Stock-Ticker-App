import { act, useRef, useState } from "react";
import { View, StyleSheet, NativeSyntheticEvent } from "react-native";
import PagerView from "react-native-pager-view"
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Home from "./home";
import Search from "./search";
import WatchList from "./watchlist";
import Portfolio from "./portfolio";
import { Colors } from "@/constants/theme";
import Settings from "./settings";

import AnimatedTabIcon, { pulseAnimation, riseAnimation, rotateAnimation, scaleAnimation, shakeAnimation } from "@/components/AnimatedTabIcon"
import { settingsArt, portfolioArt, homeArt, watchListArt, searchArt } from "@/assets/svgArt";

const TABS = [
    {key: "Home", label: homeArt, labelBox: "0 0 1024 1024", labelSize: 50, activeColor: Colors.icons.home, animate: riseAnimation, transformProp: ["translateY", "%"]},
    {key: "Watchlist", label: watchListArt, labelBox: "0 0 32 32", labelSize: 55, activeColor: Colors.icons.watchlist, animate: pulseAnimation, transformProp: ["opacity", ""]},
    {key: "Search", label: searchArt, labelBox: "0 0 24 24", labelSize: 40, activeColor: Colors.icons.search, animate: scaleAnimation, transformProp: ["scale", ""]},
    {key: "Portfolio", label: portfolioArt, labelBox: "0 0 24 24", labelSize: 38, activeColor: Colors.icons.portfolio, animate: shakeAnimation, transformProp: ["rotateZ", "deg"]},
    {key: "Settings", label: settingsArt, labelBox: "0 0 64 64", labelSize: 40, activeColor: Colors.icons.settings, animate: rotateAnimation, transformProp: ["rotate", "deg"]}
]

const SCREENS = [Home, WatchList, Search, Portfolio, Settings]

//add loading screens later
export default function TabLayout() {
    const insets = useSafeAreaInsets()
    const [activeIndex, setActiveIndex] = useState(0)
    const pagerRef = useRef<PagerView>(null)

    const goToPage = (index: number) => {
        pagerRef.current?.setPage(index)
    }

    const onPageSelected = (e: NativeSyntheticEvent<Readonly<{position: number}>>) => {
        setActiveIndex(e.nativeEvent.position)
    }

    return (
        <View style = {{flex: 1}}>
            <PagerView
                ref = {pagerRef}
                style = {{flex: 1}}
                initialPage = {0}
                onPageSelected = {onPageSelected}
            >
                {SCREENS.map((Screen, i) => (
                    <View key = {i} style = {{flex: 1}}>
                        {i === activeIndex && <Screen />}
                    </View>
                ))}
            </PagerView>

            

            <View style = {[styles.tabBar, {height: 60 + insets.bottom, paddingBottom: insets.bottom}, {borderTopColor: TABS[activeIndex].activeColor}]}>
                {TABS.map((tab, i) => (
                    <AnimatedTabIcon
                        key = {tab.key}
                        tab = {tab}
                        isActive = {activeIndex === i}
                        onPress = {() => {
                            goToPage(i)
                        }}
                        animate = {tab.animate}
                        transformProp = {tab.transformProp}
                    />
                ))}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        backgroundColor: Colors.theme.dark,
        paddingTop: 8,
        borderTopWidth: 1.5,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },
})