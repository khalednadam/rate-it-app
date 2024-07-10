import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import Lottie from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";

const Loading = () => {
    const animationRef = useRef<Lottie>(null);
    // const navigation = useNavigation();
    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerShown: false,
    //     });
    // });
    useEffect(() =>{
        animationRef.current?.play()
        animationRef.current?.play(0, 120);
    }, [])
    return (
        // <View style={{backgroundColor: "white"}}>
            <Lottie
                ref={animationRef}
                source={require("../assets/images/star.json")}
                autoPlay
                loop
                speed={2}
                resizeMode={"contain"}
                style={{backgroundColor: "white"}}
            />
        // </View>
    );
};

export default Loading;

const styles = StyleSheet.create({});
