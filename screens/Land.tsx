import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Image } from "react-native-elements";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../components/Loading";
const Land = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(true);
            if (user) {
                setLoading(false);
                navigation.replace("Tab");
            }else if(!user){
                setLoading(false)
            }
        });
        return unsubscribe;
    }, []);
    return (
        <View
            style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
            }}
        >
            {/* <Image source={require("../assets/images/pattern.jpg")} style={{ height: 400, width: 400 }} /> */}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                    style={{ fontFamily: "Montserrat_Bold", fontSize: 30, marginTop: 40 }}
                >
                    Rate anything
                </Text>
                <Text style={{ fontWeight: "200", paddingTop: 10, fontFamily: "Montserrat_Regular" }}>
                    Share your experience with the world.
                </Text>
            </View>
            <View style={{ marginTop: 100, width: "75%" }}>
                <Button
                    title={"Login"}
                    titleStyle={{fontFamily: "Montserrat_SemiBold"}}
                    buttonStyle={styles.button}
                    onPress={() => navigation.navigate("Login")}
                />
                <Button
                    title={"Register"}
                    buttonStyle={styles.button}
                    titleStyle={{fontFamily: "Montserrat_SemiBold"}}
                    onPress={() => navigation.navigate("Register")}
                />
            </View>
        </View>
    );
};

export default Land;

const styles = StyleSheet.create({
    button: { 
        width: "100%", 
        marginVertical: 6, 
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#2161BF",
        opacity: 0.8,
    },
});
