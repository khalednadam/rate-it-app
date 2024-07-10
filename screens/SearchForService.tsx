import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import ServicesListItem from "../components/ServicesListItem";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";


const SearchForService = ({ navigation }: any) => {
    const [found, setFound] = useState(false);
    const [searchService, setSearchService] = useState<string>("");
    const [services, setServices] = useState<any[]>([]);
    const getService = async (searchService1: string) => {
        const servicesArr: any[] = [];
        const q = query(
            collection(db, "services"),
            where("name", "==", searchService1.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc: any) => {
            servicesArr.push(doc.data());
            setFound(true)
        });
        setServices(servicesArr);
    }
    useEffect(() => { 
        getService(searchService);
    }, [searchService]);
    useLayoutEffect(() =>{
        navigation.setOptions({
            headerStyle: {
                backgroundColor: '#2161BF',
              }, 
              headerTintColor: '#fff',
              headerTitle: "Search for a service",
              headerTitleStyle:{
                fontFamily: "Montserrat_Regular"
              }
            })
    }, [])

    
    return (
        <View style={styles.container}>
            {/* <StatusBar style="light" translucent /> */}
            <Input
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    
                    onChangeText={(text) => setSearchService(text)}
                    placeholder="Search for a service"
                    inputStyle={{
                        paddingLeft: 50,
                        fontFamily: "Montserrat_Regular"
                    }}
                    containerStyle={{
                        display: "flex",
                        width: "95%",
                        alignSelf: "center",
                    }}
                    inputContainerStyle={{
                        borderBottomWidth: 0,
                        display: "flex",
                        flexDirection: "row",
                    }}
                    style={{
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 10,
                        flexDirection: "row",
                    }}
                    leftIcon={<Ionicons name="search" size={20} />}
                    leftIconContainerStyle={{
                        position: "absolute",
                        zIndex: 30,
                        marginLeft: 20,
                    }}
                />
                {
                    services.length > 0 ?  
                    <ScrollView>
                        {
                            services?.map((service: any) =>(
                                <ServicesListItem name={service?.name} description={service?.description}
                                serviceId={service?.id} generalRate={service?.generalRate} totalRate={service?.totalRate} rateLen={service.rateLen}
                                servicePicURL={service?.servicePicURL} key={service?.id} />
                            ))
                        }
                    </ScrollView>
                    :
                    <View style={styles.notFound}>
                        <Text style={{fontFamily: "Montserrat_Regular", textAlign: "center"}}>
                            no search results found for{"\n"} "{searchService}"
                        </Text>
                        <Button
                            title={"Add a new service"}
                            titleStyle={{fontFamily: "Montserrat_SemiBold"}}
                            onPress={() => navigation.navigate("RequestNewServiceForm")}
                        />
                    </View>
                }
        </View>
    );
};

export default SearchForService;

const styles = StyleSheet.create({
    container:{
        paddingTop: 20
    },
    notFound:{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 200
    }
});
