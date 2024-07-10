import { Appearance, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Home from "./screens/Home";
import UserProfile from "./screens/UserProfile";
import { Ionicons } from "@expo/vector-icons";
import Settings from "./screens/Settings";
import Categories from "./screens/Categories";
import * as Font from "expo-font";
import Dashboard from "./screens/Dashboard";

const BottomTab = createBottomTabNavigator();

export type RootTabParamList = {
    Home: undefined;
    Categories: undefined;
    UserProfile: undefined;
    Settings: undefined;
};

const Tab = () => {;
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen
                name="Home"
                component={Dashboard}
            />
            <BottomTab.Screen
                name="Categories"
                component={Categories}
                options={{
                    
                    tabBarIcon: ({ focused, color }) => (                        
                        <Ionicons
                            name={focused ? "square" : "square-outline"}
                            color={focused ? "#2161BF" : color}
                            size={20}
                        />
                    ),
                }}
            />
            {/* <BottomTab.Screen
                name="Your Profile"
                component={UserProfile}
                options={{
                    headerTitleStyle: {fontFamily: "Montserrat_Regular"},
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            color={focused ? "#2161BF" : color}
                            size={20}
                        />
                    ),
                }}
            /> */}

            <BottomTab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? "settings" : "settings-outline"}
                            color={focused ? "#2161BF" : color}
                            size={20}
                        />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
};

export default Tab;

const styles = StyleSheet.create({});
