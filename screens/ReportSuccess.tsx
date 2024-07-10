import { SafeAreaView, StyleSheet, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";

const ReportSuccess = () => {
    const navigation = useNavigation();
    useLayoutEffect(() =>{
        navigation.setOptions({
            headerShown: false
        })
    })
    return (
        <SafeAreaView style={styles.container}>
            <Ionicons name="checkmark-circle" size={100} color="#2161BF" style={{opacity: 0.8}} />
            <Text style={styles.text}>Your report was sent!</Text>
            <Text style={{fontFamily: "Montserrat_Light"}}>Thank you for helping us!</Text>
            <Button
                title={"Done"}
                buttonStyle={styles.button}
                titleStyle={{ fontFamily: "Montserrat_Regular" }}
                onPress={() => navigation.navigate("Home" as never)}
            />
        </SafeAreaView>
    );
};

export default ReportSuccess;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "white"
    },
    text: {
        fontFamily: "Montserrat_Bold",
        fontSize: 20,
    },
    button: {
        // width: "90%",
        marginVertical: 6,
        marginTop: 50,
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#2161BF",
        opacity: 0.8,
        alignSelf: "center",
        fontFamily: "Montserrat_Regular"
    },
});
