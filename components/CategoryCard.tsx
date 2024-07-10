import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface CategoryCardProps {
    categoryName: string;
    iconName: any;
}

const CategoryCard = ({ categoryName, iconName }: CategoryCardProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("ServicesList", {
            categoryName: categoryName
        } )}>

            <Ionicons name={iconName} color="#2161BF" size={30} style={{marginBottom: 20}} />
            <Text style={{fontFamily: "Montserrat_Regular", fontSize: 16, textAlign: "center"}}>{categoryName}</Text>
        </TouchableOpacity>
    );
};

export default CategoryCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 20,
        width: "45%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 50,
        borderRadius: 10,
    },
});
