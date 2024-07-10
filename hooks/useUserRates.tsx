import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, query } from "firebase/firestore";
import useCurrentUser from "./useCurrentUser";
import useUser from "./useUser";

const useUserRates = (userId: string) => {
    const [rates, setRates] = useState<string[]>();
    const user = useUser(userId);

    useEffect(() =>{
        const data: any[] = [];
        const getRates = async() =>{
            await user?.rates.forEach(async (rate: any) =>{
                data.push(rate.id);
            })
            setRates(data);
        }
        getRates();
    }, [userId])
    return rates;
};

export default useUserRates;
