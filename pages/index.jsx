import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { AiOutlineLike } from 'react-icons/ai';
import { FaComment,FaRegComment } from 'react-icons/fa'; 
import { MdArrowForwardIos } from 'react-icons/md'; 
import {GiCancel  } from 'react-icons/gi'; 
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs,setDoc, onSnapshot} from 'firebase/firestore'
import { database } from '../config/firebase'
import { addPostsWall, agregarPost, deletePost, editePost, getAllPosts, getPosts } from '../features/posts';
import Link from 'next/link'
import { acceptFriend, addFriend, declineFriend, getFriends, getSolicitud,getUsersSolicitud } from '../features/friends/solicitudes';
import { getUserFriends, getUserPosts, getUserProfile, getUsers  } from '../features/users';
import { useRouter } from 'next/router';
import { getDownloadURL, ref , uploadBytesResumable } from 'firebase/storage'
import { storage } from '../config/firebase';
import ChatWindow from '../components/ChatWindow'
import Navbar from '../components/NavBar';
import { RiChat3Fill } from 'react-icons/ri';
import { TiDeleteOutline } from 'react-icons/ti';
import { useRef } from 'react';
export default function Home() {
  const [solicitudes2,setSolicitudes2]=useState([])
  const [showComments, setShowComments]=useState(false)
  const [popDelPost,setDelPost]= useState(false)
  const [postDel,setPostDel]= useState({})
  const comentario22 = useRef()
  const auth = useSelector(state=>state.auth)
  console.log(auth)
  // const posts = useSelector(state=>state.posts.items)
  const posts = useSelector(state=>state.users.usuario.posts)
  
  
  const [imgpost,setimgpost]= useState()
  const [progress,setProgress]= useState(0)
  const allposts = useSelector(state=>state.posts.allposts)

  allposts.map((post)=>{
    console.log(post.likes)
  })
  const [publicaciones,setPublicaciones]= useState([])
 
  const todasLosPosts =()=>{
    const publicaciones = posts.concat(allposts)
    publicaciones.sort((post1,post2)=>{
      
    })
    
    setPublicaciones(publicaciones)
  }

  // const publicaciones = todasLosPosts()
  console.log(publicaciones)
  const pending = useSelector(state=>state.friends.pendingFriends)
  
  const [name,setName]= useState()
  const [loadingedit, setLoadingEdit]=useState(false)
  const users = useSelector(state=>state.users.usuarios)
  const allUsers = useSelector(state=>state.users.allUsers)
  
  const solicitudes = useSelector(state=>state.friends.solicitudes)
  
  const friends = useSelector(state=>state.friends.friends)
  
  
  // console.log(usuarios)
  const [publicacion,setPublicacion]= useState(false)
  
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
      idUser:event.target.id.value,
      likes:[],
      date:new Date()
    }
    const col = collection(database,`usuarios/${auth.user.id}/posts/`)
    addDoc(col,publicacion)
    
    setPublicacion(false)
    dispatch(getPosts(auth.user.id))
    dispatch(getAllPosts(auth.user.id))
    
    
  }
  console.log(allposts)

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



  const like=(idPost,idUser)=>{
    const like={
      // idPost:idPost,
      // name:auth.user.name,
      id:auth.user.id
    }
    const likes =[]
    allposts.map((post)=>{
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
      dispatch(getAllPosts())
      dispatch(getAllPosts(auth.user.id))
      
      
    }else{
      const newLikes=likes.filter((e)=>e.id!==like.id)
      console.log(newLikes)
      const docRef = doc(database,`usuarios/${idUser}/posts/${idPost}` )
        updateDoc(docRef,{
          likes:newLikes
          
        })
      console.log("esta lo quito")
      dispatch(getAllPosts())
      dispatch(getAllPosts(auth.user.id))
      
    }
    
  }
  const tomarPostDel=(idPost)=>{
    setDelPost(true)
    console.log(idPost)
    allposts.map((post)=>{
      if(post.id===idPost){
        setPostDel({...post,idPost})
      }
    })
    
  }
  const agregarComentario =async(id,idUser,e) =>{
    
    if(e.key === "Enter"){
      
      const comentario = {
        comentario:e.target.value,
        name:auth.user.name,
        // profilePic:auth.user.profilePic,
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
      dispatch(getAllPosts(auth.user.id))
      e.target.value=""
    }
    else {
      if(e==="Enter"){
      const comentario = {
        comentario:comentario22.current.value,
        name:auth.user.name,
        // profilePic:auth.user.profilePic,
        id:auth.user.id,
        date:Date.now()

      }
      console.log(comentario)
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
      dispatch(getAllPosts(auth.user.id))
      
    }}
    
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
      
      dispatch(getPosts(auth.user.id))
      dispatch(getAllPosts(auth.user.id))
  }

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
    dispatch(acceptFriend({idUser:auth.user.id,idFriend:idFriend,idFriend,idSolicitud,name}))
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
 
  const hola=()=>{
    dispatch(getAllPosts(auth.user.id))
    
    
  }
  
  const u =()=>{
    dispatch(getUsers())
  }
  
  const eliminarPost=(idPost)=>{
    dispatch(deletePost({idUser:auth.user.id,idPost:idPost}))
    dispatch(getPosts(auth.user.id))
    dispatch(getAllPosts(auth.user.id))
    setDelPost(false)
    setPostDel({})
  }



  const tomarPost=(idPost)=>{
    setopenPost(true)
    console.log(idPost)
    allposts.map((post)=>{
      if(post.id===idPost){
        setPost({...post,idPost})
        setimgpost(post.img)
      }
    })
    
  }
  console.log(post)

  
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
    
    dispatch(getAllPosts(auth.user.id))
    setPost({})
    setopenPost(false)
    
  }
  console.log(post)
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
console.log(post)
const router = useRouter()

const [mostrarProg,setMostrarProg]=useState(false)
const [chat,setChat]=useState(false)
const [like1,setLike]=useState(false)
const [idUser,setIdUser]=useState()
const [idFriend,setIdFriend]=useState()
      
const cerrarPublicacion=()=>{
  setPublicacion(false)
  setimgpost()
  setProgress(0)
  setMostrarProg(false)
} 
console.log(auth.user.id)
useEffect(()=>{
  // dispatch(getFriends(auth.user.id))
  
  setTimeout(hola,1000)
  setTimeout(u,800)
  
  dispatch(getUsers())
  if(auth.user.id){
    dispatch(getAllPosts(auth.user.id))
  }
  
  
  // dispatch(getFriends())
  // const a = auth.logged
  // console.log(a)
  // if(a===false){
  //   router.replace("/login")
  // }
   
},[auth.user.id])
allposts.map((a)=>{
  console.log(a.date)
})
  return (
    <main className=' 3xl:max-w-screen px-5  relative bg-color2-backg md:px-1 '>
      {popDelPost&&<div className='fixed flex justify-center items-center top-0 bg-black bg-opacity-80 w-full h-full  z-30'>
                <div className='w-1/2 p-2 rounded-md shadow-md shadow-emerald-500 flex flex-col gap-5 bg-color2-backg '>
                
                  <p className='text-white text-3xl text-center md:text-xl'>??Esta seguro que desea borrar esta publicaci??n?</p>
                  <div className='m-auto md:m-0 flex gap-3'> 
                    
                    <button className='text-white md:text-sm bg-color7-boton md:m-0 md:p-1 m-2 p-2 rounded-md hover:bg-color5-recuatros hover:shadow-emerald-500 hover:shadow-md'onClick={()=>{eliminarPost(postDel.id)}}>S??, borrar publicaci??n</button>
                    <button className='text-white md:text-sm bg-red-300 hover:bg-red-500 md:m-0 md:p-1 m-2 p-2 rounded-md hover:shadow-emerald-500 hover:shadow-md' onClick={()=>{setDelPost(false)}}>Cancelar</button>
                  </div>
                  
                  </div></div>
                }
        {chat&&<div className='md:hidden bg-emerald-400 shadow-lg shadow-emerald-500 text-white fixed bottom-0 right-5 z-20 w-3/12 lg:w-4/12 xl:w-5/12 rounded-md overflow-hidden'>
          <button className='absolute right-1 top-1  flex items-center justify-center rounded-full' onClick={()=>{setChat(false)}}>  <TiDeleteOutline className="text-color7-boton hover:text-red-400 text-2xl" /> </button>
        <ChatWindow idUser={idUser} idFriend={idFriend}/>
          </div>}
       {publicacion&&<div className='z-30'>
                <div className='fixed left-0 top-0 h-screen w-full bg-black bg-opacity-50 z-10' onClick={()=>{setPublicacion(false)}}></div>
                <div className="bg-color3-publicacion w-[500px] p-10 fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10 sm:w-[300px]">
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={cerrarPublicacion}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={publicar} >
                        <input autoComplete="off" className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicaci??n' type="text" />
                        
                        
                        {!mostrarProg?<input className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" defaultValue={imgpost} />:<input hidden className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='imagen' placeholder='Image...' type="text" defaultValue={imgpost} />}
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
                <div className="bg-color3-publicacion w-[500px] md:w-4/5 mt-6 md:p-2 p-10 fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-lg z-10">
                    <h2 className='text-white text-3xl text-center text-shadow-lg md:text-2xl'>Edita tu publicaci??n</h2>
                    <button className='absolute right-2 top-2 text-red-300 p-1 h-6 w-6 flex items-center justify-center rounded-md' onClick={()=>{setopenPost(false)}}><GiCancel/></button>
                    <form className='flex flex-col p-5' onSubmit={editarPost} >
                        <input autoComplete="off" className='p-4 md:p-2 bg-lavender-100 outline-none border focus:border-lavender-600 my-5 rounded-md' name='publicacion' placeholder='Tu publicaci??n' type="text" defaultValue={post.text} />
                        
                        
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
                        
                        <button type='submit' className='bg-color4-comentarios hover:shadow-md hover:shadow-emerald-500 mt-5 py-4 text-xl font-bold text-lavender-100 rounded-md text-white'>Publicar</button>
                    </form>
                </div>
            </div>}
            {loadingedit&&<div className='z-30 '>
                <div className='fixed left-0 top-0  h-screen w-full bg-black bg-opacity-50 z-10'></div>
                
                
            </div>}
        {auth.logged?
        <section className=' justify-between flex  '>
        
        
         <section className='w-1/6 pt-2 lg:hidden fixed left-3  '>
          {/* <p className='xl:text-xl lg:text-lg  text-gray-600 text-shadow-xl my-5 md:text-sm   '>Solicitudes de amistad</p>
          <article className='max-h-[250px] h-[250px]  overflow-auto'>
            {solicitudes?.map((e)=>{
            if(e.solicitud==="recibida"){
              return <div className='bg-color1-nav p-2 flex flex-col  items-center rounded-xl shadow-lg py-4'>
              <div className='flex gap-2 justify-between items-center mb-2 '>
                {allUsers.map((user)=>{
                  if(user.id===e.idFriend){
                    return <div className='h-20 w-20 overflow-hidden rounded-full '>
                      <img className='h-20 w-auto ' src={user.profilePic}/>
                      </div>
                  }
                })}
                <p className='text-white text-shadow-lg w-1/2'>{e.name}</p>
                
              </div>
              
              <div className='flex gap-2'>
                <button className='bg-cyan-400 p-2 rounded-md m-auto shadow-lg xl:text-md lg:text-sm md:text-xs  text-white' onClick={()=>{aceptarSolicitud(e.idFriend,e.id,e.name,e.profilePic)}}>Aceptar</button>
                <button className='bg-red-300 p-2 rounded-md m-auto shadow-lg xl:text-md lg:text-sm md:text-xs text-white'onClick={()=>{eliminarSolicitud(e.idFriend,e.id)}}>Rechazar</button>
              </div>
              
            </div>
            }})}
          </article> */}
          <article className='bg-color3-publicacion h-[400px] px-3 xl:px-1 shadow-md shadow-emerald-600 '>
              
            <p className='text-xl px-2 text-white py-1 text-shadow-xl border-b-2 border-color6-lineas lg:text-sm '>Amigos</p>
              {friends?.map((friend)=><Link href={"/profile/"+friend?.id} key={auth.user.id} className=''>
                <a className='flex my-4 items-center gap-2 bg-color5-recuatros p-1 rounded-md shadow-sm shadow-black' onClick={()=>{
                  dispatch(getUserProfile(friend?.id))
                  dispatch(getUserPosts(friend?.id))
                  dispatch(getUserFriends(friend?.id))
                }}>
                <div className='w-1/5 '>
                <div className='w-10 h-10 lg:h-7 lg:w-7 overflow-hidden bg-black rounded-full flex items-center'>
                {allUsers.map((user)=>{
                  if(user.id===friend?.id){
                    return <img className='w-10   m-auto ' src={user.profilePic} alt="" />
                  }
                })}        
                
                            
                </div>
                </div>      
                <p className=' h-fit xl:text-xs text-white text-shadow-lg w-4/5 '>{friend?.name}</p>
                </a>
              
                    
              </Link>)}
            </article>
          
          
          
          
          </section> 

          <section className='pt-4 w-1/3 m-auto 2xl:w-2/4 lg:w-4/6 lg:m-0 md:w-full md:mx-0 '>
            <article className=' mb-6  flex bg-color3-publicacion p-2 py-4 rounded-lg gap-4  shadow-md shadow-emerald-600  border-2 border-color1-nav'>
              <div className='h-10 w-10 overflow-hidden rounded-full flex bg-black '>
              {allUsers.map((user)=>{
                          if(user.id===auth.user.id){
                            return <Link href={"/profile/"+user.id}><img onClick={()=>{
                              dispatch(getUserProfile(user?.id))
                              dispatch(getUserPosts(user?.id))
                              dispatch(getUserFriends(user?.id))
                            }} className='w-full m-auto h-auto' src={user.profilePic}/></Link>
                          }
                        })}
              </div>
              
              <button onClick={()=>{setPublicacion(true)}} className='bg-color8-inputs w-full border-2  border-color1-nav text-left  p-3 rounded-lg text-white'> Realiza una publicaci??n</button>
              
            </article>
            <article className='flex justify-center  m-auto  border-2 border-color1-nav rounded-md shadow-md shadow-emerald-600'>
              <button onClick={hola} className="w-full text-center bg-color4-comentarios shadow-black  text-white text-shadow-lg   p-2 m-auto"> Actualizar</button>
            </article>
            
            {allposts?.map((post)=>
            <article key={post.id} className='  m-auto bg-color3-publicacion  rounded-md shadow-md shadow-emerald-800 hover:shadow-emerald-500 my-6 relative border-2 border-color1-nav'>
              {post.idUser===auth.user.id&&<div>
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
                      <div className='w-2/12'>
                          <div className='h-10 w-10 overflow-hidden rounded-full flex'>
                          {allUsers.map((user)=>{
                            if(user.id===comment.id){
                              return <Link key={comment.id} href={"/profile/" + comment.id} className='w-10 h-10 overflow-hidden rounded-full flex items-center '>
                                <img onClick={()=>{
                            dispatch(getUserProfile(user?.id))
                            dispatch(getUserPosts(user?.id))
                            dispatch(getUserFriends(user?.id))
                          }} className=' h-10' src={user.profilePic} alt="" /> 
                                </Link>
                            }
                          })}
                          </div>
                        </div>
                    
                      <div className='w-full relative'>
                        <div className='bg-color4-comentarios  shadow-black shadow-sm rounded-sm p-1'>
                          <p className='text-xs text-white text-shadow-lg '>{comment.name}</p>
                          <p className='ml-2 text-white text-shadow-lg'>{comment.comentario}</p>
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
                <article className='flex items-center gap-2 py-2 w-full'>
                  <div className="w-1/12 md:w-2/12">
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
                    </div>
                    <input ref={comentario22} className='bg-color3-publicacion my-auto w-11/12  py-1 text-white rounded-md border-2 border-color6-lineas ' name="comentario" type="text" placeholder='Deja tu comentario' 
                    
                    onKeyDown={(event)=>{agregarComentario(post.id,post.idUser,event)}}
                    
                    />
                    <button className='w-1/6 text-white bg-color8-inputs h-9  rounded-md justify-center hover:shadow-md hover:shadow-emerald-500  flex items-center' onClick={()=>{agregarComentario(post.id,post.idUser,"Enter")}}><MdArrowForwardIos/></button>
                    {/* <button className='text-white bg-color8-inputs p-1 h-8 rounded-full justify-center shadow-sm shadow-emerald-500 hover:shadow-md hover:shadow-emerald-500 w-8 flex items-center' onClick={()=>{agregarComentario(post.id,post.idUser,"Enter")}}> > </button>
                     */}
                </article>
              </article>
            {/* } */}
              
            </article>)
            }
            
            
            
          </section>

          <section className='w-1/6 h-screen overflow-auto fixed right-3  pt-2 rounded-lg shadow-xl  shadow-emerald-600 sm:hidden phone:hidden flex  flex-col xl:w-2/12 lg:w-3/12 md:hidden'>
          <h2 className=' px-2 text-white text-shadow-xl bg-color3-publicacion mb-2 border-b-2 text-xl py-1 border-color6-lineas xl:text-sm '>Personas que quiz??s conozcas</h2>
            <article className='h-[400px] bg-color3-publicacion overflow-auto p-1 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-color4-comentarios '>
            
            
            {users?.map((user)=>{
      
              if(user.id!==auth.user.id){
                return <article  className='bg-color5-recuatros m-1 mb-2  flex flex-col rounded-xl shadow-xl'>
              
                  <div className='h-full   flex gap-3  px-2 items-center w-full  pt-2 rounded-md   '>
                    
                          <div className='w-14 h-14 xl:h-10 xl:w-10 overflow-hidden bg-black rounded-full flex items-center '>
                            
                            <img className='h-14 xl:h-10   ' src={user.profilePic} alt="" />
                            
                          </div>
                        
                          <p className=' h-fit w-2/3 text-white text-shadow-lg   '>{user.name}</p>
                   
                </div>
                <button className='bg-cyan-400   rounded-md mx-2 my-2 text-white xl:text-sm p-1 text-shadow shadow-lg ' onClick={()=>{agregarAmigo(user.id)}}>Agregar a mis amigos</button>
                </article>
            }
    
            })}
            </article>
            <article className='bg-color3-publicacion h-[400px] overflow-auto p-1 '>
            <p className='text-xl text-white text-shadow-xl  my-5 border-b-2 border-color1-nav px-2'>Contactos</p>

            {friends?.map((friend)=><div key={auth.user.id} className='bg-color5-recuatros  m-1 p-1 flex justify-between  rounded-md'>
              <div className='flex  items-center justify-between gap-5  w-11/12   ' onClick={()=>{
                setChat(true)
                setIdUser(auth.user.id)
                setIdFriend(friend.id)
              }}>
              <div className='w-3/4 flex items-center gap-2'>
              {allUsers.map((user)=>{
                if(user.id===friend?.id){
                  return <div className='w-10 h-10 overflow-hidden  flex items-center bg-black rounded-full'>
                    <img className='h-10   ' src={user.profilePic} alt="" />
                  </div>
                    
                }
              })}        
              <p className=' h-10 text-white text-shadow-lg w-3/4 text-sm overflow-hidden  '>{friend?.name}</p>
                          
              </div>
                       
              
              <button className='w-1/4'><RiChat3Fill className='text-color7-boton text-shadow-xl text-2xl   hover:text-white' /></button>
              </div>
              
                  
            </div>)}
          </article>
            
          </section>
          
      </section>:<></>}
    </main>
  )
}