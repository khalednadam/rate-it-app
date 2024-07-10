import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const useService = (serivceId: any) => {
    const [service, setService] = useState<any>();
    const q = query(
        collection(db, "services"),
        where("id", "==", serivceId)
    );
    useEffect(() => {
        async function getService() {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc: any) => {
                setService(doc.data());
            });
        }
        getService();
    }, [serivceId]);

    return service;
};

export default useService;
