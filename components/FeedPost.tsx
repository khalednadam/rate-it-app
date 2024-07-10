import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Share,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { Avatar, Image } from "react-native-elements";
import { auth, db } from "../firebase";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import useUser from "../hooks/useUser";
import useService from "../hooks/useService";
import Stars from "./Stars";
import ImageView from "react-native-image-viewing";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { arrayRemove, arrayUnion, increment } from "firebase/firestore";
import useCurrentUser from "../hooks/useCurrentUser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import Share from "react-native-share";
interface PostProps {
    rate: any;
}

type ImageViewType = {
    uri: string;
};
const FeedPost = ({ rate }: PostProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const user = useUser(rate?.user.id);
    const service = useService(rate?.service?.id);
    const [visible, setIsVisible] = useState<boolean>(false);
    const imagesArr: ImageViewType[] = [];
    const { showActionSheetWithOptions } = useActionSheet();
    const currentUser = useCurrentUser();
    // const followedUsers: any[] = [];
    // currentUser?.followedUsers.forEach((FollowedUser: any) =>{
    //     followedUsers.push(FollowedUser.id)
    // })
    // console.log(rate.rateId);
    rate?.images?.forEach((image: string) => {
        imagesArr.push({ uri: image });
    });
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
                totalRate: increment(-rateN),
                generalRate: totalRateAfter / rateLenAfter,
            });
        db.collection("rates").doc(rate.rateId).delete();
    };

    const share = async () => {
        const shareOptions = {
            message: `${user?.name} ${
                rate?.comment !== ""
                    ? "rated " +
                      service?.name +
                      " as " +
                      rate.rate +
                      (rate.rate === 1
                          ? " star and commented : " + rate.comment
                          : " stars and commented : " + rate.comment)
                    : "rated " +
                      service?.name +
                      " as " +
                      rate.rate +
                      (rate.rate === 1 ? " star " : " stars ")
            } 
        \n \n \n Download Rate-it`,
        };
        try {
            const shareResponse = await Share.share(shareOptions);
            // console.log(JSON.stringify(shareResponse))
        } catch (error) {
            console.log(error);
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
                        navigation.navigate("Report", { rate: rate })
                        break;
                    

                    case cancelButtonIndex:
                        // console.log("Cancel");
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
                    <TouchableOpacity
                        onPress={() =>
                            user?.uid != auth.currentUser?.uid
                                ? navigation.navigate(
                                      "OtherUserProfile" ,
                                      {
                                          userId: user?.uid,
                                      }
                                  )
                                : navigation.navigate(
                                      "UserProfileStack"
                                  )
                        }
                    >
                        <Text
                            style={{
                                color: "#2161BF",
                                fontFamily: "Montserrat_SemiBold",
                            }}
                        >
                            {user?.name}{" "}
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
                                    serviceId: service.id,
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
                <View style={styles.userInfoContainer}>
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
                            <TouchableOpacity
                                onPress={() =>
                                    user?.uid != auth.currentUser?.uid
                                        ? navigation.navigate(
                                              "OtherUserProfile",
                                              {
                                                  userId: user?.uid,
                                              }
                                          )
                                        : navigation.navigate(
                                              "UserProfileStack" as never
                                          )
                                }
                            >
                                <Text
                                    style={{
                                        color: "#2161BF",
                                        fontFamily: "Montserrat_SemiBold",
                                    }}
                                >
                                    {user?.name}{" "}
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ fontFamily: "Montserrat_Regular" }}>
                                | {user?.points}
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
                </View>
                <View style={{ paddingTop: 10 }}>
                    <Stars rate={rate.rate} />
                </View>

                { rate.comment.length !== 0 && <Text style={{ fontFamily: "Montserrat_Regular", paddingBottom: 10 }}>
                    {rate.comment}
                </Text>}
                { rate.images.length !== 0 && <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {rate.images?.map((image: string) => (
                        <View key={image.charAt(119)}>
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
                                onPress={() => setIsVisible(!visible)}
                            />
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
                </View>}
            </View>
        </View>
    );
};

export default FeedPost;

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
    userInfoContainer: {
        justifyContent: "space-between",
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
