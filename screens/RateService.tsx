import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { Avatar, Button, Input } from "react-native-elements";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import * as ImagePicker from "expo-image-picker";
import { updateCurrentUser, updateProfile } from "firebase/auth";
import { Service, User } from "../types";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
// import firebase from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import ImageView from "react-native-image-viewing";

import {
    arrayUnion,
    collection,
    serverTimestamp,
    FieldValue,
    getDocs,
    increment,
    query,
    where,
} from "firebase/firestore";
// import firebase from "firebase/compat";
import firebase from "firebase/compat/app";

import "firebase/compat/auth";

import "firebase/compat/firestore";
import Lottie from "lottie-react-native";
import useCurrentUser from "../hooks/useCurrentUser";
import Post from "../components/Post";
import Loading from "../components/Loading";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type RateServiceRouteProp = RouteProp<RootStackParamList, "RateServiceRoute">;

interface Props {
    route?: RateServiceRouteProp;
}
type ImageViewType = {
    uri: string;
};

const RateService: FC<Props> = (props) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const uuid = uuidv4();
    const storage = getStorage();
    // const navigation = useNavigation();
    const [comment, setComment] = useState("");
    const [rate, setRate] = useState(0);
    const [visible, setIsVisible] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [sent, setSent] = useState(false);
    const imagesArr: ImageViewType[] = [];
    const user = useCurrentUser();
    const animationRef = useRef<Lottie>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const isServiceRatedBefore = (): Boolean => {
        // let rateQuery = query(
        //     collection(db, "rates"),
        //     where("user", "in", batch)
        // );
        if (user?.ratedServices?.includes(props.route?.params.serviceId)) {
            // console.log("service rated before");
            return true;
        } else {
            return false;
        }
    };
    // console.log(user.ratedServices);

    useEffect(() => {
        animationRef.current?.play();
        animationRef.current?.play(0, 120);
        images?.forEach((image: string) => {
            imagesArr.push({ uri: image });
        });
    }, [images, sent]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `Rate ${props.route?.params.serviceName}`,
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    }, []);

    const pickImage = async () => {
        setIsLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.5,
            allowsMultipleSelection: true,
            selectionLimit: 6,
            orderedSelection: true,
        });
        if (!result.canceled) {
            const imgArr: any[] = [];
            result.assets.forEach(async (image: any) => {
                imgArr.push(image.uri);
            });
            setImages(imgArr);

            const source = { uri: result.assets[0].uri };
            // console.log(source.uri);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };
    const upload = async () => {
        let url1: any[] = [];
        isServiceRatedBefore();
        for (let i = 0; i < images?.length; i++) {
            const response = await fetch(images[i] as any);
            const blob = await response.blob();
            const filename = `/rates/${uuid}/${i}`;
            const imageRef = ref(storage, filename);
            await uploadBytes(imageRef, blob);
            await getDownloadURL(imageRef)
                .then(async (url: string) => {
                    url1.push(await url);
                    // console.log("URL:" + url)
                })
                .catch((error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case "storage/object-not-found":
                            console.log("File doesn't exist");
                            break;
                        case "storage/unauthorized":
                            console.log(
                                "User doesn't have permission to access the object"
                            );
                            break;
                        case "storage/canceled":
                            console.log("User canceled the upload");
                            break;

                        // ...

                        case "storage/unknown":
                            console.log(
                                "Unknown error occurred, inspect the server response"
                            );
                            break;
                    }
                });
        }
        return url1;
    };
    const sendRate = async () => {
        const totalRateAfter = props.route?.params.totalRate || 0 + rate;
        const rateLenAfter = props.route?.params.rateLen || 0 + 1;
        setSent(true);
        const imgurl = await upload();
        try {
            db.collection("rates")
                .doc(uuid)
                .set({
                    rateId: uuid,
                    comment: comment,
                    rate: rate,
                    service: db.doc(
                        "services/" + props.route?.params.serviceId
                    ),
                    user: db.doc("users/" + auth.currentUser?.uid),
                    dateString: new Date().toDateString(),
                    serverTimestamp: serverTimestamp(),
                    images: imgurl,
                });
        } catch (e) {
            console.error("error", e);
        }
        // console.log(props.route?.params.serviceId);
        db.collection("services")
            .doc(props.route?.params.serviceId)
            .update({
                rates: arrayUnion(db.doc("rates/" + uuid)),
                rateLen: increment(1),
                totalRate: increment(rate),
                generalRate: totalRateAfter / rateLenAfter,
            });
        db.collection("users")
            .doc(auth.currentUser?.uid)
            .update({
                points: isServiceRatedBefore() ? increment(1) : increment(5),
                ratedServices: arrayUnion(props.route?.params.serviceId),
                rates: arrayUnion(db.doc("rates/" + uuid)),
            });
        setSent(false);
        navigation.navigate("Success", {
            serviceName: props.route?.params.serviceName,
        } as never);
    };

    const removeImage = (imageToRemove: string) => {
        const updatedImages = images.filter(
            (image: string) => image !== imageToRemove
        );
        setImages(updatedImages);
    };

    return !user || sent ? (
        <Loading />
    ) : (
        <>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "padding"}
                >
                    <View style={styles.rateContainer}>
                        <Avatar
                            source={{
                                uri: props.route?.params.serviceImage as string,
                            }}
                            size={80}
                            rounded
                        />
                        <Text style={styles.serviceName}>
                            {props.route?.params.serviceName}
                        </Text>
                        <View style={styles.rate}>
                            <Button
                                icon={
                                    <Ionicons
                                        name="star"
                                        color={rate < 1 ? "#D9D9D9" : "#2161BF"}
                                        size={40}
                                    />
                                }
                                buttonStyle={{ backgroundColor: "transparent" }}
                                onPress={() => setRate(1)}
                            />
                            <Button
                                icon={
                                    <Ionicons
                                        name="star"
                                        color={rate < 2 ? "#D9D9D9" : "#2161BF"}
                                        size={40}
                                    />
                                }
                                buttonStyle={{ backgroundColor: "transparent" }}
                                onPress={() => setRate(2)}
                            />
                            <Button
                                icon={
                                    <Ionicons
                                        name="star"
                                        color={rate < 3 ? "#D9D9D9" : "#2161BF"}
                                        size={40}
                                    />
                                }
                                buttonStyle={{ backgroundColor: "transparent" }}
                                onPress={() => setRate(3)}
                            />
                            <Button
                                icon={
                                    <Ionicons
                                        name="star"
                                        color={rate < 4 ? "#D9D9D9" : "#2161BF"}
                                        size={40}
                                    />
                                }
                                buttonStyle={{ backgroundColor: "transparent" }}
                                onPress={() => setRate(4)}
                            />
                            <Button
                                icon={
                                    <Ionicons
                                        name="star"
                                        color={rate < 5 ? "#D9D9D9" : "#2161BF"}
                                        size={40}
                                    />
                                }
                                buttonStyle={{ backgroundColor: "transparent" }}
                                onPress={() => setRate(5)}
                            />
                        </View>
                    </View>
                    <View style={styles.comment}>
                        <Input
                            onChangeText={(text) => setComment(text)}
                            maxLength={300}
                            numberOfLines={3}
                            multiline={true}
                            placeholder="Write a comment..."
                            inputStyle={{
                                fontSize: 16,
                                fontFamily: "Montserrat_Regular",
                            }}
                            scrollEnabled
                            style={{
                                fontFamily: "Montserrat_Regular",
                            }}
                            containerStyle={styles.comment}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                        />
                    </View>

                    <Button
                        onPress={() => pickImage()}
                        style={{
                            width: "30%",
                            borderRadius: 10,
                        }}
                        buttonStyle={{
                            backgroundColor: "#2161BF",
                            width: 150,
                            margin: 20,
                        }}
                        title={"Add a photo"}
                        titleStyle={{
                            fontSize: 12,
                            fontFamily: "Montserrat_Regular",
                        }}
                        icon={
                            <MaterialIcons
                                name="add-photo-alternate"
                                color={"white"}
                                size={24}
                            />
                        }
                    />
                    {isLoading ? (
                        <View
                            style={{
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                height: 100,
                            }}
                        >
                            <Lottie
                                ref={animationRef}
                                autoPlay
                                loop
                                speed={2}
                                resizeMode={"contain"}
                                source={require("../assets/images/star.json")}
                                style={{
                                    width: 200,
                                    height: 200,
                                    justifyContent: "flex-start",
                                }}
                            />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            contentContainerStyle={{ width: "100%" }}
                        >
                            {images.map((image: string) => (
                                <View key={images.indexOf(image)}>
                                    <TouchableOpacity
                                        onPress={() => setIsVisible(true)}
                                    >
                                        <Image
                                            source={{ uri: image }}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                marginLeft: 20,
                                                borderRadius: 10,
                                                marginTop: 20,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => removeImage(image)}
                                    >
                                        <Ionicons
                                            name="remove-circle"
                                            color={"gray"}
                                            size={25}
                                            style={{
                                                top: -110,
                                                left: 110,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    <View
                        style={
                            comment.length > 0
                                ? { paddingVertical: 100 }
                                : { display: "none" }
                        }
                    >
                        <Text> </Text>
                    </View>
                    <View>
                        <ImageView
                            images={imagesArr}
                            imageIndex={0}
                            visible={visible}
                            onRequestClose={() => setIsVisible(false)}
                        />
                    </View>
                </KeyboardAvoidingView>
                <View style={{ padding: 100 }}></View>
            </ScrollView>
            <View style={styles.send}>
                <Button
                    style={{
                        paddingTop: 20,
                        width: "90%",
                        borderRadius: 10,
                        alignSelf: "center",
                    }}
                    titleStyle={{ fontFamily: "Montserrat_Regular" }}
                    buttonStyle={{ backgroundColor: "#2161BF" }}
                    title={"Send"}
                    disabled={rate == 0 || sent ? true : false}
                    onPress={sendRate}
                />
            </View>
        </>
    );
};

export default RateService;

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        height: "100%",
        paddingBottom: 100,
    },
    rateContainer: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
    },
    serviceName: {
        fontFamily: "Montserrat_Regular",
        fontSize: 24,
        paddingVertical: 10,
    },
    rate: {
        flexDirection: "row",
        paddingVertical: 10,
    },
    comment: {
        marginTop: 20,
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 10,
        fontFamily: "Montserrat_Regular",
    },
    send: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        width: "100%",
        height: 100,
    },
});
