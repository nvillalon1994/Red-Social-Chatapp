import React, { useState } from 'react'
import { database } from '../config/firebase' 
import {collection,doc,getDocs,getDoc,updateDoc} from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineLike } from 'react-icons/ai';
import { FaComment,FaRegComment } from 'react-icons/fa'; 
import {GiCancel  } from 'react-icons/gi'; 
import Link from 'next/link';
import { getPosts } from '../features/posts';

export async function getStaticPaths(){
    const col = collection(database,"usuarios")
    const docs = await getDocs(col)

    const usuarios=[]

    docs.forEach(doc=>{
        usuarios.push({...doc.data(),id:doc.id})
    })

    const paths = usuarios.map(usuario=>({
        params:{
            id:usuario.id
        }
    }))
    return {
        paths,
        fallback:false
    }
}
export async function getStaticProps({params}){
    const document = doc(database,"usuarios",params.id)
    const usuarioDocument = await getDoc(document)
    
    const col = collection(database,"usuarios",params.id,"posts")
    const snapshot = await getDocs(col)
    const posts = []

    snapshot.forEach(doc=>{
      posts.push({...doc.data(),id:doc.id})
    })
    const usuario = usuarioDocument.data()
    
    return {
        props:{
            usuario,
            posts
        },
        
    }
}

export default function Perfil({usuario,posts}) {
    
    const [comentario,setComentario]= useState(false)
    const auth = useSelector(state=>state.auth)
    const friends = useSelector(state=>state.friends.friends)
    // const posts = useSelector(state=>state.posts.items)
    console.log(friends)
    const dispatch = useDispatch()

    const agregarComentario =(id,idUser,e) =>{
    
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

    
          const docRef = doc(database,`usuarios/${idUser}/posts/${id}` )
          updateDoc(docRef,{
            comments:comentarios
            
          })
          dispatch(getPosts(idUser))
          
          e.target.value=""
          location.reload()
        }
        
      }
  return (
    <section className='max-w-6xl m-auto flex   '>
        <section className='my-6 flex flex-col bg-color3-publicacion shadow-xl shadow-black rounded-lg w-1/4 gap-2 pt-5 '>
            <article>
                <div className='w-40 h-40 overflow-hidden bg-black flex items-center rounded-full shadow-xl border-2 border-black m-auto'>
                    <img className='max-w-40 w-40  ' src={usuario.profilePic}  alt="profilePic" />
                </div>
                <h1 className='m-auto  text-xl text-center mt-2 font-semibold w-40'>{usuario.name}</h1>
                <p className='m-auto  text-md text-center mt-2  w-40  overflow-hidden hover:overflow-visible'>{usuario.email}</p>
            </article>
            <article className='mx-auto'>
                <h3 className='m-auto  text-xl text-left mt- font-semibold w-40'>Fotos</h3>
                <article className='flex'>
                    {posts.map((post)=><article>
                        <div className='w-20 h-16 overflow-hidden bg-black flex items-center  shadow-xl border-2 border-black'>
                            <img className='max-h-40 h-20 ' src={post.img}  alt="profilePic" />
                        </div>
                    </article>)}
                </article>
                
                
            </article>
            
        </section>
        <section className='w-2/3'>
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
                  
                  onKeyDown={(event)=>{agregarComentario(post.id,post.idUser,event)}}
                  
                  />
                  
              </article>
            </article>}
            
          </article>
            )}
        </section>
    </section>
  )
}
