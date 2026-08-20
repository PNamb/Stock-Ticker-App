import React from "react";
import {StyleSheet, Text, View} from "react-native"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming} from "react-native-reanimated";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Art from "../../assets/svgArt"
import { Colors } from "@/constants/theme";

export const rotateAnimation = (isActive, scale) => { //["rotate", "deg"]
    scale.value = withSpring(isActive ? 180 : 0, {
        damping: 50,
        stiffness: 240
    })
}

export const scaleAnimation = (isActive, scale) => { //["scale", ""]
    scale.value = withSpring(isActive ? 1.5 : 1, {
        damping: 20,
        stiffness: 300
    })
}

export const pulseAnimation = (isActive, opacity) => { //["opacity", ""]
    opacity.value = withSequence(
        withTiming(0.3, {duration: 350, easing: Easing.linear}),
        withTiming(1, {duration: 350, easing: Easing.linear})
    )
}
 
export const shakeAnimation = (isActive, scale) => { //["rotateZ", "deg"]
    scale.value = 
        withSequence(
            withTiming(-10, { duration:35, easing: Easing.linear }), 
            withRepeat(withTiming(10, { duration: 70, easing: Easing.linear, }), 6, true ), 
            withTiming(0, { duration: 35, easing: Easing.linear }))    
}

export const bounceAnimation = (isActive, scale) => { //unused
    scale.value = withSpring(isActive ? 1.25 : 1, {
        damping: 8,
        stiffness: 400
    })
}

export const riseAnimation = (isActive, translateY) => { //["translateY", "%"]
    translateY.value = isActive ? withSequence(
        withTiming(-18, {duration: 150, easing: Easing.linear}),
        withTiming(18, {duration: 150, easing: Easing.linear}),
        withTiming(0, {duration: 150, easing: Easing.linear})
    ) : withSequence(
        withTiming(18, {duration: 150, easing: Easing.linear}),
        withTiming(-18, {duration: 150, easing: Easing.linear}),
        withTiming(0, {duration: 150, easing: Easing.linear})
    )
}

export default function AnimatedTabIcon({tab, isActive, onPress, animate = scaleAnimation, transformProp = ["scale", ""]}) {
    const scale = useSharedValue(1)
    useEffect(() => {
        animate(isActive, scale)
    }, [isActive])

    const animatedStyle = useAnimatedStyle(() => {
        if (transformProp[0] == "opacity") {
            return {opacity: scale.value}
        }
        return {
            transform: [{[transformProp[0]]: transformProp[1] ? `${scale.value}${transformProp[1]}` : scale.value}]
        }
    })
    return (
        <Pressable 
            onPress = {onPress}
            style = {[styles.tabItem, {backgroundColor: Colors.theme.dark}]}
        >
            <Animated.View style = {animatedStyle}>
                <Art art = {tab.label} box = {tab.labelBox} size = {tab.labelSize} color = {isActive ? tab.activeColor: Colors.icons.bottomTabIcon} />
            </Animated.View>
        </Pressable>
        
    )
}

const styles = StyleSheet.create({
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    }
})