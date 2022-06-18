import React from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../config/firebase'
import {signOut} from 'firebase/auth'
import { BiLogOutCircle } from 'react-icons/bi';
import { AiFillBell,AiFillHome } from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';
import { ImEnters } from 'react-icons/im';
import {useRouter} from 'next/router'
import { useState } from 'react'
import { acceptFriend, addFriend, declineFriend } from '../features/friends/solicitudes'
import { getUsers } from '../features/users'
import { getAllPosts } from '../features/posts'
import { logout } from '../features/auth'
export default function Navbar() {
    const auth2 = useSelector(state=>state.auth)
    const solicitudes = useSelector(state=>state.friends.solicitudes)
    const friends = useSelector(state=>state.friends.friends)
    const allUsers = useSelector(state=>state.users.allUsers)
    const [open,setOpen]=useState(false)
    const [open2,setOpen2]=useState(false)
    const [openFriends,setOpenFriends]=useState(false)
    const users = useSelector(state=>state.users.usuarios)
    console.log(users)
    console.log(openFriends)
    const router = useRouter()
    const logout2=()=>{
      dispatch(logout())
      signOut(auth)
      
      router.replace("/login")
    }
    
    console.log(auth2.user.name)
    const dispatch= useDispatch()
    const agregarAmigo=(idFriend)=>{
      // console.log(idFriend)
      dispatch(addFriend(idFriend))
      // dispatch(getSolicitud(auth.user.id))
      // dispatch(getFriends(auth.user.id))
      // dispatch(getUsersSolicitud(idFriend))
    //   setTimeout(()=>{
    //     dispatch(getUsers())
    // },900) 
    }
    const aceptarSolicitud=(idFriend,idSolicitud,name)=>{
      // console.log(idFriend,idSolicitud,name,profilePic)
      dispatch(acceptFriend({idUser:auth2.user.id,idFriend:idFriend,idFriend,idSolicitud,name}))
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
        <nav className='bg-color1-nav p-5  shadow-lg  min-h-16 md:h-16 '>
            
            <ul className='nav1 md:flex   md2:flex sm:flex phone:flex   items-center gap-5 text-white justify-between max-w-6xl 2xl:max-w-screen-2xl  m-auto  '>
                <li className='logo'><Link href="/" >Insta-book</Link></li>
                {!auth2.logged&&<li><Link href="/login">Login</Link></li>}
                {auth2.logged&&
                <div className='flex gap-3 items-center sm:flex '>
                  <div className='relative '>
                    < AiFillBell className='text-2xl' onClick={()=>{setOpen(!open)}}/>
                    {solicitudes?.map((e)=>{
                    if(e.solicitud==="recibida"){
                      return <div className='absolute  top-0 right-[-7px] bg-red-300 h-4 w-4 text-white text-shadow-lg text-center rounded-full text-xs'>{solicitudes.length}
                      </div>}})}
                    
                  </div>
                  
                  <div className='flex gap-3 items-center w-8 h-8 rounded-full overflow-hidden bg-black'>
                 
                      
                    
                    
                    {allUsers.map((user)=>{
                        if(user.id===auth2.user.id){
                          return  <Link href={"/profile/" + auth2.user.id} className="flex  relative w-40 h-40 overflow-hidden rounded-full bg-black" ><img className='w-full h-auto m-auto' src={user.profilePic} alt=""onClick={()=>{setOpenFriends(false)}}/></Link>
                        }
                      })}
                        
                  </div>
                  
                  
                  
                  
                  
                  < BiLogOutCircle onClick={logout2} className='text-2xl'/>
                  
                  
                  
                  
                </div>}

            </ul>
            
            <ul className='relative md:hidden  flex items-center gap-5 text-white justify-around max-w-6xl 2xl:max-w-screen-2xl  m-auto py-3'>
            <Link href={"/"}>< AiFillHome className='text-2xl' 
            onClick={()=>{setOpen(false);setOpenFriends(false)}}
            /></Link>
            < FaUserFriends className='text-2xl ' onClick={()=>{setOpenFriends(true)}}/>
            
                  
            
            </ul>

            {open&&<div className='absolute md:top-16 2xl:right-48 xl:right-24 lg:right-16 md:right-8 sm:right-4 sm:top-32 z-20  w-60 text-center'>
              {solicitudes?.map((e)=>{
              if(e.solicitud==="recibida"){
                return <div className='bg-color4-comentarios p-3 flex flex-col justify-center items-center'>
                <div className='flex '>
                    <div className='flex gap-2 justify-between items-center mb-2 '>
                    {allUsers.map((user)=>{
                      if(user.id===e.idFriend){
                        return <div className='h-20 w-20 overflow-hidden rounded-md'>
                          <img className='h-28 w-full ' src={user.profilePic}/>
                          </div>
                      }
                    })}
                    <p className='text-white text-shadow-lg'>{e.name}</p>
                    
                    </div>
                  
                  
                </div>
                
                <div className='flex gap-2'>
                  <button className='bg-cyan-400 p-2 rounded-md m-auto ' onClick={()=>{aceptarSolicitud(e.idFriend,e.id,e.name,e.profilePic)}}>Aceptar</button>
                  <button className='bg-red-300 p-2 rounded-md m-auto'onClick={()=>{eliminarSolicitud(e.idFriend,e.id)}}>Rechazar</button>
                </div>
                
              </div>
              }})}
            </div>}
            {openFriends&&<section className='absolute top-32 right-0 z-10  w-screen h-screen text-center bg-color2-backg flex justify-center gap-10 md:hidden sm:flex'>
              <article className='flex justify-around w-full'>
                  <article className='border-color1-nav w-1/2 p-2 '>
                  <p className='text-xl text-gray-600 text-shadow-xl  mb-5'>Amigos</p>
                  {friends?.map((friend)=><Link href={"/otherProfile/"+friend?.id} className=''>
                    <a className='flex my-4 items-center gap-2 ' onClick={()=>{setOpenFriends(false)}}>
                    <div className='w-20 h-20 overflow-hidden bg-black  flex items-center'>
                    {allUsers.map((user)=>{
                      if(user.id===friend?.id){
                        return <img className='w-30 h-auto m-auto ' src={user.profilePic} alt="" />
                      }
                    })}        
                    
                                
                    </div>
                            
                    <p className=' h-fit text-gray-500 text-shadow-lg text-3xl'>{friend?.name}</p>
                    </a>
                  
                        
                  </Link>)}
                  
                  
                </article>
                <article className='  border-l-2 w-1/2 border-color1-nav p-2   '>
                      <h2 className='text-xl  text-gray-600 text-shadow-xl mb-5'>Personas que quizás conozcas</h2>
                      {users?.map((user)=>{
                
                        if(user.id!==auth2.user.id){
                          return <article  className='bg-white mb-2 p-1 flex flex-col rounded-md shadow-xl'>
                    
                        <Link href={"/otherProfile/"+user.id} className='h-full   flex gap-3   items-center w-full  p-1 rounded-md   '>
                          <a className='flex  items-center gap-4 sm:gap-0  w-full '>
                                <div className='w-14 h-14 overflow-hidden bg-black rounded-full flex items-center m-2 sm:m-0'>
                                  
                                  <img className='w-14 h-auto  ' src={user.profilePic} alt="" />
                                  
                                </div>
                              
                                <p className=' h-fit w-24  '>{user.name}</p>
                          </a>
                        </Link>
                        <button className='bg-cyan-400 xl:text-md  rounded-md m-auto my-2 text-white p-3 text-shadow shadow-lg lg:text-sm md:text-xs sm:text-[12px]' onClick={()=>{agregarAmigo(user.id)}}>Agregar a mis amigos</button>
                  </article>
                  }
          
                  })}
                  
                </article>
              </article>
            </section>}
            
            
        </nav>
  )
}