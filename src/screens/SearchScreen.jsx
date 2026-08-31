import { StyleSheet, View, Text } from "react-native";
import { Colors } from "@/constants/theme";

export default function SearchScreen() {
    return (
        <View style = {styles.container}>
            <Text>Test Three</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eb6e35"
    }
})