import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCF1D06Tq6wjg2sQjHaGF8BcNU83f-F8g4",
  authDomain: "actividad-10-utch-1f81c.firebaseapp.com",
  databaseURL: "https://actividad-10-utch-1f81c-default-rtdb.firebaseio.com",
  projectId: "actividad-10-utch-1f81c",
  storageBucket: "actividad-10-utch-1f81c.appspot.com",
  messagingSenderId: "662187196512",
  appId: "1:662187196512:web:adab6991633e1b15504305"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
