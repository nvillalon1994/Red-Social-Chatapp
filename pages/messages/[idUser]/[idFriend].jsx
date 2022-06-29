import { isFulfilled } from '@reduxjs/toolkit'

import { child, get, onValue, push, ref, remove, set, } from 'firebase/database'
import { Router, useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ScrollToBottom from 'react-scroll-to-bottom';
import { realTimeDB } from '../../../config/firebase'
import {TiDelete, TiDeleteOutline} from 'react-icons/ti'
export default function Messages() {
    const [messages,setMessages]= useState({})
    const {user2} = useSelector(state=>state.auth)
    const messageInput = useRef()
    // const botton = useRef()
    // const baja =()=>{
    //     console.log("baja")
    //     botton.current.scrollIntoView()
    // }
    const users = useSelector(state=>state.users.allUsers)
    const router = useRouter()
    const {idUser,idFriend} = router.query
    users.map((user)=>{
        if(user.id===idFriend){
            console.log("es igual")
        }else{
            console.log("no es igual")
        }
    })
    console.log(idUser,idFriend)
    const sendMessage =()=>{
        const dbRef = ref(realTimeDB)
        const message = messageInput.current.value
        const id = Date.now()
        set(child(dbRef,`${idUser}/${idFriend}/${id}`),{
            content:message,
            sended:idUser,
            date:new Date().toISOString()
        })
        set(child(dbRef,`${idFriend}/${idUser}/${id}`),{
            content:message,
            sended:idUser,
            date:new Date().toISOString()
        })
        // setTimeout(()=>{baja()},200)  
        
    }
    const deleteMessage =(idMessage)=>{
        const dbRef = ref(realTimeDB)
        const message = messageInput.current.value
        
        remove(child(dbRef,`${idUser}/${idFriend}/${idMessage}`))
        remove(child(dbRef,`${idFriend}/${idUser}/${idMessage}`))
    }
    useEffect(()=>{
        // setTimeout(()=>{baja()},1000)  
        if(router.isReady){
            const chatRef = ref(realTimeDB,`${idUser}/${idFriend}`)
            // En tiempo real 
            onValue(chatRef,snapshot=>{
                    if(snapshot.exists()){
                        setMessages(snapshot.val())
                        
                    }else{
                        console.log("No existe")
                    }
            })
            
            
            // solo funciona una sola vez
            // get(child())
            // .then(snapshot=>{
            //     if(snapshot.exists()){
            //         setMessages(snapshot.val())
            //         console.log(Object.entries(snapshot.val()))
            //     }else{
            //         console.log("No existe")
            //     }
                
            // })
        }
        
    },[router.isReady])
    
  return (
    
        
        <>
        <ScrollToBottom className='h-[82vh]'>
        {users.map((user)=>{
                            if(user.id===idFriend){
                                return <div key={idFriend} className='flex gap-2 justify-start items-center'>
                                    <div className='bg-green-800 w-full flex gap-2 text-white p-2  items-center shadow-black shadow-md '>
                                        <div className='h-8 w-8 overflow-hidden rounded-full'>
                                            <img className='w-8' src={user.profilePic} alt="" />
                                        </div>
                                        
                                        <p>{user.name}</p>
                                    </div>
                                </div>
                            }
                        })}
        {Object.entries(messages).map(([id,data])=>(
            <div key={id} className=" "  >
                 
                {data?.sended===idUser?<div className=''>
                        {users.map((user)=>{
                            if(user.id===idUser){
                                return <div key={idUser} className='flex gap-2 justify-end '>
                                    <div className='bg-emerald-700 shadow-md shadow-black w-fit flex gap-2 text-white p-2 m-1 rounded-md items-center'>
                                        <div className='h-6 w-6 rounded-full overflow-hidden flex'>
                                            <img className='w-6' src={user.profilePic} alt="" />
                                        </div>
                                        
                                        <p>{data.content}</p>
                                        <button className='  rounded-full text-red-400 text-xl font-bold flex m-auto items-center justify-center'onClick={()=>{deleteMessage(id)}}><TiDelete/> </button>
                                    </div>
                                    
                                </div>
                            }
                        })}
                        {/* <img src={user.profilePic} alt="" /> */}
                        {/* <p>{user.name}:{data.content}</p> */}
                    </div>:
                    <div>
                        {users.map((user)=>{
                            if(user.id===data.sended){
                                return <div key={idFriend} className='flex gap-2 justify-start '>
                                    <div className='bg-green-500 shadow-md shadow-black w-fit flex gap-2 text-white p-2 m-2 rounded-md'>
                                    <div className='h-6 w-6 rounded-full overflow-hidden flex'>
                                            <img className='w-6' src={user.profilePic} alt="" />
                                        </div>
                                        <p>{data.content}</p>
                                    </div>
                                </div>
                            }
                        })}
                        
                        
                    </div>
                }

                
                
            </div>
        ))}
        {/* <div ref={botton}/> */}
        </ScrollToBottom>
        
        <div className=' bg-emerald-400 p-2  h-16  w-full flex fixed bottom-0 '>
            <input ref={messageInput} type="text" className=" outline-none text-black w-4/5" placeholder='Escribe tu mensaje' />
            <button  className='p-1 bg-color1-nav text-white w-1/5' onClick={(sendMessage)}>Enviar</button>
        </div>
        </>
    
  )
}
