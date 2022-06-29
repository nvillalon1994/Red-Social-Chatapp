
import { child, get, onValue, push, ref, remove, set, } from 'firebase/database'
import { Router, useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { realTimeDB } from '../config/firebase'
import {TiDelete, TiDeleteOutline} from 'react-icons/ti'
export default function ChatWindow({idUser,idFriend}) {
    const [messages,setMessages]= useState({})
    const {user2} = useSelector(state=>state.auth)
    const messageInput = useRef()
    const botton = useRef()
    const baja =()=>{
        console.log("baja")
        botton.current.scrollIntoView()
    }
    const users = useSelector(state=>state.users.allUsers)
    const router = useRouter()
    // const {idUser,idFriend} = router.query
    
    console.log(idUser,idFriend)
    const sendMessage =(e)=>{
        if(e.key==="Enter"){
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
        setTimeout(()=>{baja()},500)
        e.target.value=""
        }
        else{
            if(e==="Enter"){
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
                setTimeout(()=>{baja()},500)
            }
            
            
        }
          
        
    
}
    const deleteMessage =(idMessage)=>{
        const dbRef = ref(realTimeDB)
        const message = messageInput.current.value
        
        remove(child(dbRef,`${idUser}/${idFriend}/${idMessage}`))
        remove(child(dbRef,`${idFriend}/${idUser}/${idMessage}`))
    }
    useEffect(()=>{
        // setTimeout(()=>{baja()},1000)  
        if(idUser,idFriend){
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
      
    },[idUser,idFriend])
    
  return (
        <div className='h-96'>
            {users.map((user)=>{
                if(user.id===idFriend){
                    return <div className='flex gap-4 items-center p-2 bg-color1-nav text-white w-full'>
                        <div className='h-9 w-9 overflow-hidden rounded-full flex'>
                            <img className='w-9' src={user.profilePic} alt="" />
                        </div>
                        
                        <p>{user.name}</p>
                    </div>
                }
            })}
        <div className="bg-color4-comentarios    h-80   relative flex flex-col ">
          <div className='h-4/5 overflow-auto scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-blue-300 '>
          {Object.entries(messages).map(([id,data])=>(
              <div key={id} className=" " >
                
                  {data?.sended===idUser?<div className=' '>
                          {users.map((user)=>{
                              if(user.id===idUser){
                                  return <div key={idUser} className='flex  justify-end '>
                                      <div className='bg-color5-recuatros shadow-md shadow-emerald-500 w-fit flex gap-2 text-white p-2 m-2 rounded-md items-center'>
                                          <div className='h-7 w-7 overflow-hidden rounded-full flex'>
                                            <img className='w-7' src={user.profilePic} alt="" />
                                          </div>
                                          <p>{data.content}</p>
                                          <button className='  ml-1 flex items-center justify-center text-xs'onClick={()=>{deleteMessage(id)}}> <TiDeleteOutline className='text-color7-boton hover:text-red-500 hover:bg-white rounded-full flex items-center text-xl'/> </button>
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
                                      <div className='bg-color4-comentarios shadow-md shadow-emerald-500 w-fit flex gap-2 text-white p-2 m-2 rounded-md'>
                                        <div className='h-7 w-7 overflow-hidden rounded-full flex'>
                                            <img className='w-7' src={user.profilePic} alt="" />
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
          </div>
          <div ref={botton}/>
          <div className=' bg-emerald-500 p-2 h-14 fixed bottom-0 w-3/12 xl:w-5/12 lg:w-4/12 md:w-4/12  '>
              <input ref={messageInput} type="text" className=" outline-none text-black w-4/5 p-1" placeholder='Escribe tu mensaje' onKeyDown={(e)=>{sendMessage(e)}}/>
              <button  className='p-1 bg-color7-boton text-white w-1/5' onClick={()=>{sendMessage("Enter")}}>Enviar</button>
          </div>
        </div>
    </div>
  )
}
