import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
// import CountrySelectDropdown from "react-native-searchable-country-dropdown";
import DropDownPicker from "react-native-dropdown-picker";
import { CategoriesTypes } from "../types";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    getStorage,
} from "@firebase/storage";
import Loading from "../components/Loading";

type DropDownType = { label: CategoriesTypes; value: CategoriesTypes };

const RequestNewServiceForm = ({ navigation }: any) => {
    const uuid = uuidv4();
    const storage = getStorage();
    const [loading, setLoading] = useState(false);

    const [serviceName, setServiceName] = useState("");
    const [category, setCategory] = useState("");
    const [country, setCountry] = useState("");
    const [logo, setLogo] = useState("https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState<DropDownType[]>([
        { label: "Restaurants", value: "Restaurants" },
        { label: "Internet Companies", value: "Internet Companies" },
        { label: "Banks", value: "Banks" },
        { label: "Apps", value: "Apps" },
        { label: "Mall", value: "Mall" },
        { label: "Media Companies", value: "Media Companies" },
        { label: "Gym", value: "Gym" },
        { label: "Hotels", value: "Hotels" },
        { label: "Medical", value: "Medical" },
        { label: "Airlines", value: "Airlines" },
        { label: "Retail Stores", value: "Retail Stores" },
        { label: "Online Stores", value: "Online Stores" },
        { label: "Schools", value: "Schools" },
        { label: "Cafes", value: "Cafes" },
    ]);
    const sendRequest = async () => {
        const serviceLogo = await upload();

        try {
            db.collection("pendingRequests").doc(uuid).set({
                category: category,
                description: description,
                generalRate: 0,
                id: uuid,
                name: serviceName,
                rateLen: 0,
                rates: [],
                servicePicURL: serviceLogo,
                totalRate: 0,
                status: "pending",
                userId: auth.currentUser?.uid,
                // country: country,
            });
        } catch (error) {
            alert(error);
        }
        navigation.navigate("RequestSuccess" as never);
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Request adding a service",
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
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

            setLogo(source.uri);
        }
    };
    const upload = async () => {
        setLoading(true);
        const response = await fetch(logo as any);
        const blob = await response.blob();
        const filename = `services/${uuid}`;
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
        setLoading(false);
        return url1;
    };
    return (
        <>
        { loading ? 
            <Loading />
        : <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                >
                {logo !== "" ? (
                    <View style={{ paddingBottom: 20 }}>
                        <Image
                            source={{ uri: logo as any }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                            }}
                            />
                    </View>
                ) : (
                    <View style={{ paddingBottom: 20 }}>
                        <Image
                            source={{
                                uri: "https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" as any,
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                            }}
                            />
                    </View>
                )}
                <TouchableOpacity
                    style={{ paddingBottom: 20 }}
                    onPress={pickImage}
                    >
                    <Text>Add an image</Text>
                </TouchableOpacity>
                <Input
                    inputStyle={{ fontFamily: "Montserrat_Regular" }}
                    autoComplete="off"
                    autoCorrect={false}
                    placeholder="Service Name"
                    inputContainerStyle={{
                        borderBottomWidth: 0,
                        width: "100%",
                        alignSelf: "center",
                    }}
                    style={styles.input}
                    value={serviceName}
                    onChangeText={(text) => setServiceName(text)}
                    />
                <DropDownPicker
                    style={styles.dropDown}
                    open={open}
                    value={category}
                    items={items}
                    setOpen={setOpen}
                    setValue={setCategory}
                    setItems={setItems}
                    selectedItemContainerStyle={{
                        backgroundColor: "#2161BF",
                        opacity: 0.8,
                    }}
                    selectedItemLabelStyle={{
                        color: "white",
                    }}
                    tickIconContainerStyle={{
                        display: "none",
                    }}
                    labelStyle={{
                        fontFamily: "Montserrat_Regular",
                        borderWidth: 0,
                        height: 30,
                        fontSize: 18,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    listItemLabelStyle={{
                        fontFamily: "Montserrat_Regular",
                        borderWidth: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    containerStyle={{
                        width: "95%",
                        marginBottom: 20,
                        borderWidth: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    badgeStyle={{
                        borderWidth: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    dropDownContainerStyle={{
                        borderWidth: 0.2,
                    }}
                    placeholderStyle={{
                        fontFamily: "Montserrat_Regular",
                        opacity: 0.5,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    placeholder="Select Category"
                    />
                {/* <Input
                inputStyle={{ fontFamily: "Montserrat_Regular" }}
                autoComplete="off"
                autoCorrect={false}
                placeholder="Category"
                inputContainerStyle={{
                    borderBottomWidth: 0,
                    width: "100%",
                    alignSelf: "center",
                }}
                style={styles.input}
                value={category}
                onChangeText={(text) => setCategory(text)}
            /> */}
                {/* <View
                style={{
                    width: "95%",
                    height: 50,
                    backgroundColor: "#EBEBEB",
                    zIndex: 20,
                    marginBottom: 20,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                }}
                >
                <CountrySelectDropdown
                countrySelect={setCountry}
                fontFamily={"Montserrat_Medium"}
                textColor={"#000"}
                key={"a"}
                />
            </View> */}
                <View style={styles.comment}>
                    <Input
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        maxLength={300}
                        numberOfLines={3}
                        multiline={true}
                        placeholder="Description"
                        inputStyle={{
                            fontSize: 16,
                            fontFamily: "Montserrat_Regular",
                        }}
                        scrollEnabled
                        style={{
                            fontFamily: "Montserrat_Regular",
                        }}
                        containerStyle={styles.comment}
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                            borderWidth: 0,
                        }}
                        />
                </View>

                <View style={styles.send}>
                    <Button
                        onPress={sendRequest}
                        style={{
                            paddingTop: 20,
                            width: "90%",
                            borderRadius: 10,
                            alignSelf: "center",
                        }}
                        disabled={
                            serviceName.length === 0 ||
                            category.length === 0 ||
                            description.length === 0
                            ? true
                            : false
                        }
                        titleStyle={{ fontFamily: "Montserrat_Regular" }}
                        buttonStyle={{ backgroundColor: "#2161BF" }}
                        title={"Send"}
                        />
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>}
                        </>
    );
};

export default RequestNewServiceForm;

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#EBEBEB",
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        height: 50,
    },
    container: {
        backgroundColor: "white",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 20,
    },
    send: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 100,
    },
    comment: {
        width: "95%",
        maxHeight: 110,
        alignSelf: "center",
        backgroundColor: "#EBEBEB",
        borderRadius: 10,
        fontFamily: "Montserrat_Regular",
    },
    dropDown: {
        width: "100%",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "#EBEBEB",
        fontFamily: "Montserrat_Regular",
        borderRadius: 10,
        borderWidth: 0,
    },
});
