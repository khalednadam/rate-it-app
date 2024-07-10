import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type StarsProps = {
    rate: number
}

const Stars = ({ rate }: StarsProps) => {
    if(rate > 0 && rate < 1){
        return (
            <View style={styles.rate}>
                <Ionicons name="star-half-sharp" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 1 && rate < 1.5 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 1.5 && rate < 2 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star-half-sharp" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 2 && rate < 2.5 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 2.5 && rate < 3 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star-half-sharp" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 3 && rate < 3.5 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 3.5 && rate < 4 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star-half-sharp" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 4 && rate < 4.5 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate >= 4.5 && rate < 5 ){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-half-sharp"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }else if(rate == 5){
        return (
            <View style={styles.rate}>
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
                <Ionicons name="star" color={"#3263AE"} size={25} />
            </View>
        )
    }else{
        return (
            <View style={styles.rate}>
                <Ionicons name="star-outline" color={"#3263AE"} size={25} />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
                <Ionicons
                    name="star-outline"
                    color={"#3263AE"}
                    size={25}
                />
            </View>
        )
    }
};

export default Stars;

const styles = StyleSheet.create({
    rate: {
        paddingBottom: 5,
        flexDirection: "row",
    },
});
