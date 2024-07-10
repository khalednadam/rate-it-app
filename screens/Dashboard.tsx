import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    RefreshControl,
    FlatList,
    SectionList,
} from "react-native";
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import useCurrentUser from "../hooks/useCurrentUser";
import Logo from "../assets/images/logo.png";
import { StatusBar } from "expo-status-bar";
import PointsBottomSheet from "./PointsBottomSheet";
import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import InProfilePost from "../components/InProfilePost";
const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    const sheetRef = useRef<BottomSheet>(null);
    const user = useCurrentUser();
    const uesrDocRef = doc(db, "users", `${auth.currentUser?.uid}`);
    const [posts, setPosts] = useState<any[]>();

    const pullToRefresh = () => {
        setRefresh(true);
        // user?.followedUsers.forEach(async (followedUser: any) => {
        //     followedUsers.push(doc(db, "users", `${followedUser?.id}`));
        // });
        // getRate();
        setTimeout(() => {
            setRefresh(false);
        }, 4000);
    };

    const _renderItem = ({ post }: any) =>{
        return <InProfilePost
        key={post?.rate.rateId}
        rate={post?.rate}
        user={user}
        serviceId={"094c2d26-0ceb-4f35-8c66-f73c798c3472"}
    />
    }
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
            tabBarStyle: {
                display: isOpen ? "none" : "flex",
            },

            tabBarIcon: ({ color, focused }: any) => (
                <Ionicons
                    name={focused ? "home" : "home-outline"}
                    size={20}
                    color={focused ? "#2161BF" : color}
                />
            ),
            headerTitleStyle: { fontSize: 0 },
            headerTitle: "",
            headerRight: () => (
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                    }}
                >
                    <View>
                        <TouchableOpacity
                            style={{ marginRight: 20 }}
                            onPress={() =>
                                navigation.navigate("SearchForService" as never)
                            }
                        >
                            <Ionicons name="search" size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
            ),
            headerLeft: () => (
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 30,
                    }}
                >
                    <Image source={Logo} style={{ height: 25, width: 25 }} />
                    <Text
                        style={{
                            padding: 5,
                            fontSize: 28,
                            fontWeight: "300",
                            fontFamily: "Montserrat_Regular",
                        }}
                    >
                        Rate-it
                    </Text>
                    <StatusBar style="dark" translucent />
                </View>
            ),
        });
    }, [user, refresh, isOpen, user?.points]);
    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => pullToRefresh()}
                />
            }
        >
            <View style={styles.userHeader}>
                <Image
                    source={{ uri: user?.profilePicURL }}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                />
                <Text style={styles.userName}>
                    Welcome, {"\n"}{" "}
                    <Text style={{ fontFamily: "Montserrat_Bold" }}>
                        {user?.name}
                    </Text>
                </Text>
            </View>
            <View style={styles.pointsCard}>
                <View
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Montserrat_Regular",
                            fontSize: 20,
                        }}
                    >
                        Your points:
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Montserrat_Bold",
                            fontSize: 20,
                            marginTop: 20,
                        }}
                    >
                        {user?.points}
                    </Text>
                </View>
            </View>
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text style={{ fontFamily: "Montserrat_Regular" }}>
                    Your rates
                </Text>
                <View style={{ width: "99%", marginTop: 20 }}>
                    {posts?.map((post: any) => (
                        <InProfilePost
                            key={post.rate?.rateId}
                            rate={post.rate}
                            user={user}
                            serviceId={post?.rate?.service?.id}
                        />
                    ))}
                   
                </View>
            </View>
        </ScrollView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    userHeader: {
        backgroundColor: "white",
        height: 200,
        margin: 20,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    userName: {
        fontFamily: "Montserrat_Regular",
        fontSize: 20,
    },
    pointsCard: {
        backgroundColor: "white",
        borderRadius: 20,
        marginHorizontal: 20,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
    },
});
