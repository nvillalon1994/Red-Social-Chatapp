import React from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../config/firebase'
import {signOut} from 'firebase/auth'
import { BiLogOutCircle } from 'react-icons/bi';
import { AiFillBell } from 'react-icons/ai';
import {useRouter} from 'next/router'
import { useState } from 'react'
import { acceptFriend, declineFriend } from '../features/friends/solicitudes'
import { getUsers } from '../features/users'
import { getAllPosts } from '../features/posts'

export default function Navbar() {
    const auth2 = useSelector(state=>state.auth)
    const solicitudes = useSelector(state=>state.friends.solicitudes)
    const [open,setOpen]=useState(false)
    const router = useRouter()
    const logout=()=>{
      signOut(auth)
      router.replace("/login")
    }
    
    console.log(auth2.user.name)
    const dispatch= useDispatch()
    const aceptarSolicitud=(idFriend,idSolicitud,name,profilePic)=>{
      // console.log(idFriend,idSolicitud,name,profilePic)
      dispatch(acceptFriend({idUser:auth2.user.id,idFriend:idFriend,idFriend,idSolicitud,name,profilePic}))
      // dispatch(getFriends(auth.user.id))
      // dispatch(getSolicitud(auth.user.id))
       setTimeout(()=>{dispatch(getUsers())},400)  
      
    }
    const eliminarSolicitud=(idFriend,idSolicitud)=>{
      // console.log(idFriend,idSolicitud,name,profilePic)
      dispatch(declineFriend({idFriend,idSolicitud}))
      // dispatch(getFriends(auth.user.id))
      // dispatch(getSolicitud(auth.user.id))
      dispatch(getAllPosts())
      
    }
    return (
        <nav className='bg-color1-nav p-5  shadow-lg  min-h-16 h-16'>
            
            <ul className='flex items-center gap-5 text-white justify-between max-w-6xl m-auto'>
                <li className='logo'><Link href="/" >aplication</Link></li>
                {!auth2.logged&&<li><Link href="/login">Login</Link></li>}
                {auth2.logged&&
                <div className='flex gap-3 items-center '>
                  <div className='relative '>
                    < AiFillBell className='text-2xl' onClick={()=>{setOpen(!open)}}/>
                    {solicitudes?.map((e)=>{
                    if(e.solicitud==="recibida"){
                      return <div className='absolute  top-0 right-[-7px] bg-red-300 h-4 w-4 text-white text-shadow-lg text-center rounded-full text-xs'>{solicitudes.length}
                      </div>}})}
                    
                  </div>
                  
                  <div className='flex gap-3 items-center w-8 h-8 rounded-full overflow-hidden bg-black'>
                  <Link href={"/profile/" + auth2.user.id}><img className='w-8  rounded-full' src={auth2.user.profilePic} alt="" /></Link>
                        
                  </div>
                  {/* <div className='w-8 h-8 overflow-hidden rounded-full flex items-center'>
                    
                    <Link href={"/" + auth2.user.id}><img className='h-8  rounded-full' src={auth2.user.profilePic} alt="" /></Link>
                    
                    
                  </div> */}
                  
                  
                  
                  
                  < BiLogOutCircle onClick={logout} className='text-2xl'/>
                  
                  
                  
                  
                </div>}

            </ul>
            {open&&<div className='absolute top-16 right-24 z-10 bg-red-500 w-60 text-center'>
              {solicitudes?.map((e)=>{
              if(e.solicitud==="recibida"){
                return <div className='bg-color1-nav p-3 flex flex-col justify-center items-center'>
                <div className='flex '>
                  <img className='h-14' src={e.profilePic}/>
                  <p>{e.name}</p>
                  {/* <p>{e.id}</p> */}
                </div>
                
                <div className='flex gap-2'>
                  <button className='bg-cyan-400 p-2 rounded-md m-auto ' onClick={()=>{aceptarSolicitud(e.idFriend,e.id,e.name,e.profilePic)}}>Aceptar</button>
                  <button className='bg-red-300 p-2 rounded-md m-auto'onClick={()=>{eliminarSolicitud(e.idFriend,e.id)}}>Rechazar</button>
                </div>
                
              </div>
              }})}
            </div>}
        </nav>
  )
}