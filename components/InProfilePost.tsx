import {
    Alert,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useUser from "../hooks/useUser";
import useService from "../hooks/useService";
import Stars from "./Stars";
import useRate from "../hooks/useRate";
import { Entypo } from "@expo/vector-icons";

import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDocs,
    increment,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { Image } from "react-native";
import ImageView from "react-native-image-viewing";
import { useActionSheet } from "@expo/react-native-action-sheet";
import useCurrentUser from "../hooks/useCurrentUser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
interface PostProps {
    rate: any;
    user: any;
    serviceId: string;
}
type ImageViewType = {
    uri: string;
};

const InProfilePost = ({ user, rate, serviceId }: PostProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [service, setService] = useState<any>();
    const [visible, setIsVisible] = useState(false);
    const { showActionSheetWithOptions } = useActionSheet();
    const imagesArr: ImageViewType[] = [];
    rate?.images?.forEach((image: string) => {
        imagesArr.push({ uri: image });
    });
    // const followedUsers: any[] = [];
    // currentUser?.followedUsers.forEach((FollowedUser: any) =>{
    //     followedUsers.push(FollowedUser.id)
    // })
    const q = query(
        collection(db, "services"),
        where("id", "==", rate?.service?.id)
    );
    useEffect(() => {
        const getService = async () => {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc: any) => {
                setService(doc.data());
            });
        };
        getService();
    }, []);
    const createTwoButtonAlert = () =>(
        Alert.alert("Are you sure you want to delete this rate?", "", [
            {
                text: "Cancel",
                // onPress: () => console.log('Cancel Pressed'),
                style: "cancel",
            },
            {
                text: "Delete",
                onPress: deleteRate,
                style: "destructive",
            },
        ]));
    let rateN = rate.rate;
    const deleteRate = () => {
        const totalRateAfter = service.totalRate - rateN;
        const rateLenAfter = service.rateLen - 1;
        db.collection("users")
        .doc(auth.currentUser?.uid)
        .update({
            points: user?.points > 5 ? increment(-5) : 0,
            rates: arrayRemove(db.doc("rates/" + rate.rateId)),
        });
        db.collection("services")
        .doc(rate.service?.id)
        .update({
            rates: arrayRemove(db.doc("rates/" + rate.rateId)),
            rateLen: increment(-1),
            totalRate: increment( -rateN),
            generalRate: totalRateAfter / rateLenAfter
        });
        db.collection("rates").doc(rate.rateId).delete();
    };

    const share = async() => {
        const shareOptions = {
            message: 
            `${user?.name} ${rate?.comment !== "" ? 
            "rated " + service?.name + " as " + rate.rate + (rate.rate === 1 ? " star and commented : " + rate.comment : " stars and commented : " + rate.comment)  
            : "rated " + service?.name + " as " + rate.rate + (rate.rate === 1 ? " star " : " stars ") 
        } 
        \n \n \n Download Rate-it`
        };
        try{
            const shareResponse = await Share.share(shareOptions)
            // console.log(JSON.stringify(shareResponse))
        }catch(error) {
            console.log(error)
        }
    };

    // const unfollow = () => {
    //     db.collection("users")
    //         .doc(auth.currentUser?.uid)
    //         .update({
    //             followedUsers: arrayRemove(db.doc("users/" + user?.uid)),
    //         });
    // };

    // const follow = () =>{
    //     db.collection("users")
    //         .doc(auth.currentUser?.uid)
    //         .update({
    //             followedUsers: arrayUnion(db.doc("users/"+ user?.uid))
    //         })
    // }
    
    const postOptions = () => {
        const options = ["Share", "Report", "Cancel"];
        const destructiveButtonIndex = options.length - 2;
        const cancelButtonIndex = options.length - 1;
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
            },
            (selectedIndex: any) => {
                switch (selectedIndex) {
                    case 0:
                        share();
                        break;
                    case 1:
                        navigation.navigate("Report", { rate })
                        break;
                    

                    case cancelButtonIndex:

                    // Canceled
                }
            }
        );
    };

    const myPostOptions = () => {
        const options = ["Share", `Delete rate`, "Cancel"];
        const destructiveButtonIndex = options.length - 2;
        const cancelButtonIndex = options.length - 1;
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
            },
            (selectedIndex: any) => {
                switch (selectedIndex) {
                    case 0:
                        // console.log("Share");
                        share();
                        break;

                    case destructiveButtonIndex:
                        createTwoButtonAlert();
                        break;

                    case cancelButtonIndex:
                }
            }
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.postHeader}>
                <View style={{ flexDirection: "row", width: "90%", flexWrap: "wrap" }}>
                    <TouchableOpacity>
                        <Text
                            style={{
                                color: "#2161BF",
                                fontFamily: "Montserrat_SemiBold",
                            }}
                        >
                            {user.name}{" "}
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "Montserrat_Regular" }}>
                        {rate.comment === "" ? "rated" : "commented on"}{" "}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                "ServiceProfile",
                                {
                                    // serviceName: "waffly",
                                    serviceId: service?.id,
                                }
                            )
                        }
                    >
                        <Text
                            style={{
                                color: "#2161BF",
                                fontFamily: "Montserrat_SemiBold",
                            }}
                        >
                            {service?.name}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                    onPress={
                        user?.uid === auth.currentUser?.uid
                            ? myPostOptions
                            : postOptions
                    }
                    >
                        <Entypo
                            name="dots-three-horizontal"
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.post}>
                <View style={styles.userInfo}>
                    <Avatar
                        source={{ uri: user?.profilePicURL } as any}
                        rounded
                        size={30}
                    />
                    <View
                        style={{
                            margin: 10,
                            marginVertical: 15,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity>
                            <Text
                                style={{
                                    color: "#2161BF",
                                    fontFamily: "Montserrat_SemiBold",
                                }}
                            >
                                {user.name}{" "}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "Montserrat_Regular" }}>
                            | {user.points}
                        </Text>
                    </View>
                    <View
                        style={{
                            alignSelf: "center",
                            justifyContent: "flex-end",
                            width: "100%",
                            flex: 1,
                            opacity: 0.5,
                        }}
                    >
                        <Text
                            style={{
                                justifyContent: "flex-end",
                                alignSelf: "flex-end",
                                fontFamily: "Montserrat_Regular"
                            }}
                        >
                            {rate.dateString}
                        </Text>
                    </View>
                </View>
                <Stars rate={rate.rate} />
                {rate.comment !== "" && (
                    <Text style={{ fontFamily: "Montserrat_Regular" }}>
                        {rate.comment}
                    </Text>
                )}
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {rate.images?.map((image: string) => (
                        <View key={image.charAt(119)}>
                            <TouchableOpacity
                                onPress={() => setIsVisible(!visible)}
                            >
                                <Image
                                    source={{ uri: image }}
                                    // source={{uri: "https://lh3.googleusercontent.com/p/AF1QipNAW3cn5HtgMZhbqVvPSKXizr6SAcJvvk7aNR81=w1080-h608-p-no-v0"}}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        marginRight: 5,
                                        marginVertical: 2.5,
                                        borderRadius: 10,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View>
                        {/* <StatusBar barStyle={"light-content"} translucent /> */}
                        <ImageView
                            images={imagesArr}
                            imageIndex={0}
                            visible={visible}
                            onRequestClose={() => setIsVisible(false)}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default InProfilePost;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 5,
        fontFamily: "Montserrat_Regular",
    },
    postHeader: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 10,
        padding: 15,
        marginBottom: 5,
        flexDirection: "row",
        fontFamily: "Montserrat_Regular",
        justifyContent: "space-between",
        alignItems: "center",
    },
    post: {
        paddingBottom: 15,
        paddingHorizontal: 15,
        paddingTop: 3,
        borderRadius: 10,
        marginBottom: 10,
        width: "90%",
        backgroundColor: "white",
    },
    userInfo: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    rate: {
        flexDirection: "row",
        paddingVertical: 15,
    },
    linkToProfile: {
        color: "#2161BF",
    },
});
