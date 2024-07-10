import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useLayoutEffect } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { RootStackParamList } from "../App";

type SuccessRoute = RouteProp<
    RootStackParamList,
    "SuccessRoute"
>;

interface Props {
    route?: SuccessRoute;
}
const Success: FC<Props> = (props) => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    });
    return (
        <SafeAreaView style={styles.container}>
            <Ionicons name="checkmark-circle" size={100} color="#2161BF" style={{opacity: 0.8}} />
            <Text style={styles.text}>You rated {props.route?.params.serviceName} successfully</Text>
            <Button
                title={"Done"}
                buttonStyle={styles.button}
                titleStyle={{ fontFamily: "Montserrat_Regular" }}
                onPress={() => navigation.navigate("Home" as never)}
            />
        </SafeAreaView>
    );
};

export default Success;

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
