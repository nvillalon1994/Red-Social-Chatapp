import React, { useEffect } from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from '../config/firebase'
import {useDispatch} from 'react-redux'
import { login, logout } from '../features/auth'
import NavBar from './NavBar'
import { getPosts } from '../features/posts'
import { getUsers } from '../features/users'

export default function Page({children}) {
    const dispatch = useDispatch()

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
                dispatch(getUsers())
            }else{
                dispatch(logout())
            }
        })
    })
  return (
    <main className='bg-color2-backg min-h-screen h-full'>
        <NavBar/>
        {children}
        
    </main>
  )
}