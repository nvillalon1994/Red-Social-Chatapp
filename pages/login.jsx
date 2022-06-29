import React, { useState } from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import {signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider, FacebookAuthProvider, GoogleAuthProvider,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs,setDoc, getDoc} from 'firebase/firestore'
import { auth,database, storage } from '../config/firebase'
import {useRouter} from 'next/router'
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook ,FaGithub} from 'react-icons/fa';
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { updateData,login } from '../features/auth'
import { providerLogin, signInMethods } from '../libs/auth'
import { getDownloadURL, ref , uploadBytesResumable } from 'firebase/storage'

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()
const githubProvider = new GithubAuthProvider()

export default function Login() {
    const [isLogin,setIsLogin] = useState(true)
    const [img,setImg]=useState()
    const [mostrarProg,setMostrarProg]=useState(false)
    const [show,setShow]=useState(true)
    const [progress,setProgress]=useState(0)

    const router = useRouter()
    
    const dispatch = useDispatch()
    const crear =()=>{

    }
    const login2 = (values,{setSubmitting,setErrors}) =>{
        
        if(isLogin){
        signInWithEmailAndPassword(auth,values.email,values.password)
        .then(result=>{
            setSubmitting(false)
            router.replace("/")
        })
        .catch(error=>{
            setSubmitting(false)
            setErrors({
                credentials:"Las credenciales son incorrectas"
            })
        })
    }else{createUserWithEmailAndPassword(auth,values.email,values.password)
        .then(async(result)=>{
            
            const user1={
                name:values.name,
                email:result.user.email,
                profilePic:img,
                id:result.user.uid,
                portadaPic:"https://images.unsplash.com/photo-1616039407041-5ce631b57879?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"    
            }
            console.log(user1)
        await setDoc(doc(database,`usuarios/${result.user.uid}`),user1)
          
          updateProfile(result.user,{
            displayName:values.name,
            photoURL:values.profilePic
          }).then(()=>{
            
            dispatch(updateData({
              name:values.name,
              profilePic:values.profilePic
            }))
            
            
            router.replace("/")
          })
          
        }).catch(error=>{
          console.log(error)
        })}
    }
    const loginWithProvider = (id)=>{
        providerLogin(id)
        .then(async(result)=>{
            console.log(result.user.uid)
            const col = collection(database,"usuarios")
            const snapshot = await getDocs(col)
            
            
            const users = []
            snapshot.forEach(doc=>{
                users.push({...doc.data(),id:doc.id})
            })
            console.log(users)
            let usuario 
            users.map((user)=>{
                if(user.id===result.user.uid){
                    usuario=user
                }
            })
            

            const user1={name:result.user.displayName,
                email:result.user.email,
                profilePic:result.user.photoURL,
                id:result.user.uid,
                portadaPic:"https://images.unsplash.com/photo-1616039407041-5ce631b57879?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"   }
                console.log(user1)
        await setDoc(doc(database,`usuarios/${result.user.uid}`),user1)
                dispatch(login(user1))
            router.replace("/")

        })
        .catch(error=>console.log("Error",error))
    }

    // const googleLogin = ()=>{
    //     signInWithPopup(auth,googleProvider)
    //     .then(async(result)=>{
            
    //         const user1={name:result.user.displayName,
    //             email:result.user.email,
    //             profilePic:result.user.photoURL,
    //             id:result.user.uid}
    //     await setDoc(doc(database,`usuarios/${result.user.uid}`),user1)
    //     router.replace("/")
    //     })
    //     .catch(error=>{
    //         console.log(error)
    //     })
    // }
    // const facebookLogin = ()=>{
    //     signInWithPopup(auth,facebookProvider)
    //     .then(result=>{
    //         router.replace("/")
            
    //     })
    //     .catch(error=>{
    //         console.log(error)
    //     })
    // }
    // const githubLogin = ()=>{
    //     signInWithPopup(auth,githubProvider)
    //     .then(async(result)=>{
    //         const user1={name:result.user.displayName,
    //             email:result.user.email,
    //             profilePic:result.user.photoURL,
    //             id:result.user.uid}
    //         await setDoc(doc(database,`usuarios/${result.user.uid}`),user1)
    //         router.replace("/")
    //     })
    //     .catch(error=>{
    //         console.log(error)
    //     })
    // }

    // Reto: Completar el login con los demás providers
    // Extra: Añadir icono a los botones
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
            
            const storageRef =ref(storage,`/files/gen/images/"${file.name}`)
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
                  setImg(url)
                  setShow(false)
                  setTimeout(()=>{
                    setShow(true)
                  },10)
                  
                  
                })
            }
            )
            
            
        
      }
      console.log(img)
  return (
    <section className='  m-auto relative pt-4 bg-color2-backg h-[94.4vh] '>
        
        <Formik 
            initialValues={{
                email:"",
                password:""
            }}

            onSubmit={login2}
        >
            {({errors,isSubmitting})=>{
                return <section className=''>
                    <Form className=' bg-color5-recuatros shadow-md shadow-emerald-500 3xl:w-1/4 2xl:w-2/5 xl:w-5/12 lg:w-1/2 md:w-11/12  p-5  md:p-4 mx-auto mt-16  rounded-t-lg'>
                        {isLogin?<h2 className=' text-center text-white text-shadow-lg font-bold text-4xl mb-10 md:mb-7 md:text-3xl'>Inicia sesión</h2>:<h2 className=' text-center text-white text-shadow-lg  font-bold text-4xl mb-10 md:mb-7 md:text-3xl'>Registrate</h2>}
                        {isLogin?<div className='flex flex-col  mx-auto   gap-5 md:gap-3'>
                            <Field className="p-3 rounded-md bg-color8-inputs text-white" placeholder="Email..." type="email" name="email"/>
                            <Field className="p-3 rounded-md bg-color8-inputs text-white" placeholder="Password..." type="password" name="password"/>
                            <button type='submit' className={`bg-color1-nav p-3 rounded-md text-white hover:text-shadow-lg hover:shadow-lg hover:bg-color4-comentarios ${isSubmitting&&"bg-red-500"}`}>Iniciar sesión</button>
                            <p className='text-center '>¿No tienes cuenta?<button onClick={()=>{setIsLogin(!isLogin)}} className="hover:text-emerald-200 mx-2 text-emerald-400">Registrate</button> </p>
                            

                        </div>:<div className='flex flex-col  mx-auto  gap-5 md:gap-3'>
                            <Field className="p-3 rounded-md bg-color8-inputs text-white" placeholder="Email..." type="email" name="email"/>
                            <Field className="p-3 rounded-md bg-color8-inputs text-white" placeholder="Password..." type="password" name="password"/>
                            <Field className="p-3 rounded-md bg-color8-inputs text-white" placeholder="Nombre..." type="text" name="name"/>
                            {/* {show&&<Field className="p-3 rounded-md bg-color8-inputs text-white" defaultValue={img} placeholder="Foto de Perfil..." type="text" name="profilePic"/>} */}
                            {mostrarProg&&<img src={img} alt="FOTO" className='max-h-40' />}
                            {mostrarProg&&<p className=' mt-3 text-white '>Cargando Imagen:{progress}%</p>}
                        <div className="relative h-5">
                            <div className="absolute z-[0] top-[1px] left-[0px] bg-cyan-400 bg-opacity-70 px-2 py-[2px] text-white">Seleccionar archivo</div>
                            
                            <input className=" absolute z-[1] top-[1px] left-[0px] w-40 opacity-0" type="file" onChange={subir} onClick={()=>{setMostrarProg(true);}} />
                        </div>
                            <button className={`bg-color4-comentarios p-3 rounded-md text-white hover:shadow-md hover:shadow-emerald-500 ${isSubmitting&&"bg-red-500"}`}>Registrar cuenta!</button>
                            <p className='text-center'>¿Ya tienes cuenta?<button onClick={()=>{setIsLogin(!isLogin)}} className="hover:text-emerald-200 mx-2 text-emerald-400">Inicia Sesión</button> </p>
                            
                            

                        </div>}

                    </Form>
                    {errors&&<div className='absolute top-4 m-auto  bg-color2-backg h-fit transition ease-in-out delay-150  p-2 rounded  text-black '>{errors.credentials}</div>}
                    {isLogin&&<div className=' bg-color1-nav  3xl:w-1/4 2xl:w-2/5 xl:w-5/12 lg:w-1/2 md:w-11/12  mx-auto shadow-md shadow-emerald-500 rounded-b-lg'>
                    <p className='text-center pb-4 text-white'>O inicia sesión con redes</p>
                    <div className='flex justify-center gap-10 pb-4 '>
                        
                        <button onClick={()=>{loginWithProvider(signInMethods.google)}}><FcGoogle className='text-3xl hover:shadow-emerald-500  hover:shadow-lg hover:bg-white rounded-full' /></button>
                        <button onClick={()=>{loginWithProvider(signInMethods.facebook)}}><FaFacebook className='text-3xl text-blue-800 hover:shadow-emerald-500 hover:shadow-lg hover:bg-white rounded-full'/></button>
                        <button onClick={()=>{loginWithProvider(signInMethods.github)}}><FaGithub className='text-3xl hover:shadow-emerald-500 hover:shadow-lg hover:bg-white rounded-full'/></button>
                    </div>
                    </div>}

                </section>
            }}
        </Formik>
        
        
    </section>
  )
}