import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const Categories = ({ navigation }: any) => {
    const [searchService, setSearchService] = useState("");
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
            headerRight: () =>(
                <TouchableOpacity style={{marginRight: 20}} onPress={() => navigation.navigate("SearchForService")}>
                    <Ionicons name="search" size={25} />
                </TouchableOpacity>
            )
        });
    }, []);

    const search = () => {
        // TODO: Searching for a service functionallity
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <CategoryCard categoryName="Restaurants" iconName="pizza" />
                <CategoryCard categoryName="Cafes" iconName="cafe" />
                <CategoryCard categoryName="Internet Companies" iconName="wifi" />
                <CategoryCard categoryName="Apps" iconName="apps" />
                <CategoryCard categoryName="Banks" iconName="card" />
                <CategoryCard categoryName="Mall" iconName="pricetag" />
                <CategoryCard categoryName="Gym" iconName="barbell" />
                <CategoryCard categoryName="TV Channels" iconName="tv" />
                <CategoryCard categoryName="Online Stores" iconName="browsers" />
                <CategoryCard categoryName="Media Companies" iconName="videocam" />
                <CategoryCard categoryName="Medical" iconName="medical" />
                <CategoryCard categoryName="Hotels" iconName="bed" />
                <CategoryCard categoryName="Schools" iconName="book" />
                <CategoryCard categoryName="Airlines" iconName="airplane" />
                <CategoryCard categoryName="Retail Stores" iconName="business" />
                <CategoryCard categoryName="Other" iconName="ellipsis-horizontal-sharp" />
            </View>
        </ScrollView>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        paddingTop: 10,
    },
});
