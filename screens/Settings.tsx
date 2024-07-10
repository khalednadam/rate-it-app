import {
    Alert,
    Button,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { Avatar } from "react-native-elements";
import "firebase/storage";
import "firebase/firestore";
import { getUserById } from "../Getters";
import { User } from "../types";
import { query, collection, where, getDocs } from "firebase/firestore";
import useCurrentUser from "../hooks/useCurrentUser";
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ navigation }: any) => {
    const user = useCurrentUser();
    const createTwoButtonAlert = () =>
        Alert.alert("Do you want to logout?", "", [
            {
                text: "Cancel",
                // onPress: () => console.log('Cancel Pressed'),
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: logout,
                style: "destructive",
            },
        ]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    }, []);
    const logout = () => {
        signOut(auth).then(() => {
            navigation.replace("Land");
            db.collection("users").doc(auth.currentUser?.uid).update({
                ExponentPushToken: ""
            });
        });
    };
    return (
        <>
            <View style={styles.container}>
                <View style={styles.settingsHeader}>
                    <Avatar
                        source={
                            {
                                uri: user?.profilePicURL,
                            } as any
                        }
                        size={80}
                        rounded
                    />
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text style={styles.name}>{user?.name}</Text>
                        <TouchableOpacity
                            style={{ paddingLeft: 5 }}
                            onPress={() => navigation.navigate("EditUser")}
                        >
                            <Ionicons
                                name="create-outline"
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ScrollView>
                {/* Settings button */}
                <View style={styles.settings}>
                    {/* <TouchableOpacity
                        style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 0.3,
                            borderTopColor: "black",
                            borderTopWidth: 0.3,
                            width: "100%",
                        }}
                        onPress={() =>
                            navigation.navigate("FollowedUsers" as never)
                        }
                    >
                        <Text style={styles.settingButton}>Followed users</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 0.3,
                            width: "100%",
                        }}
                    >
                        <Text style={styles.settingButton}>About Rate-it</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 0.3,
                            width: "100%",
                        }}
                    >
                        <Text style={styles.settingButton}>Contact us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 0.3,
                            width: "100%",
                        }}
                    >
                        <Text style={styles.settingButton}>Tell a friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("UpdatePassword" as never)} 
                        style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 0.3,
                            width: "100%",
                        }}
                    >
                        <Text style={styles.settingButton}>Change password</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 0.3,
                            width: "100%",
                        }}
                    >
                        <Text style={styles.settingButton}>Terms of service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 0.3,
                            width: "100%",
                        }}
                    >
                        <Text style={styles.settingButton}>Privicy policy</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={createTwoButtonAlert}
                        style={{
                            width: "100%",
                        }}
                    >
                        <Text style={styles.logout}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.version}>
                    <Text style={{ fontFamily: "Montserrat_Medium" }}>
                        Rate-it version 1.0
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Montserrat_Medium",
                            textAlign: "center",
                        }}
                    >
                        By Khaled Nadam {"\n"}
                        2023
                    </Text>
                </View>
            </ScrollView>
        </>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        width: "100%",
    },
    name: {
        fontFamily: "Montserrat_SemiBold",
        fontSize: 24,
        paddingTop: 10,
    },
    settingsHeader: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingBottom: 20,
    },
    settings: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "white",
    },
    settingButton: {
        color: "#2589E9",
        fontWeight: "500",
        fontSize: 18,
        fontFamily: "Montserrat_Regular",
        width: "100%",
        padding: 10,
        paddingVertical: 15,
    },
    logout: {
        color: "red",
        fontWeight: "500",
        fontSize: 18,
        fontFamily: "Montserrat_Regular",
        width: "100%",
        padding: 10,
        paddingVertical: 15,
    },
    version: {
        justifyContent: "center",
        alignItems: "center",
        // height: 250,
        paddingTop: 5,
        opacity: 0.5,
    },
});
