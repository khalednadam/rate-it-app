import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Land from "./screens/Land";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Tab from "./Tab";
import ServiceProfile from "./screens/ServiceProfile";
import OtherUserProfile from "./screens/OtherUserProfile";
import ServicesList from "./screens/ServicesList";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import RateService from "./screens/RateService";
import SearchForService from "./screens/SearchForService";
import RequestNewServiceForm from "./screens/RequestNewServiceForm";
import { auth } from "./firebase";
import { User } from "./types";
import FullSizeImage from "./screens/FullSizeImage";
import ChangeProfilePic from "./screens/ChangeProfilePic";
import Loading from "./components/Loading";
import EditUser from "./screens/EditUser";
import Success from "./screens/Success";
import UserProfileStack from "./screens/UserProfileStack";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Report from "./screens/Report";
import RequestSuccess from "./screens/RequestSuccess";
// import FollowedUsers from "./screens/FollowedUsers";
import ReportSuccess from "./screens/ReportSuccess";
import PointsBottomSheet from "./screens/PointsBottomSheet";
import ForgotPassword from "./screens/ForgotPassword";
import UpdatePassword from "./screens/UpdatePassword";

// import SplashScreen from "./screens/SplashScreen";
import "expo-dev-client";
// import Notifications from "./components/Notifications";
export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Tab: undefined;
    // SplashScreen: undefined;
    Register: undefined;
    ServiceProfile: undefined;
    ServiceProfileRoute: { serviceId: string };
    OtherUserProfile: undefined;
    OtherUserProfileRoute: { userId: string };
    UserProfileStack: undefined;
    // UserProfileStackRoute: { userId: string };
    RateService: undefined;
    RateServiceRoute: {
        serviceName: string;
        serviceId: string;
        generalRate: number;
        totalRate: number;
        rateLen: number;
        serviceImage: string;
    };
    Land: undefined;
    ServicesList: undefined;
    ServiceListRoute: { categoryName: string };
    SearchForService: undefined;
    RequestNewServiceForm: undefined;
    FullSizeImage: undefined;
    FullSizeImageRoute: { image: string };
    ChangeProfilePic: undefined;
    ChangeProfilePicRoute: { profilePic: any };
    EditUser: undefined;
    Success: undefined;
    RequestSuccess: undefined;
    ReportSuccess: undefined;
    SuccessRoute: { serviceName: string };
    Report: undefined;
    ReportRoute: { rate: any };
    // FollowedUsers: undefined;
    ForgotPassword: never;
    UpdatePassword: never;
    // Notifications: never;
    // PointsBottomSheetRoute: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    // const navigation = useNavigation()
    const [fontLoaded, setFontLoaded] = useState(false);
    useEffect(() => {
        Font.loadAsync({
            Montserrat_Black: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-Black.ttf"),
            Montserrat_BlackItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-BlackItalic.ttf"),
            Montserrat_Bold: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-Bold.ttf"),
            Montserrat_BoldItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-BoldItalic.ttf"),
            Montserrat_ExtraBold: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-ExtraBold.ttf"),
            Montserrat_ExtraBoldItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-ExtraBoldItalic.ttf"),
            Montserrat_ExtraLight: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-ExtraLight.ttf"),
            Montserrat_ExtraLightItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-ExtraLightItalic.ttf"),
            Montserrat_Italic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-Italic.ttf"),
            Montserrat_Light: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-Light.ttf"),
            Montserrat_LightItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-LightItalic.ttf"),
            Montserrat_Medium: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-Medium.ttf"),
            Montserrat_MediumItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-MediumItalic.ttf"),
            Montserrat_Regular: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-Regular.ttf"),
            Montserrat_SemiBold: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-SemiBold.ttf"),
            Montserrat_SemiBoldItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-SemiBoldItalic.ttf"),
            Montserrat_Thin: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-Thin.ttf"),
            Montserrat_ThinItalic: require("./assets/fonts/Montserratfolder/Montserrat/static/Montserrat-ThinItalic.ttf"),
        }).then(() => {
            setFontLoaded(true);
        });
        
    }, []);

    if (!fontLoaded) return <Loading />;
    return (

            <NavigationContainer>
                <Stack.Navigator>
                    {/* <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                /> */}
                        {/* <Stack.Screen
                            name="Notifications"
                            component={Notifications}
                        /> */}
                    <Stack.Screen
                        name="Land"
                        component={Land}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Tab"
                        component={Tab}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Report"
                        component={Report}
                    />
                    
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ServiceProfile"
                        component={ServiceProfile}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OtherUserProfile"
                        component={OtherUserProfile}
                    />
                    <Stack.Screen name="RateService" component={RateService} />
                    <Stack.Screen
                        name="ServicesList"
                        component={ServicesList}
                    />
                    <Stack.Screen
                        name="SearchForService"
                        component={SearchForService}
                    />
                    <Stack.Screen
                        name="RequestNewServiceForm"
                        component={RequestNewServiceForm}
                    />
                    <Stack.Screen
                        name="ChangeProfilePic"
                        component={ChangeProfilePic}
                    />
                    <Stack.Screen name="EditUser" component={EditUser} />
                    <Stack.Screen
                        name="Success"
                        component={Success}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="RequestSuccess"
                        component={RequestSuccess}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ReportSuccess"
                        component={ReportSuccess}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="UserProfileStack"
                        component={UserProfileStack}
                    />
                    {/* <Stack.Screen
                        name="FollowedUsers"
                        component={FollowedUsers}
                    /> */}
                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPassword}
                    />
                    <Stack.Screen
                        name="UpdatePassword"
                        component={UpdatePassword}
                    />
                    {/* <Stack.Screen
                        name="PointsBottomSheet"
                        component={PointsBottomSheet}
                        options={{ headerShown: false }}

                    /> */}
                    
                </Stack.Navigator>
            </NavigationContainer>

    );
}

// ! /////////////////////////////
// * TODO: Add rate to the service
// * TODO: Add 5 points to the user
// * TODO: Get posts from service
// * TODO: Sort by date
// * TODO: Update the general rate of the service
// * TODO: Follow user
// ! /////////////////////////////
