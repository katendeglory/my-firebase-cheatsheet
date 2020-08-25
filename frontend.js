
/********************************************** 🌟 FIREBASE INIT 🌟 *************************************/

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

firebase.initializeApp({
  apiKey: "AIzaSyAvG9Dd3Wecyzc9jby8yiC0z210sZBjmvI",
  authDomain: "project-manathan-781227.firebaseapp.com",
  databaseURL: "https://project-manathan-781227.firebaseio.com",
  projectId: "project-manathan-781227",
  storageBucket: "project-manathan-781227.appspot.com",
  messagingSenderId: "697524608485",
  appId: "1:697524608485:web:c5990129bf8b6c3643230c",
  measurementId: "G-TVDE4JMC09"
});

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();




/********************************************** 🌟 REGISTER 🌟 *****************************************/

auth
  .createUserWithEmailAndPassword(email, password)
  .then(res => {
    /*
      Create a user collection with the id of the user created in the auth database (non-availble in firestore)
      Knowing the id we don't use add, we place the id and set the value. if id doesn't exist, it is created.
      In this example we return a promise whose result will be used in the following then.
    */
    return db.collection('usersMeta').doc(res.user.uid).set({ bio });
  })
  .then(res => {
    console.log(res);
  });




/********************************************** 🌟 LOGIN 🌟 *********************************************/

auth
  .signInWithEmailAndPassword(email, password)
  .then(res => {
    console.log(res);
  });



/******************************************** 🌟 LOG-OUT 🌟 ********************************************/

auth.signOut();





/********************************************** 🌟 BESTOW ADMIN PRIVILEGES 🌟 ***************************/

const addAdminRole = functions.httpsCallable('addAdminRole');

addAdminRole({ email: adminEmail })
  .then(res => console.log(res))
  .catch(e => console.log(e));




/********************************************** 🌟 ON AUTH CHAGES 🌟 ************************************/

auth.onAuthStateChanged(user => {
  if (user) {

    /******************* 🌟 CHECK ADMIN CLAIMS 🌟 ***************/

    user.getIdTokenResult().then(token => user.admin = token.claims.admin);

    /******************* 🌟 COLLECT USER POSTS 🌟 ***************/

    db.collection('guides')
      .onSnapshot(snapshot => {
        console.log(snapshot.docs);
      }, err => {
        console.log(err.message);
      });
  }
  else {
    console.log(`You better login!`);
  }
});