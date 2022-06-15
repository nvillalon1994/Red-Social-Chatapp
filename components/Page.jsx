import React, { useEffect } from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import {auth, database} from '../config/firebase'
import {useDispatch} from 'react-redux'
import { login, logout } from '../features/auth'
import NavBar from './NavBar'
import {getAllPosts, getPosts } from '../features/posts'
import { getUsers } from '../features/users'
import { getFriends, getSolicitud } from '../features/friends/solicitudes'
import { collection, onSnapshot } from 'firebase/firestore'
import { useState } from 'react'

export default function Page({children}) {
    const dispatch = useDispatch()
    const [usuarios,setUsuarios]=useState([])
    useEffect(()=>{

        

        onAuthStateChanged(auth,(authResult)=>{
            if(authResult){
                dispatch(login({
                    id:authResult.uid,
                    email:authResult.email,
                    name:authResult.displayName,
                    profilePic:authResult.photoURL
                }))
                dispatch(getPosts(authResult.uid))
                setTimeout(()=>{
                    dispatch(getUsers())
                },900) 
                setTimeout(()=>{
                    dispatch(getAllPosts())
                },900) 
                dispatch(getSolicitud(authResult.uid))
                dispatch(getFriends(authResult.uid))
                
                
            }else{
                dispatch(logout())
            }
        })
    },[])
  return (
    <main className='bg-color2-backg min-h-screen h-full'>
        <NavBar/>
        {usuarios.map((user)=><div>
            <p>{user.name}</p>
            <p>{user.text}</p>
            <p></p>
        </div>)}
        {children}
        
    </main>
  )
}