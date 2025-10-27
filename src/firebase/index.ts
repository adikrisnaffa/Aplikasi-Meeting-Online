import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';
import {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, firestore, auth };
}

export {
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
