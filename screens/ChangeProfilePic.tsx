import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, useLayoutEffect } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import useUser from "../hooks/useUser";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from "@firebase/storage";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import useCurrentUser from "../hooks/useCurrentUser";
type ChangeProfilePicRoute = RouteProp<
    RootStackParamList,
    "ChangeProfilePicRoute"
>;

interface Props {
    route?: ChangeProfilePicRoute;
}
const ChangeProfilePic: FC<Props> = (props) => {
    const navigation = useNavigation();
    const user = useCurrentUser();
    const storage = getStorage();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Profile picture confirmation",
            headerRight: () => (
                <TouchableOpacity onPress={upload}>
                    <Text style={{fontWeight: "bold", color: "#2161BF"}}>Confirm</Text>
                </TouchableOpacity>
            ),
        });
    }, [props.route?.params.profilePic]);

    const upload = async () => {
        const response = await fetch(props.route?.params.profilePic as any);
        const blob = await response.blob();
        const filename = `profilePics/${auth.currentUser?.uid}`;
        const imageRef = ref(storage, filename);
        await uploadBytes(imageRef, blob).then(async (snapshot) => {

        });
        let url1;
        await getDownloadURL(imageRef)
            .then(async (url: string) => {
                // setUserProfilePic(await url);
                url1 = url;
            })
            .catch((error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/object-not-found":
                        break;
                    case "storage/unauthorized":
                        console.log(
                            "User doesn't have permission to access the object"
                        );
                        break;
                    case "storage/canceled":
                        console.log("User canceled the upload");
                        break;

                    // ...

                    case "storage/unknown":
                        console.log(
                            "Unknown error occurred, inspect the server response"
                        );
                        break;
                }
            });
        db.collection("users").doc(auth.currentUser?.uid).update({
            profilePicURL: url1,
        });
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: props.route?.params.profilePic }}
                style={{
                    width: "100%",
                    height: "50%",
                }}
            />
        </View>
    );
};

export default ChangeProfilePic;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
