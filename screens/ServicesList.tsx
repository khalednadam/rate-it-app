import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import ServicesListItem from "../components/ServicesListItem";
import { Input } from "react-native-elements";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { db } from "../firebase";
import { Service } from "../types";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loading from "../components/Loading";

type ServiceListRouteProp = RouteProp<RootStackParamList, "ServiceListRoute">

interface Props{
    route?: ServiceListRouteProp
}

const ServicesList: FC<Props> = (props) => {
    const [services, setServices] = useState<any[]>([]);
    const navigation = useNavigation();
    const [refresh, setRefresh] = useState(false);
    const q = query(collection(db, "services"), where("category", "==", props.route?.params.categoryName));
    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitleStyle: {
                fontFamily: "Montserrat_Regular" 
            },
            headerTitle: `${props.route?.params.categoryName}`,
        })
    }, [])
    useEffect(() => {
        async function fetchServices() {
            const data: any[] = []
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc: any) => {

                data.push(doc.data());
            });
            setServices(data);
        }
        fetchServices();
    }, [refresh]);
    const pullToRefresh = () => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 4000);
    };
    return (
        services.length == 0 || !services ?
        <Loading /> :
        <ScrollView style={styles.container} 
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => pullToRefresh()} />}
        >
            {services?.map((service: any) =>(
                <ServicesListItem 
                key={service.id}
                name={service.name}
                description={service.description}
                serviceId={service.id}
                generalRate={service.generalRate}
                totalRate={service.totalRate}
                rateLen={service.rateLen}
                servicePicURL={service.servicePicURL}
                />
            ))}
        </ScrollView>
    );
};

export default ServicesList;

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
});
