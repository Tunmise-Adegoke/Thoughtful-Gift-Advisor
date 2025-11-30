import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc, serverTimestamp } from "firebase/firestore";
import { GiftIdea, RecipientProfile } from "../types";
import { APP_CONFIG } from "../config";

// Initialize Firebase with error handling
let app;
let db: any;
let initializationError = false;

try {
  app = initializeApp(APP_CONFIG.FIREBASE);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
  initializationError = true;
}

export interface SharedList {
    profile: RecipientProfile;
    gifts: GiftIdea[];
    createdAt: any;
}

// Helper to check if backend is ready
export const isBackendReady = (): boolean => {
    return !initializationError && !!db;
};

// 1. Save a list to Firestore (Anonymous)
export const saveSharedList = async (profile: RecipientProfile, gifts: GiftIdea[]): Promise<string> => {
    if (initializationError || !db) throw new Error("Firebase is not initialized");
    
    try {
        // We store it in a 'shared_lists' collection
        const docRef = await addDoc(collection(db, "shared_lists"), {
            profile,
            gifts,
            createdAt: serverTimestamp() // Server-side time
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// 2. Fetch a shared list by ID
export const getSharedList = async (id: string): Promise<SharedList | null> => {
    if (initializationError || !db) return null;

    try {
        const docRef = doc(db, "shared_lists", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SharedList;
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        throw e;
    }
};
