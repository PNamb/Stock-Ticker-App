import { Colors } from "@/constants/theme";
import { StyleSheet, View, Text } from "react-native";

export default function PortfolioScreen() {
    return (
        <View style = {styles.container}>
            <Text>Test Four</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.theme.dark
    }
})