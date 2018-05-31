import Firebase from 'firebase'
import 'firebase/firestore'

let config = {
  apiKey: 'AIzaSyDN9UJ2wuHnrMYjXSnAFVfUKHmnttkqPpg',
    authDomain: 'judolaunch-test.firebaseapp.com',
    databaseURL: 'https://judolaunch-test.firebaseio.com',
    projectId: 'judolaunch-test',
    storageBucket: 'judolaunch-test.appspot.com',
    messagingSenderId: '1031087042872'
}

export const firebaseApp = Firebase.initializeApp(config)
export const db = firebaseApp.firestore()
