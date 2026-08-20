import React, { useEffect } from "react";
import {Pressable, StyleSheet} from "react-native"
import Animated, {interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated"
import {Colors} from "../constants/theme"

export default function AnimatedSwitch({value, onPress, style, duration = 200, trackColors = {on: Colors.theme.up, off: "#3a3737"}}) {
    const progress = useSharedValue(value ? 1 : 0)
    const height = useSharedValue(0)
    const width = useSharedValue(0)

    useEffect(() => {
        progress.value = withTiming(value ? 1 : 0, {duration})
    }, [value])

    const trackAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(progress.value, [0, 1], [trackColors.off, trackColors.on]),
            borderRadius: height.value / 2
        }
    })

    const thumbAnimatedStyle = useAnimatedStyle(() => {

        return {
            transform: [{translateX: interpolate(progress.value, [0, 1], [0, width.value - height.value])}],
            borderRadius: height.value / 2
        }
    })

    return (
        <Pressable onPress = {() => onPress(!value)}>
            <Animated.View
                onLayout = {(e) => {
                    height.value = e.nativeEvent.layout.height
                    width.value = e.nativeEvent.layout.width
                }}
                style = {[styles.track, style, trackAnimatedStyle]}>
                    <Animated.View style = {[styles.thumb, thumbAnimatedStyle]} />
                </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    track: {
        alignItems: "flex-start",
        width: 55,
        height: 27.5,
        padding: 3
    },
    thumb: {
        height: "100%",
        aspectRatio: 1,
        backgroundColor: "#ffffff"
    }
})