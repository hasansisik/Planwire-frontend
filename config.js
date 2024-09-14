export const server = "http://192.168.1.33:3040/v1";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmVWi3Rv1RQW3Zsj8YxBA39_raFdZYtaM",
  authDomain: "projectxwire-e951a.firebaseapp.com",
  projectId: "projectxwire-e951a",
  storageBucket: "projectxwire-e951a.appspot.com",
  messagingSenderId: "238622610992",
  appId: "1:238622610992:web:6d990e5a837b49afcafff5",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };