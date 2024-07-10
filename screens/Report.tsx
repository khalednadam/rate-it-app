import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { FC, useLayoutEffect, useState } from "react";
import FeedPost from "../components/FeedPost";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Button, Input } from "react-native-elements";
import { auth, db } from "../firebase";
import { arrayUnion, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4, v4 } from "uuid";

type ReportProps = RouteProp<RootStackParamList, "ReportRoute">;
interface Props {
    route?: ReportProps;
}
const Report: FC<Props> = (props) => {
    const uuid = uuidv4();
    const navigation = useNavigation();
    const [sent, setSent] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular",
            },
        });
    }, []);
    const [comment, setComment] = useState("");
    // TODO: Implement

    const sendReport = () => {
        setSent(true);
        try {
            db.collection("reports")
                .doc(uuid)
                .set({
                    reportId: uuid,
                    rateId: db.doc("rates/" + props.route?.params.rate?.rateId),
                    reporter: db.doc("users/" + auth.currentUser?.uid),
                    reportedOn: db.doc(
                        "users/" + props.route?.params.rate?.user.id
                    ),
                    serviceId: db.doc(
                        "services/" + props.route?.params.rate?.service.id
                    ),
                    comment: comment,
                    status: "pending",
                    dateString: new Date().toDateString(),
                    serverTimestamp: serverTimestamp(),
                });

            db.collection("users")
                .doc(auth.currentUser?.uid)
                .update({
                    reports: arrayUnion(db.doc("reports/" + uuid)),
                });

            navigation.navigate("ReportSuccess" as never);
        } catch (error) {
            console.log(error);
            setSent(false);
        }
    };
    return (
        <>
            <ScrollView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    {/* <FeedPost
                        rate={props.route?.params.rate}
                        key={props.route?.params.rate?.rateId}
                    /> */}
                    <Text style={styles.text}>Tell us more...</Text>
                    <View style={styles.comment}>
                        <Input
                            value={comment}
                            onChangeText={(text) => setComment(text)}
                            maxLength={300}
                            numberOfLines={3}
                            multiline={true}
                            placeholder="Write a comment..."
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
                            }}
                        />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.send}>
                <Button
                    style={{
                        paddingTop: 20,
                        width: "90%",
                        borderRadius: 10,
                        alignSelf: "center",
                    }}
                    titleStyle={{ fontFamily: "Montserrat_Regular" }}
                    buttonStyle={{ backgroundColor: "#2161BF" }}
                    title={"Send"}
                    disabled={comment.length == 0 || sent ? true : false}
                    onPress={sendReport}
                />
            </View>
        </>
    );
};

export default Report;

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
    comment: {
        marginTop: 20,
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 10,
        fontFamily: "Montserrat_Regular",
    },
    text: {
        fontFamily: "Montserrat_Regular",
        fontSize: 16,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    send: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        width: "100%",
        height: 100,
    },
});
