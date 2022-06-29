import React, { useEffect } from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import {auth, database} from '../config/firebase'
import {useDispatch} from 'react-redux'
import { login, logout } from '../features/auth'
import NavBar from './NavBar'
import {getAllPosts, getPosts } from '../features/posts'
import { getAllUsers, getUserPosts, getUsers } from '../features/users'
import { getFriends, getSolicitud } from '../features/friends/solicitudes'
import { collection, onSnapshot } from 'firebase/firestore'
import { useState } from 'react'
import ChatWindow from './ChatWindow'

export default function Page({children}) {
    const dispatch = useDispatch()
    const [id,setId]=useState()

    useEffect(()=>{

        

        onAuthStateChanged(auth,(authResult)=>{
            if(authResult){
                dispatch(login({
                    id:authResult.uid,
                    email:authResult.email,
                    name:authResult.displayName,
                    profilePic:authResult.photoURL
                }))
                setId(authResult.uid)
                
                // dispatch(getPosts(authResult.uid))
                // setTimeout(()=>{
                //     dispatch(getUsers())
                // },900) 
                // setTimeout(()=>{
                //     dispatch(getAllPosts())
                // },900) 
                dispatch(getUserPosts(authResult.uid))
                
                onSnapshot(collection(database,"usuarios/"+authResult.uid+"/solicitudes"),(snapshot)=>{
                    const solicitudes =[]
                    snapshot.docs.map((doc)=>solicitudes.push({...doc.data(),id:doc.id}))
                   
                    dispatch(getSolicitud(solicitudes))
                })

                onSnapshot(collection(database,"usuarios/"+authResult.uid+"/friends"),(snapshot)=>{
                    const friends =[]
                    snapshot.docs.map((doc)=>friends.push({...doc.data(),id:doc.id}))
                   
                    dispatch(getFriends(friends))
                    dispatch(getUsers())
                })
                dispatch(getUsers())
                dispatch(getAllUsers())
                // dispatch(getSolicitud(authResult.uid))
                // dispatch(getFriends(authResult.uid))
                
                
            }else{
                dispatch(logout())
            }
        })
        dispatch(getUsers())
        dispatch(getFriends())
        
        
        
        
    },[])
  return (
    <main className='bg-color2-backg  h-full'>
        <NavBar/>
        
        <div className='mt-14 '>
            {children}
        </div>
        
        
    </main>
  )
}