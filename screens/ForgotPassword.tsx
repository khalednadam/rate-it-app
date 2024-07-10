import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Reset Password",
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    }, []);
    const forgotPassword = () => {
        sendPasswordResetEmail(auth, email).then(() => {
            Alert.alert("Email sent!", "Please follow instructions sent to you by email")
        });
    };
    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <Text
                style={{
                    fontFamily: "Montserrat_Regular",
                    fontSize: 22,
                    padding: 5,
                }}
            >
                Enter your email
            </Text>
            <Input
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                inputStyle={{ fontFamily: "Montserrat_Regular" }}
                placeholder="Email"
                inputContainerStyle={{
                    borderBottomWidth: 0,
                    width: "100%",
                    alignSelf: "center",
                }}
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Button
                title={"Send email"}
                buttonStyle={styles.button}
                onPress={forgotPassword}
                titleStyle={{ fontFamily: "Montserrat_Regular" }}
            />
        </KeyboardAvoidingView>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    input: {
        backgroundColor: "#EBEBEB",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
    },
    button: {
        // width: "90%",
        marginVertical: 6,
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#2161BF",
        opacity: 0.8,
        alignSelf: "center",
    },
});
