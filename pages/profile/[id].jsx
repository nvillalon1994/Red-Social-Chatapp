import React, { useEffect, useState } from 'react'
import { database } from '../../config/firebase' 
import {collection,doc,getDocs,getDoc,updateDoc} from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineLike } from 'react-icons/ai';
import { FaComment,FaRegComment } from 'react-icons/fa'; 
import {GiCancel  } from 'react-icons/gi'; 
import Link from 'next/link';
import { deletePost, editePost, getPosts } from '../../features/posts';
import { deleteFriend } from '../../features/friends/solicitudes';
import { useRouter } from 'next/router';
import { getUserFriends, getUserPosts, getUserProfile } from '../../features/users';

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
    const col2 = collection(database,"usuarios",params.id,"friends")
    const snapshot2 = await getDocs(col2)
    const friends = []

    snapshot2.forEach(doc=>{
      friends.push({...doc.data(),id:doc.id})
    })
    const usuario = usuarioDocument.data()
    

    return {
        props:{
            usuario,
            posts,
            friends
        },
        revalidate: 10
        
    }
}

export default function Perfil() {
      const friends = useSelector(state=>state.users.usuario.friends)
      const usuario = useSelector(state=>state.users.usuario.usuario)
      const posts = useSelector(state=>state.users.usuario.posts)
      const [publicacion,setPublicacion]= useState(false)
      const [openpost,setopenPost]= useState(false)
      const [post,setPost]= useState({})
      console.log(friends)
      console.log(usuario)
      console.log(posts)
      const router = useRouter()
      const { id } = router.query
      console.log(id)
      const [comentario,setComentario]= useState(false)
      const auth = useSelector(state=>state.auth)
      
      
      const dispatch = useDispatch()



      const agregarComentario =(id2,idUser,e) =>{
          // e.preventDefault()
          if(e.key === "Enter"){
            
            const comentario = {
              comentario:e.target.value,
              name:auth.user.name,
              profilePic:auth.user.profilePic,
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



      const eliminarPost=(idPost)=>{
        dispatch(deletePost({idUser:auth.user.id,idPost:idPost}))
        dispatch(getUserPosts(id))
        
      }
      const eliminarAmigo=(idFriend)=>{
        dispatch(deleteFriend(idFriend))
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
      useEffect(()=>{
        dispatch(getUserProfile(id))
        dispatch(getUserPosts(id))
        dispatch(getUserFriends(id))
        

      },[])
  return (
    <section className='max-w-6xl m-auto flex   '>
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
        <section className='my-6 flex flex-col bg-color3-publicacion shadow-xl shadow-black rounded-lg w-1/4 gap-2 pt-5 h-fit '>
            <article>
                <div className='w-40 h-40 overflow-hidden bg-black flex items-center rounded-full shadow-xl border-2 border-black m-auto'>
                    <img className='max-w-40 w-40  ' src={usuario?.profilePic}  alt="profilePic" />
                </div>
                <h1 className='m-auto  text-xl text-center mt-2 font-semibold w-40'>{usuario?.name}</h1>
                <p className='m-auto  text-md text-center mt-2  w-40  overflow-hidden hover:overflow-visible'>{usuario?.email}</p>
            </article>
            <h3 className='mx-3  text-xl text-left  font-semibold w-40'>Fotos</h3>
            <article className='mx-3'>
            
                <article className='grid grid-cols-3'>
                    {posts.map((post)=><article>
                      
                      {post.img!==""&&<div className='w-20 h-16 overflow-hidden  flex items-center  '>
                            <img className='max-h-40 h-20 ' src={post.img}  alt="profilePic" />
                            
                        </div>}
                    </article>)}
                </article>
            </article>
            <h3 className=' text-xl text-left mx-3 font-semibold w-40'>Amigos</h3>
            <article className='grid grid-cols-3 m-3'>
              
              {friends.map((friend)=><div href={"/profile/"+friend.id} className='w-20 h-20 overflow-hidden relative'>
                <a href={"/profile/"+friend.id}><img className='h-20 w-20 '  src={friend.profilePic} alt="" /></a>
                <p className='absolute bottom-0 text-[11px] w-20 text-white text-center bg-black bg-opacity-50'>{friend.name}</p>
                {usuario.id===auth.user.id&&<button className='absolute top-0 right-0 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarAmigo(friend.id)}}>X</button>}
              </div>)}
            </article>
            
        </section>
        <section className='w-2/3'>
        {posts.map((post)=>
          <article className='max-w-xl m-auto bg-color3-publicacion p-5 rounded-lg shadow-xl shadow-black my-6 relative'>
            {post.idUser===auth.user.id&&<div>
              <button className='absolute top-1 right-1 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarPost(post.id)}}>X</button>
              <button className='absolute top-1 right-6 bg-red-300 text-white  px-2 text-xs rounded-full' onClick={()=>{tomarPost(post.id)}}>editar</button>
            </div>}
            
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-12 h-12 overflow-hidden bg-black rounded-full flex items-center'>
                <Link href={"/profile/"+post.idUser}  className='w-10 h-10 overflow-hidden rounded-full flex items-center'>
                      <a><img className='w-12 h-auto ' src={post.profilePic} alt="" /></a>
                      
                      
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
                      
                      
                      {/* {comment.id===auth.user.id&& */}
                      <button className='absolute top-1 right-1 bg-red-300 text-white  h-4 w-4 text-xs rounded-full' onClick={()=>{eliminarComentario(post.id,comment.date,post.idUser)}}>X</button>
                      {/* } */}
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
  )
}