import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Stars from "./Stars";
import { collection, getDocs, query, where } from "firebase/firestore";
import useCurrentUser from "../hooks/useCurrentUser";
import useUser from "../hooks/useUser";
import ImageView from "react-native-image-viewing";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface PostProps {
    userId: string | undefined | null;
    comment: string;
    rate: number;
    serviceId: string | undefined | null;
    dateString: string;
    images: string[]
}
type ImageViewType = {
    uri: string
} 

const Post = ({ userId, comment, rate, dateString, images }: PostProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const user = useUser(userId);
    const [visible, setIsVisible] = useState(false);
    const imagesArr: ImageViewType[] = [];
    images?.forEach((image: string) =>{
        imagesArr.push({uri: image})
    })
    return (
        <View style={styles.container}> 
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
                        <TouchableOpacity
                            onPress={() => userId != auth.currentUser?.uid ? navigation.navigate("OtherUserProfile", {
                                userId: userId
                            }) : navigation.navigate("UserProfileStack") }
                        >
                            <Text style={{ color: "#2161BF", fontFamily: "Montserrat_SemiBold" }}>
                                {user?.name}{" "}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{fontFamily: "Montserrat_Regular"}}>| {user?.points}</Text>
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
                                }}
                            >
                                {dateString}
                            </Text>
                        </View>
                    
                </View>
                <Stars rate={rate} />
                <Text style={{fontFamily: "Montserrat_Regular"}}>
                    {comment}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {images?.map((image: string) => (
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

export default Post;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 5,
        fontFamily: "Montserrat_Regular"
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
