import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<any>();
    const q = query(
        collection(db, "users"),
        where("uid", "==", auth.currentUser?.uid)
    );
    useEffect(() => {
        async function getUser() {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async(doc: any) => {
                setCurrentUser(await doc.data());
            });
        }
        getUser();

    }, [auth.currentUser?.uid]);

    return currentUser;
};

export default useCurrentUser;
