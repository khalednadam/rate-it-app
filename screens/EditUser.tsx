import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Input } from "react-native-elements";
import { auth, db } from "../firebase";
import useCurrentUser from "../hooks/useCurrentUser";
import { Button } from "react-native-elements";
import { updateEmail, updateProfile, User } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";
import Loading from "../components/Loading";

const EditUser = ({ navigation }: any) => {
    const storage = getStorage();
    const user = useCurrentUser();
    const [name, setName] = useState(user?.name); 
    const [email, setEmail] = useState(user?.email);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(user?.profilePicURL);
    useLayoutEffect(() => {
        
        navigation.setOptions({
            headerTitle: "Edit your account",
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    });
    useEffect(() =>{
        setName(user?.name)
        setEmail(user?.email)
        setImage(user?.profilePicURL)
    }, [user])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            allowsMultipleSelection: false,
            aspect: [3, 3] 
        });

        if (!result.canceled) {
            const source = { uri: result.assets[0].uri };
            setImage(source.uri)
        }
    };
    const upload = async () => {
        const response = await fetch(image as any);
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
                        console.log("File doesn't exist");
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

        return url1;
    };
    const updateUser = async () =>{
        setLoading(true)
        const profilePicURL = await upload();
        setLoading(false);
        db.collection("users").doc(auth.currentUser?.uid).update({
            name: name,
            email: email,
            profilePicURL: profilePicURL
        });
        updateProfile(auth.currentUser as User, {
            displayName: name,
            photoURL: profilePicURL
        })
        updateEmail(auth.currentUser as User, email);
        // await upload();
        navigation.navigate("Home")
    }
    return (
        loading ? 
        <Loading /> :
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={styles.inputContainer}
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                > 
                    <Avatar
                        source={{ uri: image } as any}
                        rounded
                        size={100}
                    />
                    <TouchableOpacity style={{paddingBottom: 20}} onPress={pickImage}>
                        <Text style={{padding: 5, fontFamily: "Montserrat_Regular"}}>
                            Change Profile Picture
                        </Text>
                    </TouchableOpacity>
                    <Input
                        onChangeText={(text) => setName(text)}
                        value={name}
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="name-phone-pad"
                        inputStyle={{ fontFamily: "Montserrat_Regular" }}
                        placeholder="Name"
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                            width: "100%",
                            alignSelf: "center",
                        }}
                        style={styles.input}
                    />
                    <Input
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="name-phone-pad"
                        inputStyle={{ fontFamily: "Montserrat_Regular"  }}
                        placeholder="Email"
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                            width: "100%",
                            alignSelf: "center",
                        }}
                        style={styles.input}
                    />
                </KeyboardAvoidingView>
                <Button
                        title={"Done"}
                        buttonStyle={styles.button}
                        titleStyle={{fontFamily: "Montserrat_Regular", justifyContent: "center", alignItems: "center"}}
                        disabled={name?.length == 0 || email?.length == 0 ? true : false}
                        onPress={updateUser}
                    />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default EditUser;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        // justifyContent: "center",
        // paddingTop: 50,
        height: "100%"
    },
    inputContainer: {
        display: "flex",
        width: "85%",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50
    },
    input: {
        backgroundColor: "#EBEBEB",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
    },
    textStyle: {
        alignSelf: "center",
        fontWeight: "700",
        fontSize: 30,
        marginBottom: 50,
        fontFamily: "Montserrat_Bold",
    },
    button: {
        // width: "90%",
        marginVertical: 6,
        margin: 5,
        padding: 10,
        paddingHorizontal: 50,
        borderRadius: 10,
        backgroundColor: "#2161BF",
        opacity: 0.8,
        alignSelf: "center",
        textAlign: "center",
        
    },
});
