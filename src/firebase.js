import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBaVDN6DfjIzTvRJM6QL7aWxe6s1MT0ZQs",
    authDomain: "abbottunion.firebaseapp.com",
    projectId: "abbottunion",
    storageBucket: "abbottunion.appspot.com",
    messagingSenderId: "398440803742",
    appId: "1:398440803742:web:298656df49755f3b963a8f"
};

firebase.initializeApp(firebaseConfig);

export default firebase;