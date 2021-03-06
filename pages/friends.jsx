import { collection, onSnapshot } from 'firebase/firestore'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Chats from '../components/Chats'
import ChatWindow from '../components/ChatWindow'
import { database } from '../config/firebase'
import { getFriends } from '../features/friends/solicitudes'
import { getUsers } from '../features/users'
import {RiChat3Fill} from 'react-icons/ri'

export default function Friends() {
  const friends = useSelector(state=>state.friends.friends)
  const auth = useSelector(state=>state.auth)
  const users = useSelector(state=>state.users.allUsers)
  console.log(friends,users)
  const dispatch = useDispatch()
  const [showChat,setShowChat]= useState(false)
  const [idFriend,setIdFriend]= useState()
  const tomarAmigo =(idFriend1)=>{
    
    setShowChat(true)
    setIdFriend(idFriend1)

  }
  useEffect(()=>{
    if(auth.user.id){
      onSnapshot(collection(database,"usuarios/"+auth.user.id+"/friends"),(snapshot)=>{
        const friends =[]
        snapshot.docs.map((doc)=>friends.push({...doc.data(),id:doc.id}))
       console.log(friends)
        dispatch(getFriends(friends))
        dispatch(getUsers())
      })

    }
    
  },[auth.user.id])
  return (
    <section className='h-full flex '>
        <section className='w-3/12 bg-color4-comentarios h-[94vh] md:hidden border-r-2 border-color6-lineas border-t-2 fixed '>
        {friends?.map((friend)=>
        
          <article className='' key={friend.id}>
            <article className='flex justify-between items-center gap-0 p-1  m-2  rounded-md shadow-sm hover:shadow-md hover:shadow-emerald-500 shadow-emerald-500   bg-color5-recuatros '>
            
              <div className='w-11/12  lg:w-3/4 flex  items-center  gap-2 lg:gap-0 lg:m-0  m-2'>
              {users.map((user)=>{
                if(user.id===friend.id){
                  return <div className='rounded-full overflow-hidden w-10 h-10 lg:hidden '>
                    <img className='h-10 lg:hidden' src={user.profilePic} alt="" />
                  </div>
                }
              })}
              <p className='w-3/4 lg:text-xs text-white  '>{friend.name}</p>
              </div>
              
              <RiChat3Fill className='text-emerald-600 text-shadow-xl text-2xl w-1/12   hover:h-8 hover:text-emerald-500' onClick={()=>{tomarAmigo(friend.id)}}/>
              {/* <button className='w-1/3' onClick={()=>{tomarAmigo(friend.id)}}>Enviar Mensaje</button> */}
              {/* <Link href={`/messages/${auth.user.id}/${friend.id}`} className='bg-color1-nav text-white p-3 rounded-md'>Enviar Mensaje</Link> */}
            </article>
          </article>

        )
        
        }
        </section>  

        <section className='w-full h-[94vh] 3xl:hidden md:inline-block flex flex-col '>
        {friends?.map((friend)=>
        
          
            <article key={friend.id} className='flex justify-between gap-4  bg-emerald-500 m-2 rounded-md p-4'>
              <div className='flex items-center  gap-2 w-11/12 '>
              {users.map((user)=>{
                if(user.id===friend.id){
                  return <div className='rounded-full overflow-hidden h-8 w-8 bg-black flex'>
                    <img className='w-9' src={user.profilePic} alt="" />
                  </div>
                }
              })}
                <p className='text-white text-sm font-semibold text-shadow-lg'>{friend.name}</p>
              </div>
              
              <Link href={`/messages/${auth.user.id}/${friend.id}`} ><RiChat3Fill className='text-emerald-600 text-shadow-xl text-2xl w-1/3   hover:h-8 hover:text-emerald-500' /></Link>
              {/* <Link href={`/messages/${auth.user.id}/${friend.id}`} className='bg-color1-nav text-white p-3 rounded-md'>Enviar Mensaje</Link> */}
            </article>
          

        )
        
        }
        </section>  

      {showChat&&<section className='w-9/12 bg-color1-nav h-[90vh] overflow-auto md:hidden fixed right-0'>
        <Chats idUser={auth.user.id} idFriend={idFriend}/>
      </section>}
    </section>
  )
}
