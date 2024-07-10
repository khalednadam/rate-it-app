import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Avatar, Button } from "react-native-elements";
import Post from "../components/Post";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import Stars from "../components/Stars";
import { collection, doc, getDocs, orderBy, query, where, serverTimestamp } from "firebase/firestore";
import useService from "../hooks/useService";
import Loading from "../components/Loading";
import FeedPost from "../components/FeedPost";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ServiceProfileRoute = RouteProp<RootStackParamList, "ServiceProfileRoute">;

interface Props {
    route?: ServiceProfileRoute;
}

const ServiceProfile: FC<Props> = (props) => {
    const [posts, setPosts] = useState<any>();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [refresh, setRefresh] = useState(false);
    const service = useService(props.route?.params.serviceId);
    const serviceDocRef = doc(
        db,
        "services",
        `${props.route?.params.serviceId}`
    );

    const serviceQuery = query(
        collection(db, "rates"),
        orderBy("serverTimestamp", "desc"),
        where("service", "==", serviceDocRef),
    );

    useEffect(() => {
        const getServiceRates = async () => {
            const querySnapshot = await getDocs(serviceQuery);
            const data: any[] = [];
            querySnapshot.forEach((doc: any) => {
                const rate = doc.data();
                const user = doc.data().user.id
                data.push({rate, user});
            });
            setPosts(data);
        };
        getServiceRates();
    }, [refresh]);

    const pullToRefresh = () =>{
        setRefresh(true);
        setPosts([]);
        setTimeout(() => {
            setRefresh(false);
        }, 4000);
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: ` ${service?.name}`,
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    }, [service?.name]);
    return (
        !service || service == undefined ?
        <Loading /> :
        <ScrollView contentContainerStyle={{paddingBottom: 30}}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => pullToRefresh()} />}
        >
            <View style={styles.serviceCard}>
                <View style={styles.serviceCardInner}>
                    <Avatar
                        source={{ uri: service?.servicePicURL } as any}
                        size={80}
                        rounded
                    />
                    <View>
                        <Text style={styles.cardText}>
                            {/* sdsd {serviceName1.name as string} */}
                            {service?.name}
                        </Text>
                        <Stars
                            rate={service?.generalRate as number}
                        />
                        <Button
                            title={"Rate it"}
                            titleStyle={{ fontFamily: "Montserrat_Regular" }}
                            buttonStyle={{ backgroundColor: "#3263AE" }}
                            onPress={() =>
                                navigation.navigate(
                                    "RateService",
                                    {
                                        serviceName: `${service?.name}`,
                                        serviceId: `${service?.id}`,
                                        generalRate: service?.generalRate,
                                        totalRate: service?.totalRate,
                                        rateLen: service?.rateLen,
                                        serviceImage: service?.servicePicURL
                                    } as never
                                )
                            }
                        />
                    </View>
                </View>
            </View>
            <View>
                <Text
                    style={{
                        marginLeft: 20,
                        marginBottom: 20,
                        fontSize: 24,
                        fontFamily: "Montserrat_Regular",
                    }}
                >
                    About
                </Text>
                <View style={styles.about}>
                    <Text style={styles.aboutText}>
                        {service?.description}
                    </Text>
                </View>
                <View>
                    <Text
                        style={{
                            marginLeft: 20,
                            marginVertical: 20,
                            fontSize: 24,
                            fontFamily: "Montserrat_Regular",
                        }}
                    >
                        Comments
                    </Text>
                </View>
                {posts?.map((post: any) => (
                    // <Post
                    //     key={post.rate.rateId}
                    //     userId={post.user}
                    //     comment={post.rate.comment}
                    //     rate={post.rate.rate}
                    //     serviceId={post.rate.service.id}
                    //     dateString={post.rate.dateString}
                    //     images={post.rate.images}
                    // />
                    <FeedPost rate={post.rate} key={post.rate.rateId} />
                ))}

            </View>
        </ScrollView>
    );
};

export default ServiceProfile;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // paddingTop: 20,
        justifyContent: "center",
        marginBottom: 50,
        fontFamily: "Montserrat_Regular",
    },
    serviceCard: {
        backgroundColor: "white",
        width: "100%",
        padding: 20,
        height: 180,
        marginBottom: 20,
        justifyContent: "center",
        fontFamily: "Montserrat_Regular",
    },
    serviceCardInner: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100%",
        fontFamily: "Montserrat_Regular",
    },
    cardText: {
        fontWeight: "700",
        fontSize: 20,
        textAlign: "left",
        width: "100%",
        fontFamily: "Montserrat_Regular",
    },
    about: {
        backgroundColor: "white",
        width: "90%",
        padding: 10,
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 10,
        fontFamily: "Montserrat_Regular",
    },
    rate: {
        flexDirection: "row",
        paddingVertical: 10,
    },
    aboutText: {
        fontFamily: "Montserrat_Regular",
    },
});