import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

import {getAuth} from "firebase/auth"
import { getStorage } from 'firebase/storage'
const firebaseConfig =
{
    apiKey:process.env.NEXT_PUBLIC_APIKEY,
    authDomain:process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId:process.env.NEXT_PUBLIC_PROJECTID,
    storageBucket: "ecommercenextjs-e9487.appspot.com",
    
    messagingSenderId:process.env.MESSAGINGSENDERID,
    
    appId:process.env.APPID
    
}
const app = initializeApp(firebaseConfig)
export const database= getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export async function registrarUsuario (data){
    
    
    const docuRef = doc(database,`usuarios/${infoUsuario.user.uid}`)
    setDoc(docuRef,{correo:email,rol:rol,museo:museo})
    

}


