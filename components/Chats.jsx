
import { child, get, onValue, push, ref, remove, set, } from 'firebase/database'
import { Router, useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { realTimeDB } from '../config/firebase'

export default function Chats({idUser,idFriend}) {
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
            }else{
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
        setTimeout(()=>{baja()},1000)  
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
        <div className='bg-color1-nav '>
        
            {users.map((user)=>{
                if(user.id===idFriend){
                    return <div className='flex gap-4 items-center p-4 bg-color8-inputs border-y-2 border-color6-lineas text-white w-full fixed top-14'>
                        <div className='h-8 w-8 rounded-full overflow-hidden bg-black flex'>
                            <img className='w-8' src={user.profilePic} alt="" />
                        </div>
                        <p>{user.name}</p>
                    </div>
                }
            })}
        
        <div className="bg-color1-nav h-full max-h-full   ">
          <div className=' h-full overflow-auto mt-20 mb-12  '>
          {Object.entries(messages).map(([id,data])=>(
              <div key={id} className="h-full overflow-auto " >
                
                  {data?.sended===idUser?<div className='h-full '>
                          {users.map((user)=>{
                              if(user.id===idUser){
                                  return <div key={idUser} className='flex  justify-end '>
                                      <div className='bg-color5-recuatros shadow-md shadow-emerald-500 w-fit flex gap-2 text-white p-2 m-2 rounded-md items-center'>
                                        <div className='h-6 w-6 rounded-full overflow-hidden flex'>
                                            <img className='w-6' src={user.profilePic} alt="" />
                                        </div>
                                          <p>{data.content}</p>
                                          <button className='bg-red-300 h-1 w-1 rounded-full p-2 flex items-center justify-center text-xs'onClick={()=>{deleteMessage(id)}}>x</button>
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
          </div>
          <div ref={botton}/>
          <div className=' bg-emerald-400 p-2 fixed bottom-0  w-9/12 '>
              <input ref={messageInput} type="text" className=" outline-none p-1 text-black w-4/5" onKeyDown={(e)=>{sendMessage(e)}} placeholder='Escribe tu mensaje' />
              <button  className='p-1 bg-color1-nav text-white w-1/5' onClick={()=>{sendMessage("Enter")}} >Enviar</button>
          </div>
        </div>
    </div>
  )
}
