// import {
//     ScrollView,
//     StyleSheet,
//     View,
//     Image,
//     Text,
//     TouchableOpacity,
//     RefreshControl,
//     Platform,
// } from "react-native";
// import React, {
//     useCallback,
//     useEffect,
//     useLayoutEffect,
//     useRef,
//     useState,
// } from "react";
// import { db } from "../firebase";
// import FeedPost from "../components/FeedPost";
// import { useNavigation } from "@react-navigation/native";
// import Logo from "../assets/images/logo.png";
// import { Ionicons } from "@expo/vector-icons";
// import { StatusBar } from "expo-status-bar";
// import {
//     doc,
//     query,
//     collection,
//     where,
//     getDocs,
//     orderBy,
// } from "firebase/firestore";
// import useCurrentUser from "../hooks/useCurrentUser";
// import Loading from "../components/Loading";
// import { Button } from "react-native-elements";
// import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
// import PointsBottomSheet from "./PointsBottomSheet";
// import * as Notifications from "expo-notifications";

// const Home = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [refresh, setRefresh] = useState(false);
//     const navigation = useNavigation();
//     const sheetRef = useRef<BottomSheet>(null);

//     let user = useCurrentUser();
//     let followedUsers: any[] = [doc(db, "users", `${user?.uid}`)];
//     const [rates, setRates] = useState<any[]>();
//     user?.followedUsers.forEach(async (followedUser: any) => {
//         followedUsers.push(doc(db, "users", `${followedUser?.id}`));
//     });

//     const handleSnapPress = useCallback((index: number) => {
//         sheetRef.current?.snapToIndex(index);
//         setIsOpen(true);
//     }, []);
//     // let rateQuery = query(
//     //     collection(db, "rates"),
//     //     orderBy("serverTimestamp", "desc"),
//     //     where("user", "in", followedUsers)
//     // );
 
//     const pullToRefresh = () => {
//         setRefresh(true);
//         setRates([]);
//         followedUsers = [];
//         user?.followedUsers.forEach(async (followedUser: any) => {
//             followedUsers.push(doc(db, "users", `${followedUser?.id}`));
//         });
//         getRate();
//         setTimeout(() => {
//             setRefresh(false);
//         }, 4000);
//     };
//     // ! TODO: Fix
//     const getRate = async () => {
//         // setRefresh(true)
//         const ratesArr: any[] = [];
//         while (followedUsers.length) {
//             const batch = followedUsers.splice(0, 10);
//             let rateQuery = query(
//                 collection(db, "rates"),
//                 orderBy("serverTimestamp", "desc"),
//                 where("user", "in", batch)
//             );
//             const querySnapshot = await getDocs(rateQuery);
//             querySnapshot.forEach((doc: any) => {
//                 ratesArr.push(doc.data());
//             });
//         }
//         setRates(ratesArr);
//         // setRefresh(false)
//     };
//     console.log(user?.points);
//     useEffect(() => {
//         getRate();
//         console.log("refreshed");
//         const subscription = Notifications.addNotificationResponseReceivedListener(async(notification) => {
//             // console.log(notification);
//             console.log(notification.notification.request.content.data.serviceId)
//             navigation.navigate("ServiceProfile" as never, {
//                 serviceId: notification.notification.request.content.data.serviceId as any
//             } as never)
//           });
//           return () => subscription.remove();
//     }, [user, refresh]);
//     useLayoutEffect(() => {
//         navigation.setOptions({
//             tabBarStyle: {
//                 display: isOpen ? "none" : "flex",
//             },
//             tabBarIcon: ({ color, focused }: any) => (
//                 <Ionicons
//                     name={focused ? "home" : "home-outline"}
//                     size={20}
//                     color={focused ? "#2161BF" : color}
//                 />
//             ),
//             headerTitleStyle: { fontSize: 0 },
//             headerTitle: "",
//             headerRight: () => (
//                 <View
//                     style={{
//                         justifyContent: "center",
//                         alignItems: "center",
//                         flexDirection: "row",
//                     }}
//                 >
//                     <View>
//                         <TouchableOpacity
//                             style={{ marginRight: 20 }}
//                             onPress={() =>
//                                 navigation.navigate("SearchForService" as never)
//                             }
//                         >
//                             <Ionicons name="search" size={25} />
//                         </TouchableOpacity>
//                     </View>
//                     <TouchableOpacity
//                         onPress={() => Platform.OS == "ios" ? handleSnapPress(0) : null}
//                         style={{
//                             backgroundColor: "#D9D9D9",
//                             borderRadius: 100,
//                             width: 50,
//                             height: 30,
//                             marginRight: 30,
//                             justifyContent: "center",
//                             alignItems: "center",
//                         }}
//                     >
//                         <Text style={{ fontFamily: "Montserrat_Regular" }}>
//                             {user?.points}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             ),
//             headerLeft: () => (
//                 <View
//                     style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         paddingLeft: 30,
//                     }}
//                 >
//                     <Image source={Logo} style={{ height: 25, width: 25 }} />
//                     <Text
//                         style={{
//                             padding: 5,
//                             fontSize: 28,
//                             fontWeight: "300",
//                             fontFamily: "Montserrat_Regular",
//                         }}
//                     >
//                         Rate-it
//                     </Text>
//                     <StatusBar style="dark" translucent />
//                 </View>
//             ),
//         });
//     }, [user, refresh, isOpen, user?.points]);
//     return !rates || !user ? (
//         <Loading />
//     ) : (
//         <>
            
//             {rates.length === 0 ?
//             <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
//                 <Text style={{fontFamily:"Montserrat_Regular"}}>
//                     No rates yet
//                 </Text>
//                 <Button 
//                     title={"Explore services"}
//                     buttonStyle={{backgroundColor: "#2161BF"}}
//                     onPress={() => navigation.navigate("Categories" as never)}
//                 />
//             </View> :
//              <ScrollView
//                 scrollEnabled={!isOpen}
//                 style={
//                     isOpen ? styles.scrollContainerOpen : styles.scrollContainer
//                 }
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refresh}
//                         onRefresh={() => pullToRefresh()}
//                     />
//                 }
//             >
//                 {rates?.map((rate: any) => (
//                     <FeedPost key={rate?.rateId} rate={rate} />
//                 ))}
//             </ScrollView>}
//             <PointsBottomSheet
//                 points={user?.points}
//                 open={isOpen}
//                 setOpen={setIsOpen}
//                 sheetRef={sheetRef}
//             />
//         </>
//     );
// };

// export default Home;

// const styles = StyleSheet.create({
//     scrollContainer: {
//         paddingTop: 10,
//         paddingBottom: 10,
//     },
//     noRates: {
//         justifyContent: "center",
//         alignItems: "center",
//         flex: 1,
//     },
//     scrollContainerOpen: {
//         paddingTop: 10,
//         opacity: 0.3,
//         flex: 1,
//     },
// });
