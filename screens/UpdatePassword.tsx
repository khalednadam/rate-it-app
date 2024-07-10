import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { reauthenticateWithCredential, sendPasswordResetEmail, signOut, updatePassword, User } from "firebase/auth";
import { auth } from "../firebase";

const UpdatePassword = ({ navigation }: any) => {
    const [newPassword, setNewPassword] = useState("");
    // const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Reset Password",
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    }, []);
    const logout = () => {
        signOut(auth).then(() => {
            navigation.replace("Login" as never);
        });
    };
    const updateMyPassword = () => {
        updatePassword( auth.currentUser as User, newPassword).then(() => {
            Alert.alert("Password changed","")
        }).then(() =>{
            navigation.navigate("Home" as never)
        }).catch((error) =>{
            if(error.message === "Firebase: Error (auth/requires-recent-login)."){
                Alert.alert("Logout and login again", "This operation requires you to logout and login again", [
                    {
                        text: "Cancel",
                        style: "default"
                    }, 
                    {
                        text: "Logout",
                        style: 'destructive',
                        onPress: logout
                    }
                ])
            }
        } )
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
                Enter your new password
            </Text>
            <Input
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="visible-password"
                inputStyle={{ fontFamily: "Montserrat_Regular" }}
                placeholder="Your new password"
                inputContainerStyle={{
                    borderBottomWidth: 0,
                    width: "100%",
                    alignSelf: "center",
                }}
                style={styles.input}
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
            />
            <Button
                title={"Change"}
                buttonStyle={styles.button}
                onPress={updateMyPassword}
                titleStyle={{ fontFamily: "Montserrat_Regular", paddingHorizontal: 20 }}
            />
        </KeyboardAvoidingView>
    );
};

export default UpdatePassword;

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
