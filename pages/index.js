import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { AiOutlineLike } from 'react-icons/ai';
import { FaComment,FaRegComment } from 'react-icons/fa'; 
import {GiCancel  } from 'react-icons/gi'; 
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs,setDoc, onSnapshot} from 'firebase/firestore'
import { database } from '../config/firebase'
import { agregarPost, deletePost, editePost, getAllPosts, getPosts } from '../features/posts';
import Link from 'next/link'
import { acceptFriend, addFriend, declineFriend, getFriends, getSolicitud,getUsersSolicitud } from '../features/friends/solicitudes';
import { getUsers  } from '../features/users';

export default function Home() {
  const [solicitudes2,setSolicitudes2]=useState([])
  const [showComments, setShowComments]=useState(false)
  const auth = useSelector(state=>state.auth)
  const posts = useSelector(state=>state.posts.items)
  
  const allposts = useSelector(state=>state.posts.allposts)
  const pending = useSelector(state=>state.friends.pendingFriends)
  
  
  const users = useSelector(state=>state.users.usuarios)
  
  const solicitudes = useSelector(state=>state.friends.solicitudes)
  console.log(solicitudes)
  const friends = useSelector(state=>state.friends.friends)
  
  
  // console.log(usuarios)
  const [publicacion,setPublicacion]= useState(false)
  const [respuesta,setRespuesta]= useState(false)
  const [openpost,setopenPost]= useState(false)
  // const [comentario,setComentario]= useState(false)
  const [post,setPost]=useState({})
  

  const dispatch=useDispatch()
  const publicar=(event)=>{
    event.preventDefault()
    
    const publicacion={
      text:event.target.publicacion.value,
      img:event.target.imagen.value,
      name:event.target.name.value,
      profilePic:event.target.profilePic.value,
      comments:[],
      idUser:event.target.id.value
      
    }
    const col = collection(database,`usuarios/${auth.user.id}/posts/`)
    addDoc(col,publicacion)
    setPublicacion(false)
    dispatch(getPosts(auth.user.id))
  }
  
  const agregarComentario =async(id,idUser,e) =>{
    
    if(e.key === "Enter"){
      
      const comentario = {
        comentario:e.target.value,
        name:auth.user.name,
        profilePic:auth.user.profilePic,
        id:auth.user.id,
        date:Date.now()

      }
     
      const col = collection(database,"usuarios",idUser,"posts")
      const snapshot = await  getDocs(col)
      const posts = []
  
      snapshot.forEach(doc=>{
        posts.push({...doc.data(),id:doc.id})
      })

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
      dispatch(getAllPosts())
      dispatch(getPosts(auth.user.id))
      e.target.value=""
    }
    
  }
  const eliminarComentario =(idPost,idCom,idUser)=>{
    const comentarios =[]
    allposts.map((post)=>{
      if(post.id===idPost){
        post.comments.forEach(element => {
          comentarios.push(element)
        });
      }
    })
    // console.log(commentario)
    const newComments=[]
    comentarios.map((com)=>{
      if(com.date!==idCom){
        newComments.push(com)
      }
    })
    console.log(comentarios,newComments)
    const docRef = doc(database,`usuarios/${idUser}/posts/${idPost}` )
      updateDoc(docRef,{
        comments:newComments
        
      })
      dispatch(getAllPosts())
      dispatch(getPosts(auth.user.id))
  }

  const agregarAmigo=(idFriend)=>{
    // console.log(idFriend)
    dispatch(addFriend(idFriend))
    // dispatch(getSolicitud(auth.user.id))
    dispatch(getFriends(auth.user.id))
    // dispatch(getUsersSolicitud(idFriend))
    setTimeout(()=>{
      dispatch(getUsers())
  },900) 
  }
  const aceptarSolicitud=(idFriend,idSolicitud,name,profilePic)=>{
    // console.log(idFriend,idSolicitud,name,profilePic)
    dispatch(acceptFriend({idUser:auth.user.id,idFriend:idFriend,idFriend,idSolicitud,name,profilePic}))
    dispatch(getFriends(auth.user.id))
    // dispatch(getSolicitud(auth.user.id))
     setTimeout(()=>{dispatch(getUsers())},400)  
    
  }
  const eliminarSolicitud=(idFriend,idSolicitud)=>{
    // console.log(idFriend,idSolicitud,name,profilePic)
    dispatch(declineFriend({idFriend,idSolicitud}))
    dispatch(getFriends(auth.user.id))
    // dispatch(getSolicitud(auth.user.id))
    dispatch(getAllPosts())
    
  }
 
  const hola=()=>{
    dispatch(getAllPosts())
    
  }
  
  const u =()=>{
    dispatch(getUsers())
  }
  
  const eliminarPost=(idPost)=>{
    dispatch(deletePost({idUser:auth.user.id,idPost:idPost}))
    dispatch(getPosts(auth.user.id))
  }



  const tomarPost=(idPost)=>{
    setopenPost(true)
    console.log(idPost)
    posts.map((post)=>{
      if(post.id===idPost){
        setPost({...post,idPost})
      }
    })
    
  }
  console.log(post.comments)

  
  const editarPost=(event)=>{
    event.preventDefault()
    const posteditado={
      text:event.target.publicacion.value,
      img:event.target.imagen.value,
      name:event.target.name.value,
      profilePic:event.target.profilePic.value,
      
      idUser:event.target.id.value,
      
      
    }
    
    const idPost=event.target.idPost.value
    
    
    dispatch(editePost({idUser:auth.user.id,idPost:idPost,post:posteditado}))
    dispatch(getPosts(auth.user.id))
    setopenPost(false)
  }

console.log(solicitudes)
useEffect(()=>{
  // dispatch(getFriends(auth.user.id))

  setTimeout(hola,1000)
  setTimeout(u,800)
  dispatch(getUsers())
  
  
   
},[])

  return (
    <main className=' max-w-6xl m-auto '>
      {friends?.map((friend)=><div>
        <p>{friend?.name}</p>
      </div>)}
       {publicacion&&<div className='z-30'>
                <div className='absolute left-0 top-0 h-screen w-full bg-black bg-opacity-50 z-10' onClick={()=>{setPublicacion(false)}}></div>
                <div className="bg-color3-publicacion w-[500px] p-10 absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10">
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={()=>{setPublicacion(false)}}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={publicar} >
                        <input autoComplete="off" className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicación' type="text" />
                        
                        
                        <input className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='name' value={auth.user.name} placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='profilePic' value={auth.user.profilePic}placeholder='Image...' type="text" />
                        <input hidden className='' name='id' value={auth.user.id} placeholder='' type="text" />
                        
                       
                        <button type='submit' className='bg-color4-comentarios mt-5 py-4 text-xl font-bold text-lavender-100 rounded-md'>Publicar</button>
                    </form>
                </div>
            </div>}
            {openpost&&<div className='z-30'>
                <div className='absolute left-0 top-0 h-screen w-full bg-black bg-opacity-50 z-10' onClick={()=>{setPublicacion(false)}}></div>
                <div className="bg-color3-publicacion w-[500px] p-10 absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10">
                    <h2 className='text-white text-3xl text-center text-shadow-lg '>Edita tu publicación</h2>
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={()=>{setopenPost(false)}}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={editarPost} >
                        <input autoComplete="off" className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicación' type="text" defaultValue={post.text} />
                        
                        
                        <input className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" defaultValue={post.img} />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='name' value={auth.user.name} placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='profilePic' value={auth.user.profilePic}placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='id' value={auth.user.id}placeholder='' type="text" />
                        <input hidden className='' name='idPost' value={post.idPost} placeholder='' type="text" />
                        <input hidden className='' name='comments' value={post.comments} placeholder='' type="text" />
                        
                        <button type='submit' className='bg-color4-comentarios mt-5 py-4 text-xl font-bold text-lavender-100 rounded-md'>Publicar</button>
                    </form>
                </div>
            </div>}
            
      <section className='flex justify-between'>
        
        <section className='w-2/6  h-fit'>
          <p className='text-xl text-white text-shadow-xl my-5'>Solicitudes de amistad</p>
          
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
          
          
        </section>
        <section className='w-full relative '>
          <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-6'>
            
            <button onClick={()=>{setPublicacion(true)}} className='bg-color4-comentarios w-full text-left  p-2 rounded-lg text-gray-400'> Realiza una publicación</button>
            
          </article>
          <article className='flex justify-center'>
            <button onClick={hola} className="w-1/2 text-center bg-color4-comentarios text-white text-shadow-lg shadow-lg rounded-lg p-2 m-auto"> Actualizar</button>
          </article>
          
          {allposts.map((post)=>
          <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-6 relative'>
            {post.idUser===auth.user.id&&<div>
              <button className='absolute top-1 right-1 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarPost(post.id)}}>X</button>
              <button className='absolute top-1 right-6 bg-red-300 text-white  px-2 text-xs rounded-full' onClick={()=>{tomarPost(post.id)}}>editar</button>
            </div>}
            
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-12 h-12 overflow-hidden rounded-full flex items-center'>
                <Link href={"/profile/"+post.idUser}  className='w-10 h-10 overflow-hidden rounded-full flex items-center'>
                      <a><img className='w-16 h-16 ' src={post.profilePic} alt="" /></a>
                      
                      
                </Link>
              </div>
            
              <p className='text-sm'>{post.name}</p>
              
              
              <p className='text-gray-500 text-sm'>9h</p>
              
            </div>
            <p className='mb-2'>{post.text}</p>
            
            <img className='rounded-md min-w-full m-auto ' src={post.img}/>
            <article className='flex gap-4 m-2'>
              <div><AiOutlineLike className='text-2xl'/></div>
              <button onClick={()=>{setShowComments(!showComments)}}><FaRegComment className='text-2xl'/></button>
            </article>
            
            {post.comments?.map((comment)=>
              <article className='bg-color4-comentarios rounded-md p-2 mb-2'>
                <article className='flex items-center gap-2 mb-2'>
                    <Link href={"/profile/" + comment.id} className='w-10 h-10 overflow-hidden rounded-full flex items-center '>
                    
                      <img className='w-10 h-12' src={comment.profilePic} alt="" />
                      
                    </Link>
                    <div className='w-full relative'>
                      <p className='text-xs '>{comment.name}</p>
                      <p className='ml-2 '>{comment.comentario}</p>
                      {/* <button className='ml-2 text-xs text-shadow-sm   text-white w-16 rounded-sm' onClick={()=>{setRespuesta(!respuesta)}}>Responder</button>
                      {respuesta&&
                        <div className="">
                          <input  className='w-2/3 ml-5 ' type="text" placeholder='Escribe tu respuesta'/>
                        </div>} */}
                      {comment.id===auth.user.id&&<button className='absolute top-1 right-1 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarComentario(post.id,comment.date,post.idUser)}}>X</button>}
                    </div>
                </article>
            </article>
            )}
            
            {/* {comentario&& */}
            <article className='bg-color4-comentarios rounded-md p-2 mb-2'>
              <article className='flex items-center gap-2 py-2'>
                  <input className='bg-color3-publicacion my-auto py-1 rounded-md w-full' name="comentario" type="text" placeholder='Deja tu comentario' 
                  
                  onKeyDown={(event)=>{agregarComentario(post.id,post.idUser,event)}}
                  
                  />
                  
              </article>
            </article>
          {/* } */}
            
          </article>)
          }
          
          
          
        </section>
        <section className='w-2/6 my-6 h-fit bg-color4-comentarios  p-2 rounded-lg shadow-xl'>
          <h2 className='my-4 text-sm'>Personas que quizás conozcas</h2>
          {users?.map((user)=>{
    
            if(user.id!==auth.user.id){
              return <article  className='bg-white mb-2 p-1 flex flex-col rounded-md shadow-xl'>
            
                <Link href={"/profile/" + user.id} className='h-full   flex gap-3  items-center w-full  p-1 rounded-md   '>
                  <a>
                        <div className='w-10 h-10 overflow-hidden bg-black rounded-full flex items-center'>
                          
                          <img className='w-10 h-auto m-auto ' src={user.profilePic} alt="" />
                          
                        </div>
                       
                         <p className=' h-fit'>{user.name}</p>
                  </a>
              </Link>
               <button className='bg-cyan-400 p-1 rounded-md m-auto my-2 shadow-lg' onClick={()=>{agregarAmigo(user.id)}}>Agregar a mis amigos</button>
              </article>
           }
  
          })}
          
        </section>
      </section>
    </main>
  )
}
