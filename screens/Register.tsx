import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase.js";
import { Input } from "react-native-elements";
import { User } from "../types";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const Register = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const storage = getStorage();
    const storageRef = ref(storage, `/profilePics/${auth.currentUser?.uid}`);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace("Tab");
            }
        });
        return unsubscribe;
    }, []);

    const register = async () => {
        const { user }: any = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        ).catch((error) => {
            console.log(error.message);
            if (error.message == "Firebase: Error (auth/invalid-email).") {
                Alert.alert("Invalid email", "Please enter a valid email");
            } else if (
                error.message ==
                "Firebase: Password should be at least 6 characters (auth/weak-password)."
            ) {
                Alert.alert(
                    "Weak password",
                    "passwords must be at least 6 characters"
                );
            } else if (
                error.message == "Firebase: Error (auth/internal-error)."
            ) {
                Alert.alert("Please fill all fields", "");
            } else if (
                error.message == "Firebase: Error (auth/email-already-in-use)."
            ) {
                Alert.alert(
                    "Email is registered",
                    "Login if you have an account",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Login",
                            onPress: () =>
                                navigation.navigate("Login" as never),
                            style: "default",
                        },
                    ]
                );
            }
        });
        await updateProfile(user, {
            displayName: name,
            photoURL:
                "https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
        });
        try {
            db.collection("users").doc(user.uid).set({
                uid: auth.currentUser?.uid,
                name: name,
                email: email,
                points: 0,
                // followedUsers: [],
                rates: [],
                role: "user",
                profilePicURL:
                    "https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
            });
        } catch (e) {
            Alert.alert("error", e);
        }
    };

    return (
        <>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView
                        style={styles.inputContainer}
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                    >
                        <Text style={styles.textStyle}>Register</Text>

                        <Input
                            inputStyle={{ fontFamily: "Montserrat_Regular" }}
                            autoComplete="off"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
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
                        <Input
                            inputStyle={{ fontFamily: "Montserrat_Regular" }}
                            autoComplete="off"
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholder="Full Name"
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                                width: "100%",
                                alignSelf: "center",
                            }}
                            style={styles.input}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                        <Input
                            inputStyle={{ fontFamily: "Montserrat_Regular" }}
                            autoComplete="off"
                            autoCorrect={false}
                            autoCapitalize="none"
                            rightIcon={
                                <TouchableOpacity
                                    onPress={() => setIsVisible(!isVisible)}
                                    style={{
                                        backgroundColor: "transparent",
                                        paddingRight: 50,
                                        display: "flex",
                                        position: "absolute",
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            !isVisible
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
                                        size={25}
                                    />
                                </TouchableOpacity>
                            }
                            secureTextEntry={isVisible ? false : true}
                            placeholder="Password"
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                                display: "flex",
                                flexDirection: "row",
                            }}
                            style={styles.input}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />


                        <Button
                            title={"Register"}
                            buttonStyle={styles.button}
                            onPress={register}
                            titleStyle={{ fontFamily: "Montserrat_Regular" }}
                        />
                        <View
                style={{
                    // display: "flex",
                    // position: "absolute",
                    // bottom: 0,
                    // width: "100%",
                    paddingTop: 100,
                }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontFamily: "Montserrat_Regular",
                            }}
                        >
                            Already have an account? Login
                        </Text>
                    </TouchableOpacity>
                </View>

                    </KeyboardAvoidingView>
                    {/* <View style={{ marginTop: 50 }}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontFamily: "Montserrat_Regular",
                        }}
                    >
                        Or register with
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginTop: 20,
                        }}
                    >
                        <TouchableOpacity>
                            <Ionicons name="logo-google" size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="logo-apple" size={30} />
                        </TouchableOpacity>
                    </View>
                </View> */}
                
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        fontFamily: "Montserrat_Regular",
        paddingBottom: 20
    },
    inputContainer: {
        display: "flex",
        width: "85%",
    },
    input: {
        backgroundColor: "#EBEBEB",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
    },
    textStyle: {
        alignSelf: "center",
        fontWeight: "700",
        fontSize: 30,
        marginBottom: 50,
        fontFamily: "Montserrat_Bold",
    },
    button: {
        width: "90%",
        marginVertical: 6,
        margin: 5,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#2161BF",
        opacity: 0.8,
        alignSelf: "center",
    },
});
