import { DevSettings, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Avatar } from "react-native-elements";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import Stars from "./Stars";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type ServicesListItemProps ={
    name: string,
    description: string,
    serviceId: string,
    generalRate: number,
    totalRate: number,
    rateLen: number,
    servicePicURL: string
}

const ServicesListItem = ({ name, serviceId, generalRate, rateLen, servicePicURL }: ServicesListItemProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() =>
                navigation.navigate(
                    "ServiceProfile",
                    {
                        serviceId: serviceId,
                    }
                )
            }
        >
            <Avatar
                source={{ uri: servicePicURL } as any}
                size={80}
                rounded
            />
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{name}</Text>
                <Stars rate={generalRate}/>
                <Text style={{fontFamily: "Montserrat_Regular"}}>{rateLen}  {rateLen == 1 ? "rate" : "rates"}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ServicesListItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row",
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        padding: 50,
        justifyContent: "space-around",
        marginBottom: 10,
    },
    nameContainer: {
        // display: "flex",
        flex: 1,
        marginLeft: 20
        // flexWrap: "wrap",

    },
    name: {
        fontSize: 22,
        paddingBottom: 10,
        fontFamily: "Montserrat_Regular",
        flexWrap: "wrap",
        overflow: "visible",

    },
    rate: {
        paddingBottom: 10,
        flexDirection: "row",
    },
});
