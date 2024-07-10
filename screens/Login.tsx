import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase.js";
import { Input } from "react-native-elements";
import { GoogleAuthProvider } from "firebase/auth/react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, updateDoc } from "firebase/firestore";
import Loading from "../components/Loading";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Login = ({ navigation }: any) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // if(response?.type === "success"){
    //     setAccessToken(response.authentication?.accessToken);
    //     console.log(response);

    // }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        navigation.replace("Tab");
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((user: any) => {
        registerForPushNotificationsAsync();
      })
      .catch((error) => {
        console.log(error.message);
        if (error.message == "Firebase: Error (auth/invalid-email).") {
          Alert.alert(
            "Invalid email",
            "this email is not registered, if you don't have an account please create one"
          );
        } else if (
          error.message == "Firebase: Error (auth/wrong-password)."
        ) {
          Alert.alert(
            "Wrong Password",
            "please re-check your password and try again, if you forgot your password you can reset it from 'Forgot password' button"
          );
        } else if (
          error.message == "Firebase: Error (auth/internal-error)."
        ) {
          Alert.alert("Please fill all fields", "");
        }
      });
    setLoading(false);
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } =
          await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        await Notifications.requestPermissionsAsync();
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;

      db.collection("users").doc(auth.currentUser?.uid).update({
        ExponentPushToken: token,
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  return (
    <>
      {
        loading ? (
          <Loading />
        ) : (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <SafeAreaView style={styles.container}>
              <KeyboardAvoidingView
                style={styles.inputContainer}
                behavior={
                  Platform.OS == "ios" ? "padding" : "height"
                }
              >
                <Text style={styles.textStyle}> Login</Text>
                <Input
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  inputStyle={{
                    fontFamily: "Montserrat_Regular",
                  }}
                  placeholder="Email"
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    width: "100%",
                    alignSelf: "center",
                  }}
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <Input
                  autoComplete="off"
                  autoCorrect={false}
                  inputStyle={{
                    fontFamily: "Montserrat_Regular",
                  }}
                  autoCapitalize="none"
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setIsVisible(!isVisible)}
                      style={{
                        backgroundColor: "transparent",
                        paddingRight: 50,
                        display: "flex",
                        position: "absolute",
                      }}
                    >
                      <Ionicons
                        name={
                          !isVisible
                            ? "eye-outline"
                            : "eye-off-outline"
                        }
                        size={25}
                      />
                    </TouchableOpacity>
                  }
                  secureTextEntry={isVisible ? false : true}
                  placeholder="Password"
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    display: "flex",
                    flexDirection: "row",
                  }}
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                  style={{ width: "90%" }}
                  onPress={() =>
                    navigation.navigate(
                      "ForgotPassword" as never
                    )
                  }
                >
                  <Text
                    style={{
                      fontSize: 12,
                      width: "100%",
                      marginVertical: 20,
                      marginLeft: 10,
                      fontFamily: "Montserrat_Regular",
                    }}
                  >
                    Forgot password?
                  </Text>
                </TouchableOpacity>
                <Button
                  title={"Login"}
                  buttonStyle={styles.button}
                  onPress={login}
                  titleStyle={{
                    fontFamily: "Montserrat_Regular",
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    // position: "absolute",
                    // bottom: 0,
                    // width: "100%",
                    paddingTop: 100,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Register")
                    }
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: "Montserrat_Regular",
                      }}
                    >
                      Don't have an account? Register
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
              {/* <View style={{ marginTop: 50 }}>
                    <Text
                    style={{
                        textAlign: "center",
                        fontFamily: "Montserrat_Regular",
                    }}
                    >
                    Or continue with
                    </Text>
                    <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginTop: 20,
                    }}
                    >
                    <TouchableOpacity onPress={loginWithGoogle}>
                    <Ionicons name="logo-google" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Ionicons name="logo-apple" size={30} />
                    </TouchableOpacity>
                    <Button
                    title="Sign in with Google"
                    disabled={!request}
                    onPress={() => {
                        promptAsync();
                    }}
                    />
                    </View>
                </View> */}
            </SafeAreaView>
          </TouchableWithoutFeedback>
        )}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  inputContainer: {
    display: "flex",
    width: "85%",
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
    width: "90%",
    marginVertical: 6,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#2161BF",
    opacity: 0.8,
    alignSelf: "center",
  },
});
