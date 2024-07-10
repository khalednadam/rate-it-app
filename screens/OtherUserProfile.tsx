import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { Avatar, Button } from "react-native-elements";
import FeedPost from "../components/FeedPost";
import { auth, db } from "../firebase";
import { RouteProp, useNavigation } from "@react-navigation/core";
import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { RootStackParamList } from "../App";
import useCurrentUser from "../hooks/useCurrentUser";
import InProfilePost from "../components/InProfilePost";
import Loading from "../components/Loading";

type OtherUserProfileProps = RouteProp<
    RootStackParamList,
    "OtherUserProfileRoute"
>;
interface Props {
    route?: OtherUserProfileProps;
}
const OtherUserProfile: FC<Props> = (props) => {
    const navigation = useNavigation();
    const [user, setUser] = useState<any>();
    // const [following, setFollowing] = useState<boolean>(false);
    const [posts, setPosts] = useState<any>();
    if(user?.uid === auth.currentUser?.uid){
        navigation.navigate("Your Profile" as never);
    }

    const currentUser = useCurrentUser();

    const q = query(
        collection(db, "users"),
        where("uid", "==", props.route?.params.userId)
    );

    const userDocRef = doc(db, "users", `${user?.uid}`);

    const ratesQuery = query(
        collection(db, "rates"),
        orderBy("serverTimestamp", "desc"),
        where("user", "==", userDocRef)
    );
    useEffect(() => {
        // const checkFollowing = async () => {
        //     const querySnapshot = await getDocs(q);
        //     querySnapshot.forEach(async (doc: any) => {
        //         setUser(await doc.data());
        //         currentUser?.followedUsers.map(async (followedUser: any) => {
        //             if (followedUser?.id === user?.uid) {
        //                 setFollowing(true);
        //             }
        //         });
        //     });
        // };
        const getPosts = async () => { 
            const querySnapshot = await getDocs(ratesQuery);
            const data: any[] = [];
            querySnapshot.forEach((doc: any) => {
                const rate = doc.data();
                const service = doc.data().service.id;

                data.push({ rate, service });
            });
            setPosts(data);
        };
        getPosts();
        // checkFollowing();
    }, [user?.uid]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `${user?.name}`,
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    }, [user]);
    // const follow = () => {
    //     db.collection("users")
    //         .doc(auth.currentUser?.uid)
    //         .update({
    //             followedUsers: arrayUnion(
    //                 db.doc("users/" + props.route?.params.userId)
    //             ),
    //         });
    //     setFollowing(true);
    // };
    // const unfollow = () =>{
    //     db.collection("users")
    //     .doc(auth.currentUser?.uid)
    //     .update({
    //         followedUsers: arrayRemove(
    //             db.doc("users/" + props.route?.params.userId)
    //         ),
    //     });
    //     setFollowing(false);
    // }
    return (
        user == undefined || !user ?
        <Loading /> :
        <ScrollView contentContainerStyle={{paddingBottom: 50}}>
            <View style={styles.container}>
                <View style={styles.userCard}>
                    <View style={styles.userCardInner}>
                        <Avatar
                            source={{ uri: user?.profilePicURL } as any}
                            size={80}
                            rounded 
                        />
                        <View>
                            <Text style={styles.cardText}>{user?.name}</Text>
                            <Text style={{ fontFamily: "Montserrat_Regular" }}>
                                Points: {user?.points}
                            </Text>
                            
                        </View>
                    </View>
                </View>
            </View>
            {posts?.map((post: any) => (
                <InProfilePost
                    key={post.rate.rateId}
                    rate={post.rate}
                    user={user} 
                    serviceId={post.rate.service.id}
                />
            ))}
        </ScrollView>
    );
};

export default OtherUserProfile;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        // paddingBottom: 10
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
        fontFamily: "Montserrat_Regular",
    },
});
