import { StyleSheet, View, Text } from "react-native";
import { Colors } from "@/constants/theme";

export default function WatchListScreen() {
    return (
        <View style = {styles.container}>
            <Text>Test Two</Text>
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