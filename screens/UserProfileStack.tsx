import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Avatar, Button } from "react-native-elements";
import FeedPost from "../components/FeedPost";
import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import useCurrentUser from "../hooks/useCurrentUser";
import InProfilePost from "../components/InProfilePost";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from "@firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { updateCurrentUser, updateProfile, User } from "firebase/auth";

const UserProfileStack = ({ navigation }: any) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    });
    const [refresh, setRefresh] = useState(false);
    const [posts, setPosts] = useState<any>();
    const uesrDocRef = doc(db, "users", `${auth.currentUser?.uid}`);
    const user = useCurrentUser();
    const pullToRefresh = async () => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 4000);
    };
    const serviceQuery = query(
        collection(db, "rates"),
        orderBy("serverTimestamp", "desc"),
        where("user", "==", uesrDocRef)
    );
    useEffect(() => {
        const getPosts = async () => {
            const querySnapshot = await getDocs(serviceQuery);
            const data: any[] = [];
            querySnapshot.forEach((doc: any) => {
                const rate = doc.data();
                const service = doc.data().service.id;
                data.push({ rate, service });
            });
            setPosts(data);
        };
        getPosts();
    }, [refresh, user?.profilePic]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Your Profile",
        });
    }, []);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            allowsMultipleSelection: false,
            aspect: [3, 3],
        });

        if (!result.canceled) {
            const source = { uri: result.assets[0].uri };

            navigation.navigate(
                "ChangeProfilePic" as never,
                {
                    profilePic: `${source.uri}`,
                } as never
            );
            // await upload();
        }
    };
    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => pullToRefresh()}
                />
            }
        >
            <View style={styles.container}>
                <View style={styles.userCard}>
                    <View style={styles.userCardInner}>
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                source={{ uri: user?.profilePicURL } as any}
                                size={80}
                                rounded
                            />
                            {/* <TouchableOpacity onPress={() => pickImage()}>
                                <Text>edit</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity onPress={() => upload()}>
                                <Text>upload</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View>
                            <Text style={styles.cardText}>
                                Welcome,{"\n"}
                                {user?.name}
                            </Text>
                            <Text style={{ fontFamily: "Montserrat_Regular" }}>
                                Points: {user?.points}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            {posts?.map((post: any) => (
                <InProfilePost
                    key={post.rate?.rateId}
                    rate={post.rate}
                    user={user}
                    serviceId={post.rate.service.id}
                />
            ))}
        </ScrollView>
    );
};

export default UserProfileStack;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    userCard: {
        backgroundColor: "white",
        width: "100%",
        padding: 20,
        height: 180,
        marginBottom: 20,
    },
    userCardInner: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100%",
    },
    cardText: {
        fontWeight: "700",
        fontSize: 20,
        fontFamily: "Montserrat_SemiBold",
    },
});
