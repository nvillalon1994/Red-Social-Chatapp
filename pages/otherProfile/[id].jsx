import React, { useEffect, useState } from 'react'
import { database } from '../../config/firebase' 
import {collection,doc,getDocs,getDoc,updateDoc, addDoc} from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineLike } from 'react-icons/ai';
import { FaComment,FaRegComment } from 'react-icons/fa'; 
import {GiCancel  } from 'react-icons/gi'; 
import Link from 'next/link';
import { deletePost, editePost, getPosts } from '../../features/posts';
import { deleteFriend } from '../../features/friends/solicitudes';
import { useRouter } from 'next/router';
import { getAllUsers, getUserFriends, getUserPosts, getUserProfile } from '../../features/users';
import { getDownloadURL, ref , uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../config/firebase';


export default function Perfil() {
      const friends = useSelector(state=>state.users.usuario.friends)
      const usuario = useSelector(state=>state.users.usuario.usuario)
      const posts = useSelector(state=>state.users.usuario.posts)
      const [publicacion,setPublicacion]= useState(false)
      const [openpost,setopenPost]= useState(false)
      const [imgpost,setimgpost]= useState()
      const [progress,setProgress]= useState(0)
      const [post,setPost]= useState({})
      const allUsers = useSelector(state=>state.users.allUsers)
      console.log(allUsers)
      console.log(friends)
      console.log(usuario)
      console.log(posts)
      const router = useRouter()
      const { id } = router.query
      console.log(id)
      
      const auth = useSelector(state=>state.auth)
      
      
      const dispatch = useDispatch()


      const like=(idPost,idUser)=>{
        const like={
          idPost:idPost,
          name:auth.user.name,
          id:auth.user.id
        }
        const likes =[]
        posts.map((post)=>{
          if(post.id===idPost){
            post.likes.forEach(element => {
              likes.push(element)
            });
          }
        })
        // likes.push(like)
        
        const a = likes.find((e)=>e.id===like.id)
        console.log(a)
        if(a===undefined){
          likes.push(like)
          console.log(likes)
          const docRef = doc(database,`usuarios/${idUser}/posts/${idPost}` )
            updateDoc(docRef,{
              likes:likes
              
            })
          console.log("no esta lo creo")
          dispatch(getUserPosts(id))
          
          
        }else{
          const newLikes=likes.filter((e)=>e.id!==like.id)
          console.log(newLikes)
          const docRef = doc(database,`usuarios/${idUser}/posts/${idPost}` )
            updateDoc(docRef,{
              likes:newLikes
              
            })
          console.log("esta lo quito")
          dispatch(getUserPosts(id))
          
        }
        
      }
      const agregarComentario =(id2,idUser,e) =>{
          // e.preventDefault()
          if(e.key === "Enter"){
            
            const comentario = {
              comentario:e.target.value,
              name:auth.user.name,
              // profilePic:auth.user.profilePic,
              date:Date.now(),
              id:auth.user.id

            }
            const comentarios = []
            posts.map((post)=>{
              if(post.id===id2){
                
                post.comments.forEach(element => {
                  comentarios.push(element)
                });
                comentarios.push(comentario)
              }
              
      
            })

      
            const docRef = doc(database,`usuarios/${idUser}/posts/${id2}` )
            updateDoc(docRef,{
              comments:comentarios
              
            })
            
            dispatch(getUserPosts(id))

            e.target.value=""
            
            // location.reload()
          }
          
        }



      const eliminarComentario =(idPost,idCom,idUser)=>{

        console.log(idCom)
        const comentarios =[]
        posts.map((post)=>{
          if(post.id===idPost){
            post.comments.forEach(element => {
              comentarios.push(element)
            });
          }
        })
        console.log(comentarios)
        const newComments=[]
        comentarios.map((com)=>{
          if(com.date!==idCom){
            newComments.push(com)
          }
        })
        console.log(comentarios,newComments)
        const docRef = doc(database,`usuarios/${id}/posts/${idPost}` )
          updateDoc(docRef,{
            comments:newComments
            
          })
          
          dispatch(getUserPosts(id))
      }  

      const publicar=(event)=>{
        event.preventDefault()
        
        const publicacion={
          text:event.target.publicacion.value,
          img:event.target.imagen.value,
          name:event.target.name.value,
          profilePic:event.target.profilePic.value,
          comments:[],
          idUser:event.target.id.value,
          likes:[]
          
        }
        const col = collection(database,`usuarios/${auth.user.id}/posts/`)
        addDoc(col,publicacion)
        setPublicacion(false)
        dispatch(getUserPosts(auth.user.id))
      }

      const eliminarPost=(idPost)=>{
        dispatch(deletePost({idUser:auth.user.id,idPost:idPost}))
        dispatch(getUserPosts(id))
        
      }
      const eliminarAmigo=(idFriend)=>{
        dispatch(deleteFriend(idFriend))
        dispatch(getUserFriends(id))
        // location.reload()
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
        
        
        dispatch(editePost({idUser:id,idPost:idPost,post:posteditado}))
        dispatch(getUserPosts(id))
        setopenPost(false)
      }
      const h=()=>{
        console.log("id:",id)
          dispatch(getUserProfile(id))
          dispatch(getUserPosts(id))
          dispatch(getUserFriends(id))
      }

      const subir =(e)=>{
        e.preventDefault()
        console.log("estas en subir",e.target.files[0])
        const file = e.target.files[0]
        // console.log(file)
        uploadFiles(file)
        
        
      }
      
      const uploadFiles =(file)=>{
        console.log("entraste a uploadfile")
        if(!file)return
            
            const storageRef =ref(storage,`/files/${auth.user.id}/images/"${file.name}`)
            console.log("entraste a uploadfile2")
            const uploadTask= uploadBytesResumable(storageRef ,file)
            console.log("entraste a uploadfile3")
            uploadTask.on("state_changed",(snapshot)=>{
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) *100)
                setProgress(prog)
            },(err)=>console.log(err),
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref)
                .then((url)=>{
                  console.log("la url es", url)
                  setimgpost(url)
                  
                         
                  
                  
                })
            }
            )
            
            
        
      }
      const [mostrarProg,setMostrarProg]=useState(false)
      console.log(usuario)
      const cerrarPublicacion=()=>{
        setPublicacion(false)
        setimgpost()
        setProgress(0)
      }
      useEffect(()=>{
        
        if(router.isReady){
          dispatch(getUserProfile(id))
          dispatch(getUserPosts(id))
          dispatch(getUserFriends(id))
        }

      },[router.isReady])
      const profilePic = usuario.profilePic
  return (
    <section className='xl:max-w-6xl 2xl:max-w-screen-2xl m-auto flex flex-col justify-center items-center   '>
             {publicacion&&<div className='z-30'>
                <div className='fixed left-0 top-0 h-screen w-full bg-black bg-opacity-50 z-10' onClick={()=>{setPublicacion(false)}}></div>
                <div className="bg-color3-publicacion w-[500px] sm:w-[300px] p-10 fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10">
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={cerrarPublicacion}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={publicar} >
                        <input autoComplete="off" className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicación' type="text" />
                        
                        
                        <input className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Imagen...' type="text" defaultValue={imgpost} />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='name' value={auth.user.name} placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='profilePic' value={auth.user.profilePic} placeholder='Image...' type="text" />
                        <input hidden className='' name='id' value={auth.user.id} placeholder='' type="text" />
                        <img src={imgpost}/>
                        <div className="relative h-5">
                            <div className="absolute z-[0] top-[1px] left-[0px] bg-cyan-400 bg-opacity-70 px-2 py-[2px] text-white" >Seleccionar archivo</div>
                            {mostrarProg&&<p className='absolute top-0 left-40'>Cargando Imagen:{progress}%</p>}
                            <input className=" absolute z-[1] top-[1px] left-[0px] w-40 opacity-0" type="file" onChange={subir} onClick={()=>{setMostrarProg(true)}} />
                        </div>
                        
                       
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
        <section className=' flex flex-col items-center bg-color3-publicacion shadow-xl shadow-black rounded-lg  gap-2 pt-5 min-h-[450px] sm:min-h-fit sm:h-[265px] h-fit relative w-3/4'>
            <div className='h-80 w-full overflow-hidden '>
              
              {/* <img className='w-full  ' src={"https://images.unsplash.com/photo-1616039407041-5ce631b57879?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"} alt="" /> */}
              <img className='w-full sm:mb-20 ' src={usuario.portadaPic} alt="" />
            </div>
            
            <article className='flex gap-3 absolute left-2 bottom-2 2xl:left-4 2xl:bottom-4'>
              
                {/* <div className='h-40 w-40 rounded-full overflow-hidden bg-black flex justify-center'>
                    <img className=' ' src={usuario?.profilePic}  alt="profilePic" />
                </div> */}
                <div  href={"/profile/"+post.idUser}  className="flex  relative w-40 h-40 sm:w-20 sm:h-20 overflow-hidden rounded-full bg-black ">
                          <img className='w-full h-auto m-auto' src={usuario.profilePic} alt="" />
                          
                          
                </div>
                <h1 className='m-auto  text-2xl sm:text-sm font-semibold w-fit text-white text-shadow-xl 2xl:text-4xl'>{usuario?.name}</h1>
                {/* <p className='m-auto  text-md text-center mt-2  w-40  overflow-hidden hover:overflow-visible'>{usuario?.email}</p> */}
            </article>
            
            
        </section>
        <section className='flex gap-7 justify-between  w-3/4   '>

            <section className='flex flex-col bg-color3-publicacion  shadow-xl shadow-black rounded-lg  gap-2 mt-6 pt-7 min-h-[450px] w-1/3 h-fit  2xl:w-2/5 sm:hidden'>
              <h3 className='mx-3  text-xl text-left  font-semibold w-40'>Fotos</h3>
                <article className='mx-3'>
                
                    <article className='grid grid-cols-3'>
                        {posts.map((post)=>
                        <article>
                          
                          {post.img!==""&&<div className='w-20 h-16 lg:w-16 lg:h-12 mb-2 overflow-hidden rounded-md flex items-center bg-black  '>
                                <img className='max-h-40 h-20 mx-auto ' src={post.img}  alt="profilePic" />
                                
                            </div>}
                        </article>)}
                    </article>
                </article>
                
                <h3 className=' text-xl text-left mx-3 font-semibold w-40 bottom-24'>Amigos</h3>
                <article className='grid grid-cols-3 m-3   h-fit'>
                  
                  {friends.map((friend)=><div href={"/profile/"+friend.id} className='flex items-center xl:w-20 xl:h-20 lg:w-16 lg:h-16 md:h- overflow-hidden relative rounded-md bg-black'>
                    {allUsers.map((user)=>{
                      if(user.id===friend.id){
                        return <Link href={"/otherProfile/"+friend.id} className=""><img className='w-full h-auto '  src={user.profilePic} alt="" /></Link>
                      }
                    })}
                    
                    <p className='absolute bottom-0 text-[11px] w-20 text-white text-center bg-black bg-opacity-50'>{friend.name}</p>
                    {usuario.id===auth.user.id&&<button className='absolute top-0 right-0 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarAmigo(friend.id)}}>X</button>}
                  </div>)}
                  {friends.map((friend)=><div href={"/profile/"+friend.id} className='flex items-center xl:w-20 xl:h-20 lg:w-16 lg:h-16 overflow-hidden relative rounded-md bg-black'>
                    {allUsers.map((user)=>{
                      if(user.id===friend.id){
                        return <Link href={"/otherProfile/"+friend.id} className=""><img className='w-full h-auto '  src={user.profilePic} alt="" /></Link>
                      }
                    })}
                    
                    <p className='absolute bottom-0 text-[11px] w-20 text-white text-center bg-black bg-opacity-50'>{friend.name}</p>
                    {usuario.id===auth.user.id&&<button className='absolute top-0 right-0 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarAmigo(friend.id)}}>X</button>}
                  </div>)}
                  {friends.map((friend)=><div href={"/profile/"+friend.id} className='flex items-center xl:w-20 xl:h-20 lg:w-16 lg:h-16 overflow-hidden relative rounded-md bg-black'>
                    {allUsers.map((user)=>{
                      if(user.id===friend.id){
                        return <Link href={"/otherProfile/"+friend.id} className=""><img className='w-full h-auto '  src={user.profilePic} alt="" /></Link>
                      }
                    })}
                    
                    <p className='absolute bottom-0 text-[11px] w-20 text-white text-center bg-black bg-opacity-50'>{friend.name}</p>
                    {usuario.id===auth.user.id&&<button className='absolute top-0 right-0 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarAmigo(friend.id)}}>X</button>}
                  </div>)}
                  
                  
                  
                </article> 
            </section>

            <section className=''>
              {usuario.id===auth.user.id&&<article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-6'>
                
                <button onClick={()=>{setPublicacion(true)}} className='bg-color4-comentarios w-full text-left  p-2 rounded-lg text-gray-400'> Realiza una publicación</button>
                
              </article>}
            {posts.map((post)=>
              <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-6 relative'>
                {post.idUser===auth.user.id&&<div>
                  <button className='absolute top-1 right-1 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarPost(post.id)}}>X</button>
                  <button className='absolute top-1 right-6 bg-red-300 text-white  px-2 text-xs rounded-full' onClick={()=>{tomarPost(post.id)}}>editar</button>
                </div>}
                
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-14 h-14 flex items-center relative overflow-hidden rounded-full bg-black'>
                    <Link href={"/profile/"+post.idUser}  className=''>
                          {usuario.id===post.idUser?<a><img className='w-full m-auto h-auto ' src={usuario.profilePic} alt="" /></a>:<a><img className='w-full m-auto h-auto' src={post.profilePic} alt="" /></a>}
                          
                          
                    </Link>
                  </div>
                  
                  <p className='text-sm'>{post.name}</p>
                  
                  
                  {/* <p className='text-gray-500 text-sm'>9h</p> */}
                  
                </div>
                <p className='mb-2'>{post.text}</p>
                <div className='bg-black bg-opacity-10'>
                  <img className='rounded-md  m-auto max-h-96 ' src={post.img}/>
                </div>
                <article className='flex gap-4 m-2'>
                  <div className='flex'><AiOutlineLike className='text-2xl text-red-500'onClick={()=>{like(post.id,post.idUser)}}/>{post.likes.length}</div>
                  <button onClick={()=>{setShowComments(!showComments)}}><FaRegComment className='text-2xl'/></button>
                </article>
                
                {post.comments?.map((comment)=>
                  <article className='bg-color4-comentarios rounded-md p-2 mb-2'>
                    <article className='flex items-center gap-2 mb-2'>
                      <div className='w-14 h-14 flex items-center relative overflow-hidden rounded-full bg-black'>
                     
                        
                        {allUsers.map((user)=>{
                          if(user.id===comment.id){
                            return  <Link href={"/otherProfile/" + comment.id} className='w-10 h-10 overflow-hidden rounded-full flex items-center '>
                              <img src={user.profilePic}/>
                            </Link>
                          }
                        })}
                        
                      
                      </div>
                        
                        <div className='w-full relative'>
                          <p className='text-xs '>{comment.name}</p>
                          <p className='ml-2 '>{comment.comentario}</p>
                          
                          
                          {comment.id===auth.user.id&&
                          <button className='absolute top-1 right-1 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarComentario(post.id,comment.date,post.idUser)}}>X</button>
                          } 
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
        </section>
        
    </section>
  )
}