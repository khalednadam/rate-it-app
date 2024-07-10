import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const useUser = (userId: any) => {
    const [user, setUser] = useState<any>();
    const q = query(
        collection(db, "users"),
        where("uid", "==", userId)
    );
    useEffect(() => {
        async function getUser() {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc: any) => {
                setUser(doc.data());
            });
        }
        getUser();
    }, [userId]);

    return user;
};

export default useUser;
