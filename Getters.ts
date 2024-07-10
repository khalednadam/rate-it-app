import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { Rate, Service, User } from "./types";

export const getUserById = async (id: string | undefined) => {
    let user;
    if (id) {
        const q = query(collection(db, "users"), where("uid", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            user = doc.data();
        });
    }
    return user;
};

export const getServiceById = async (id: string) => {
    const docRef = doc(db, "services", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
};

export const getRateById = async (id: string) => {
    const docRef = doc(db, "rates", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
};

export const getRatesOfUser = async (userId: string) => {};

export const getRatesOfService = async (serviceId: string) => {};
