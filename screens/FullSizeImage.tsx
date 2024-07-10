import { StyleSheet, Text, View } from "react-native";
import React, { FC, useState } from "react";
import ImageView from "react-native-image-viewing";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";

type FullSizeImageRoute = RouteProp<RootStackParamList, "FullSizeImageRoute">

interface Props{
    route?: FullSizeImageRoute
}
const FullSizeImage: FC = (props: Props) => {
    const [visible, setIsVisible] = useState<any>(true);
    return (
        <ImageView
            images={[{uri: props.route?.params.image}]}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
        />
    );
};

export default FullSizeImage;

const styles = StyleSheet.create({});
