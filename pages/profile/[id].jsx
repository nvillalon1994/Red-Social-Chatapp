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
      const [popDelPost,setDelPost]= useState(false)
      const [popDelCom,setdDelCom]= useState(false)
      const [popDelFriend,setdDelFriend]= useState(false)
      const [openpost,setopenPost]= useState(false)
      const [imgpost,setimgpost]= useState()
      const [progress,setProgress]= useState(0)
      const [post,setPost]= useState({})
      const [postDel,setPostDel]= useState({})
      const [name,setName]= useState()
      const [loadingedit, setLoadingEdit]=useState(false)
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
          likes:[],
          date:new Date()
          
        }
        const col = collection(database,`usuarios/${auth.user.id}/posts/`)
        addDoc(col,publicacion)
        setPublicacion(false)
        dispatch(getUserPosts(auth.user.id))
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
      const eliminarPost=(idPost)=>{
        dispatch(deletePost({idUser:auth.user.id,idPost:idPost}))
        dispatch(getUserPosts(id))
        setPostDel({})
        setDelPost(false)
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
      const tomarPostDel=(idPost)=>{
        setDelPost(true)
        console.log(idPost)
        posts.map((post)=>{
          if(post.id===idPost){
            setPostDel({...post,idPost})
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
          comments:[],
          likes:[]
          
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
      const subir2 =(e)=>{
        e.preventDefault()
        console.log("estas en subir",e.target.files[0])
        const file = e.target.files[0]
        // console.log(file)
        uploadFiles2(file)
        
        
      }
      
      const uploadFiles2 =(file)=>{
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
                  post["img"] = url
                  const newObject ={
                    prop:url
                  }
                  newObject[name]= newObject["prop"]
                  delete newObject["prop"]
                  console.log(newObject)
                  const objeto={...post,...newObject}
                  console.log(objeto)
                  setopenPost(false)
                  setLoadingEdit(true)
                  setPost(objeto)
                  setTimeout(()=>{
                    setLoadingEdit(false)
                    setopenPost(true)
                    
                  },1)
                  
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
      posts.map((post)=>{
        console.log(post.img)
      })
      useEffect(()=>{
        
        if(router.isReady){
          dispatch(getUserProfile(id))
          dispatch(getUserPosts(id))
          dispatch(getUserFriends(id))
        }

      },[router.isReady])
      // const profilePic = usuario.profilePic
  return (
    <section className=' m-auto flex flex-col justify-center items-center md:px-2  '>
              {popDelPost&&<div className='fixed flex justify-center items-center top-0 bg-black bg-opacity-80 w-full h-full  z-30'>
                <div className='w-1/2 p-2 rounded-md shadow-md shadow-emerald-500 flex flex-col gap-5 bg-color2-backg '>
                
                  <p className='text-white text-3xl text-center md:text-xl'>¿Esta seguro que desea borrar esta publicación?</p>
                  <div className='m-auto md:m-0 flex gap-3'> 
                    
                    <button className='text-white md:text-sm bg-color7-boton md:m-0 md:p-1 m-2 p-2 rounded-md hover:bg-color5-recuatros hover:shadow-emerald-500 hover:shadow-md'onClick={()=>{eliminarPost(postDel.id)}}>Sí, borrar publicación</button>
                    <button className='text-white md:text-sm bg-red-300 hover:bg-red-500 md:m-0 md:p-1 m-2 p-2 rounded-md hover:shadow-emerald-500 hover:shadow-md' onClick={()=>{setDelPost(false)}}>Cancelar</button>
                  </div>
                  
                  </div></div>
                }
             {publicacion&&<div className='z-30'>
                <div className='fixed left-0 top-0 h-screen w-full bg-black bg-opacity-50 z-10' onClick={()=>{setPublicacion(false)}}></div>
                <div className="bg-color3-publicacion w-[500px] p-10 fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10 sm:w-[300px]">
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={cerrarPublicacion}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={publicar} >
                        <input autoComplete="off" className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicación' type="text" />
                        
                        
                        {!mostrarProg?<input className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" defaultValue={imgpost} />:<input hidden className='p-4 md:p-2  bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" defaultValue={imgpost} />}
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='name' value={auth.user.name} placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='profilePic' value={auth.user.profilePic}placeholder='Image...' type="text" />
                        <input hidden className='' name='id' value={auth.user.id} placeholder='' type="text" />
                        <img className='max-h-60' src={imgpost}/>
                        {mostrarProg&&<p className=' mt-3 text-white '>Cargando Imagen:{progress}%</p>}
                        <div className="relative h-5">
                            <div className="absolute z-[0] top-[1px] left-[0px] bg-cyan-400 bg-opacity-70 px-2 py-[2px] text-white">Seleccionar archivo</div>
                            
                            <input className=" absolute z-[1] top-[1px] left-[0px] w-40 opacity-0" type="file" onChange={subir} onClick={()=>{setMostrarProg(true);}} />
                        </div>
                       
                        <button type='submit' className='bg-color4-comentarios mt-5 py-4 text-xl font-bold text-lavender-100 rounded-md hover:shadow-md hover:shadow-emerald-500 text-white'>Publicar</button>
                    </form>
                </div>
            </div>}
            {openpost&&<div className='z-30 '>
                <div className='fixed left-0 top-0  h-screen w-full bg-black bg-opacity-50 z-10' onClick={()=>{setPublicacion(false)}}></div>
                <div className="bg-color3-publicacion w-[500px] md:w-4/5 md:mt-4 md:p-2 mt-6 p-10 fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10">
                    <h2 className='text-white text-3xl text-center text-shadow-lg md:text-2xl '>Edita tu publicación</h2>
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={()=>{setopenPost(false)}}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={editarPost} >
                        <input autoComplete="off" className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicación' type="text" defaultValue={post.text} />
                        
                        
                        <input className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" defaultValue={post.img} />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='name' value={auth.user.name} placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='profilePic' value={auth.user.profilePic}placeholder='Image...' type="text" />
                        <input hidden className='p-4 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='id' value={auth.user.id}placeholder='' type="text" />
                        <img className='max-h-60' src={post.img}/>
                        {mostrarProg&&<p className=' mt-3 text-white '>Cargando Imagen:{progress}%</p>}
                        <div className="relative h-5">
                            <div className="absolute z-[0] top-[1px] left-[0px] bg-cyan-400 bg-opacity-70 px-2 py-[2px] text-white">Seleccionar archivo</div>
                            
                            <input className=" absolute z-[1] top-[1px] left-[0px] w-40 opacity-0" type="file" onChange={subir2} onClick={()=>{setMostrarProg(true);setName("img")}} />
                        </div>
                        <input hidden className='' name='idPost' value={post.idPost} placeholder='' type="text" />
                        <input hidden className='' name='comments' value={post.comments} placeholder='' type="text" />
                        
                        <button type='submit' className='bg-color4-comentarios mt-5 py-4 text-xl font-bold text-lavender-100 rounded-md'>Publicar</button>
                    </form>
                </div>
            </div>}
            {loadingedit&&<div className='z-30 '>
                <div className='fixed left-0 top-0  h-screen w-full bg-black bg-opacity-50 z-10'></div>
                
                
            </div>}
        <section className=' flex flex-col items-center bg-color3-publicacion shadow-md shadow-emerald-500 rounded-lg  gap-2 pt-5 min-h-[450px] md:min-h-[120px] h-fit md:h-48 relative w-3/4 md:w-full '>
            <div className='h-80 w-full overflow-hidden '>
              
              {/* <img className='w-full  ' src={"https://images.unsplash.com/photo-1616039407041-5ce631b57879?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"} alt="" /> */}
              <img className='w-full  ' src={usuario.portadaPic} alt="" />
            </div>
            
            <article className='flex gap-3 md:items-center items-center absolute left-2 bottom-2 md:gap-1  w-full'>
              
                {/* <div className='h-40 w-40 rounded-full overflow-hidden bg-black flex justify-center'>
                    <img className=' ' src={usuario?.profilePic}  alt="profilePic" />
                </div> */}
                <div  href={"/profile/"+post.idUser}  className="flex   w-40 h-40 md:w-20 md:h-20 overflow-hidden rounded-full bg-black ">
                          <img className='h-40 md:h-20' src={usuario.profilePic} alt="" />
                          
                          
                </div>
                <h1 className=' md:m-0 text-2xl md:text-base font-semibold   text-white text-shadow-xl '>{usuario?.name}</h1>
                {/* <p className='m-auto  text-md text-center mt-2  w-40  overflow-hidden hover:overflow-visible'>{usuario?.email}</p> */}
            </article>
            
            
        </section>
        <section className='flex gap-7 justify-between  w-3/4  md:w-full  '>

            <section className='flex flex-col bg-color3-publicacion  shadow-md shadow-emerald-500 rounded-lg  gap-2 mt-6 pt-7 min-h-[450px] w-2/5 h-fit  md:hidden'>
              <h3 className='mx-3  text-xl text-left  font-semibold w-40 text-white'>Fotos</h3>
                <article className='mx-0'>
                
                    <article className='grid 3xl:grid-cols-4 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2  px-3'>
                        {posts.map((post)=>
                        <article key={post.id} className=' w-24  overflow-hidden'>
                          
                          {post.img!==""&&<div className=' h-24  mb-2 overflow-hidden rounded-md flex items-center bg-black  '>
                                <img className=' ' src={post.img}  alt="profilePic" />
                                
                            </div>}
                        </article>)}
                    </article>
                </article>
                
                <h3 className=' text-xl text-left mx-3 font-semibold w-40 text-white'>Amigos</h3>
                <article className='grid grid-cols-5 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 m-3   '>
                  
                  {friends.map((friend)=><div key={friend.id} href={"/profile/"+friend.id} className='flex  h-20 w-20 overflow-hidden relative rounded-md bg-black'>
                    {allUsers.map((user)=>{
                      if(user.id===friend.id){
                        return <Link href={"/profile/"+friend.id} className=""><img onClick={()=>{
                          dispatch(getUserProfile(friend?.id))
                          dispatch(getUserPosts(friend?.id))
                          dispatch(getUserFriends(friend?.id))
                        }} className='h-20 '  src={user.profilePic} alt="" /></Link>
                      }
                    })}
                    
                    <p className='absolute bottom-0 text-[11px] w-20 text-white text-center bg-black bg-opacity-50'>{friend.name}</p>
                    {usuario.id===auth.user.id&&<button className='absolute top-0 right-0 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarAmigo(friend.id)}}>X</button>}
                  </div>)}
                  
                  
                 
                  
                  
                  
                </article> 
            </section>

            <section className='pt-1 w-3/4  2xl:w-2/4 lg:w-4/6 md:w-full md:mx-0'>
              {usuario.id===auth.user.id&&<article className=' m-auto bg-color3-publicacion p-5 rounded-lg shadow-md shadow-emerald-500 my-6'>
                
                <button onClick={()=>{setPublicacion(true)}} className='bg-color4-comentarios w-full text-left  p-2 rounded-lg text-gray-400'> Realiza una publicación</button>
                
              </article>}
              {/* <section className='pt-4 w-1/3 m-auto 2xl:w-2/4 lg:w-4/6 md:w-full md:mx-0 '> */}
              {posts?.map((post)=>
            <article key={post.id} className='  m-auto bg-color3-publicacion  rounded-md shadow-md shadow-emerald-500 my-6 relative border-2 border-color1-nav '>
              {post.idUser===auth.user.id&&<div>
                {/* <button className='absolute top-1 right-1 bg-color7-boton text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarPost(post.id)}}>X</button> */}
                <button className='absolute top-1 right-1 bg-color7-boton text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{tomarPostDel(post.id)}}>X</button>
                <button className='absolute top-1 right-6 bg-color7-boton text-white  px-2 text-xs rounded-md' onClick={()=>{tomarPost(post.id)}}>editar</button>
              </div>}
              
              <div className='flex items-center gap-4 mb-3 justify-between w-full p-2 '>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-12 h-12 flex  relative overflow-hidden rounded-full bg-black'>
                      
                      {allUsers.map((user)=>{
                          if(user.id===post.idUser){
                            return <Link href={"/profile/"+user.id}><img onClick={()=>{
                              dispatch(getUserProfile(user?.id))
                              dispatch(getUserPosts(user?.id))
                              dispatch(getUserFriends(user?.id))
                            }} className='w-full m-auto h-auto' src={user.profilePic}/></Link>
                          }
                        })}
                    </div>
                  <div>
                  <p className='text-md text-white text-bold text-shadow-lg'>{post.name}</p>
                  <p className='text-sm  text-gray-500'>{`${post.date.toDate().toLocaleDateString()} a las ${post.date.toDate().getHours()}:${post.date.toDate().getMinutes()}hs`}</p>
                  </div>
                  
                  </div>
                
                
                
                
                
              </div>
              <p className='mb-2 px-3 py-1 text-white text-shadow-lg'>{post.text}</p>
              {(post.img.includes("mp4"))?<div className='bg-black bg-opacity-10 w-full'>
                  <video className='rounded-md  m-auto max-h-96 w-full'controls>
                    <source src={post.img}/>
                  </video>
                </div>:<div className='bg-black bg-opacity-10 w-full'>
                  <img className='  m-auto  ' src={post.img} alt/>
                </div>}
              
              <article className='flex gap-4 p-2 border-t-2  border-b-2 border-color1-nav '>
 
                  <div className='flex'>
                    
                    
                    <AiOutlineLike   className='text-2xl text-blue-400 ' onClick={()=>{like(post.id,post.idUser)}}/>
                    
                    <p className='text-white'>{post.likes.length}</p>
                  </div> 
                    
                  
                  
                  <button onClick={()=>{setShowComments(!showComments)}}><FaRegComment className='text-2xl text-white'/></button>

              </article>
              
              
              {post.comments?.map((comment)=>
                <article key={comment.id} className=' rounded-sm shadow-sm shadow-black p-2 mb-2 m-1'>
                  <article className='flex items-center gap-2 mb-2'>
                        <div className='h-10 w-10 overflow-hidden rounded-full flex'>
                        {allUsers.map((user)=>{
                          if(user.id===comment.id){
                            return <Link href={"/profile/" + comment.id} className='w-10 h-10 overflow-hidden rounded-full flex items-center '>
                              <img onClick={()=>{
                          dispatch(getUserProfile(user?.id))
                          dispatch(getUserPosts(user?.id))
                          dispatch(getUserFriends(user?.id))
                        }} className=' h-10' src={user.profilePic} alt="" /> 
                              </Link>
                          }
                        })}
                        </div>
                        
                    
                      <div className='w-full relative'>
                        <div className='bg-color4-comentarios  shadow-black shadow-sm rounded-sm p-1'>
                          <p className='text-xs text-white '>{comment.name}</p>
                          <p className='ml-2 text-white '>{comment.comentario}</p>
                        </div>
                        
                        {/* <p className='ml-2 '>{Date(comment.date)}</p> */}
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
              <article className='bg-color4-comentarios shadow-black shadow-sm rounded-md p-2 m-1'>
                <article className='flex items-center gap-2 py-2'>
                  <div className='h-10 w-10 overflow-hidden rounded-full flex'>
                          {allUsers.map((user)=>{
                            if(user.id===auth.user.id){
                              return <div className='w-10 h-10 overflow-hidden rounded-full flex items-center '>
                                <img onClick={()=>{
                            dispatch(getUserProfile(user?.id))
                            dispatch(getUserPosts(user?.id))
                            dispatch(getUserFriends(user?.id))
                          }} className=' h-10' src={user.profilePic} alt="" /> 
                                </div>
                            }
                          })}
                    </div>
                    <input className='bg-color3-publicacion text-white my-auto py-1 rounded-md w-full border-2 border-emerald-500 ' name="comentario" type="text" placeholder='Deja tu comentario' 
                    
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