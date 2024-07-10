import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native-elements";
import Logo from "../assets/images/logo.png";

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={ Logo } style={styles.logo}/>
            <Text style={styles.slogan}>Rate-it</Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container:{
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    logo:{
        width: 100,
        height: 100
    },
    slogan:{
        fontFamily: "Montserrat_Regular",
        fontSize: 50
    }
});
