import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import useUser from "../hooks/useUser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type UserCardProps = {
    userId: string;
};
const UserCard = ({ userId }: UserCardProps) => {
    // const navigation = useNavigation();
    const user = useUser(userId);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() =>
                navigation.navigate("OtherUserProfile" , {
                    userId: userId,
                })
            }
        >
            <Avatar
                source={{ uri: user?.profilePicURL } as any}
                size={80}
                rounded
            />
            
            <View style={{ justifyContent: "center" }}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={{ fontFamily: "Montserrat_Light" }}>
                    Points: {user?.points}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default UserCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row",
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        padding: 50,
        justifyContent: "space-around",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        paddingBottom: 10,
        fontFamily: "Montserrat_Regular",
    },
});
