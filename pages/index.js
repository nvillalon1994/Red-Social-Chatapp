import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { AiOutlineLike } from 'react-icons/ai';
import { FaComment,FaRegComment } from 'react-icons/fa'; 
import {GiCancel  } from 'react-icons/gi'; 
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs,setDoc} from 'firebase/firestore'
import { database } from '../config/firebase'
import { getPosts } from '../features/posts';

export default function Home() {
  const auth = useSelector(state=>state.auth)
  const posts = useSelector(state=>state.posts.items)
  const users = useSelector(state=>state.users.usuarios)
  console.log(posts)
 
  const [publicacion,setPublicacion]= useState(false)
  const [respuesta,setRespuesta]= useState(false)
  const [comentario,setComentario]= useState(false)
  const dispatch=useDispatch()
  const publicar=(event)=>{
    event.preventDefault()
    
    const publicacion={
      text:event.target.publicacion.value,
      img:event.target.imagen.value,
      name:event.target.name.value,
      profilePic:event.target.profilePic.value,
      comments:[]
      
    }
    const col = collection(database,`usuarios/${auth.user.id}/posts/`)
    addDoc(col,publicacion)
    setPublicacion(false)
    dispatch(getPosts(auth.user.id))
  }
  
  const agregarComentario =(id,e) =>{
    
    if(e.key === "Enter"){
      
      const comentario = {
        comentario:e.target.value,
        name:auth.user.name,
        profilePic:auth.user.profilePic,
        id:auth.user.id
      }
      const comentarios = []
      posts.map((post)=>{
        if(post.id===id){
          
          post.comments.forEach(element => {
            comentarios.push(element)
          });
          comentarios.push(comentario)
        }
        

      })
      
      // console.log(comentarios)
      // console.log(comentarios)
      // const col = collection(database,`usuarios/${auth.user.id}/posts/`)
      // addDoc(col,comentario)

      const docRef = doc(database,`usuarios/${auth.user.id}/posts/${id}` )
      updateDoc(docRef,{
        comments:comentarios
        
      })
      dispatch(getPosts(auth.user.id))
      e.target.value=""
    }
    
  }
  
  return (
    <main className=' max-w-6xl m-auto '>
       {publicacion&&<div className='z-30'>
                <div className='absolute left-0 top-0 h-screen w-full bg-black bg-opacity-50 z-10' onClick={()=>{setPublicacion(false)}}></div>
                <div className="bg-color3-publicacion w-[500px] p-10 absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10">
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={()=>{setPublicacion(false)}}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={publicar} >
                        <input autoComplete="off" className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicación' type="text" />
                        
                        
                        <input className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='name' value={auth.user.name} placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='profilePic' value={auth.user.profilePic}placeholder='Image...' type="text" />
                       
                        <button type='submit' className='bg-color4-comentarios mt-5 py-4 text-xl font-bold text-lavender-100 rounded-md'>Publicar</button>
                    </form>
                </div>
            </div>}
      <section className='flex justify-between'>
        <section className='w-2/6  h-fit'>
          <p>Grupos</p>
          <p>Familia</p>
          <p>Futbol</p>
          <p>Secundaria</p>
        </section>
        <section className='w-full relative '>
          <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-6'>
            <button onClick={()=>{setPublicacion(true)}} className='bg-color4-comentarios w-full text-left  p-2 rounded-lg text-gray-400'> Realiza una publicación</button>
            
          </article>
          {posts.map((post)=>
          <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-6'>
            
            <div className='flex items-center gap-2 mb-3'>
            <div className='w-10 h-10 overflow-hidden rounded-full flex items-center'>
                    
                    <img className='w-10 h-12 ' src={post.profilePic} alt="" />
                    
                  </div>
              <p className='text-sm'>{post.name}</p>
              
              <p className='text-gray-500 text-sm'>9h</p>
              
            </div>
            <p className='mb-2'>{post.text}</p>
            
            <img className='rounded-md min-w-full m-auto ' src={post.img}/>
            <article className='flex gap-4 m-2'>
              <div><AiOutlineLike className='text-2xl'/></div>
              <button onClick={()=>{setComentario(!comentario)}}><FaRegComment className='text-2xl'/></button>
            </article>
            {post.comments?.map((comment)=>
              <article className='bg-color4-comentarios rounded-md p-2 mb-2'>
              <article className='flex items-center gap-2 mb-2'>
                  <div className='w-10 h-10 overflow-hidden rounded-full flex items-center '>
                  
                    <img className='w-10 h-12' src={comment.profilePic} alt="" />
                    
                  </div>
                  <div className='w-full'>
                    <p className='text-xs '>{comment.name}</p>
                    <p className='ml-2 '>{comment.comentario}</p>
                    {/* <button className='ml-2 text-xs text-shadow-sm   text-white w-16 rounded-sm' onClick={()=>{setRespuesta(!respuesta)}}>Responder</button>
                    {respuesta&&
                      <div className="">
                        <input  className='w-2/3 ml-5 ' type="text" placeholder='Escribe tu respuesta'/>
                      </div>} */}
                    
                  </div>
              </article>
            </article>
            )}
            
            {comentario&&<article className='bg-color4-comentarios rounded-md p-2 mb-2'>
              <article className='flex items-center gap-2 py-2'>
                  <input className='bg-color3-publicacion my-auto py-1 rounded-md w-full' name="comentario" type="text" placeholder='Deja tu comentario' 
                  
                  onKeyDown={(event)=>{agregarComentario(post.id,event)}}
                  
                  />
                  
              </article>
            </article>}
            
          </article>)}
          
          
          
        </section>
        <section className='w-2/6 my-6 h-fit bg-color4-comentarios  p-2 rounded-lg shadow-xl'>
          <h2 className='my-4 text-sm'>Personas que quizás conozcas</h2>
          {users.map((user)=>{
    
            if(user.id!==auth.user.id){
              return <article  className='bg-white mb-2 p-1 flex flex-col rounded-md shadow-xl'>
            
                <article className='h-full   flex gap-3  items-center w-full  p-1 rounded-md   '>
                        <div className='w-10 h-10 overflow-hidden bg-black rounded-full flex items-center'>
                          
                          <img className='w-10 h-auto m-auto ' src={user.profilePic} alt="" />
                          
                        </div>
                       
                         <p className=' h-fit'>{user.name}</p>
              </article>
               <button className='bg-cyan-400 p-1 rounded-md m-auto my-2 shadow-lg'>Agregar a mis amigos</button>
              </article>
           }
  
          })}
          
        </section>
      </section>
    </main>
  )
}
