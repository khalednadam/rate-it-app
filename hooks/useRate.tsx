import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const useRate = (rateId: any) => {
    const [rate, setRate] = useState<any>();
    const q = query(
        collection(db, "rates"),
        where("id", "==", rateId)
    );
    useEffect(() => {
        async function getRate() {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc: any) => {
                setRate(doc.data());
            });
        }
        getRate();
    }, [rateId]);

    return rate;
};

export default useRate;
