// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useLayoutEffect } from "react";
// import UserCard from "../components/UserCard";
// import useCurrentUser from "../hooks/useCurrentUser";
// import { useNavigation } from "@react-navigation/native";

// const FollowedUsers = () => {
//     const navigation = useNavigation();
//     useLayoutEffect(() =>{
//         navigation.setOptions({
//             headerTitleStyle:{
//                 fontFamily: "Montserrat_Regular"
//             }
//         })
//     })
//     const user = useCurrentUser();
//     const followedUsers: any[] = [];
//     user?.followedUsers.forEach((FollowedUser: any) =>{
//         followedUsers.push(FollowedUser.id)
//     })
//     return (
//         <ScrollView contentContainerStyle={{paddingTop: 20}}>
//             {followedUsers.map((followedUser) =>(
//                 <UserCard userId={followedUser} key={followedUser}/>
//             ))}            
//         </ScrollView>
//     );
// };

// export default FollowedUsers;

// const styles = StyleSheet.create({});
