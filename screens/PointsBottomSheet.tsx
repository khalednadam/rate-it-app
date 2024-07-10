import { StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { RootStackParamList } from "../App";
import { RouteProp, useNavigation } from "@react-navigation/native";
import useCurrentUser from "../hooks/useCurrentUser";
import useUser from "../hooks/useUser";
import { auth } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

type PointsBottomSheetRouteProp = {
    open: Boolean,
    setOpen: Function,
    sheetRef: any,
    points: number
}

const PointsBottomSheet = ({open, setOpen, sheetRef, points}: PointsBottomSheetRouteProp) => {
    const snapPoint = ["70%"];
    const user = useUser(auth.currentUser?.uid);
    let userPoints = user?.points
    const navigation = useNavigation();
    useLayoutEffect(() =>{
        navigation.setOptions({
            tabBarStyle:{
                display: open ? "none" : "flex"
            }
        })
    }, [open])
    useEffect(() =>{
        userPoints = user?.points
    }, [user?.points])
    return (
        <>
            {open && (
                // <View
                //     style={
                //              {
                //                 height: "100%",
                //               }
                //     }
                // >
                    <BottomSheet 
                        ref={sheetRef}
                        snapPoints={snapPoint}
                        onClose={() => setOpen(false)}
                        enablePanDownToClose
                        // containerStyle={{backgroundColor: "#858585"}}
                        handleIndicatorStyle={{backgroundColor: "#2161BF"}}
                    >
                        <BottomSheetView>
                            
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Montserrat_Bold",
                                        fontSize: 26,
                                    }}
                                >
                                    {/* TODO: Implement */}
                                    Your Points:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: "Montserrat_Regular",
                                        fontSize: 26,
                                    }}
                                >
                                    {userPoints}
                                </Text>
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                // </View>
            )}
        </>
    );
};

export default PointsBottomSheet;

const styles = StyleSheet.create({});
