import React, { useState } from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import {signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider, FacebookAuthProvider, GoogleAuthProvider,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import { auth } from '../config/firebase'
import {useRouter} from 'next/router'
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook ,FaGithub} from 'react-icons/fa';
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { updateData } from '../features/auth'
const googleProvider = new GoogleAuthProvider()

const facebookProvider = new FacebookAuthProvider()
const githubProvider = new GithubAuthProvider()

export default function Login() {
    const [isLogin,setIsLogin] = useState(true)
    
    const router = useRouter()
    const dispatch = useDispatch()
    const login = (values,{setSubmitting,setErrors}) =>{
        console.log(values)
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
        .then(result=>{
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

    const googleLogin = ()=>{
        signInWithPopup(auth,googleProvider)
        .then(result=>{
            router.replace("/")
        })
        .catch(error=>{
            console.log(error)
        })
    }
    const facebookLogin = ()=>{
        signInWithPopup(auth,facebookProvider)
        .then(result=>{
            router.replace("/")
            
        })
        .catch(error=>{
            console.log(error)
        })
    }
    const githubLogin = ()=>{
        signInWithPopup(auth,githubProvider)
        .then(result=>{
            router.replace("/")
        })
        .catch(error=>{
            console.log(error)
        })
    }

    // Reto: Completar el login con los demás providers
    // Extra: Añadir icono a los botones

  return (
    <section className='  '>
        
        <Formik 
            initialValues={{
                email:"",
                password:""
            }}

            onSubmit={login}
        >
            {({errors,isSubmitting})=>{
                return <section >
                    <Form className=' bg-white w-11/12 md:w-1/2 p-5 md:p-10 mx-auto mt-16 shadow-xl shadow-black rounded-t-lg'>
                        <h2 className=' text-center font-bold text-4xl mb-10'>Inicia sesión</h2>
                        {isLogin?<div className='flex flex-col md:w-1/2 mx-auto gap-5'>
                            <Field className="p-3 rounded-md bg-color2-backg" placeholder="Email..." type="email" name="email"/>
                            <Field className="p-3 rounded-md bg-color2-backg" placeholder="Password..." type="password" name="password"/>
                            <button type='submit' className={`bg-color1-nav p-3 rounded-md text-white hover:text-shadow-lg hover:shadow-lg hover:bg-color4-comentarios ${isSubmitting&&"bg-red-500"}`}>Iniciar sesión</button>
                            <p className='text-center'>¿No tienes cuenta?<button onClick={()=>{setIsLogin(!isLogin)}}>Registrate</button> </p>
                            

                        </div>:<div className='flex flex-col md:w-1/2 mx-auto gap-5'>
                            <Field className="p-3 rounded-md bg-color2-backg" placeholder="Email..." type="email" name="email"/>
                            <Field className="p-3 rounded-md bg-color2-backg" placeholder="Password..." type="password" name="password"/>
                            <Field className="p-3 rounded-md bg-color2-backg" placeholder="Nombre..." type="text" name="name"/>
                            <Field className="p-3 rounded-md bg-color2-backg" placeholder="Foto de Perfil..." type="text" name="profilePic"/>
                            <button className={`bg-color1-nav p-3 rounded-md text-indigo-900 hover:bg-indigo-400 ${isSubmitting&&"bg-red-500"}`}>Registrar cuenta!</button>
                            <p className='text-center'>¿Ya tienes cuenta?<button className='text-' onClick={()=>{setIsLogin(!isLogin)}}>Inicia Sesión</button> </p>
                            
                            

                        </div>}

                    </Form>
                    {errors&&<p>{errors.credentials}</p>}
                    {isLogin&&<div className=' bg-color1-nav  w-11/12 md:w-1/2  md:p-10 mx-auto shadow-xl shadow-black rounded-b-lg'>
                    <p className='text-center pb-4'>O inicia sesión con redes</p>
                    <div className='flex justify-center gap-10 '>
                        <button onClick={googleLogin}><FcGoogle className='text-3xl hover:bg-white rounded-full' /></button>
                        <button onClick={facebookLogin}><FaFacebook className='text-3xl text-blue-800 hover:bg-white rounded-full'/></button>
                        <button onClick={githubLogin}><FaGithub className='text-3xl hover:bg-white rounded-full'/></button>
                    </div>
                    </div>}

                </section>
            }}
        </Formik>
        
        
    </section>
  )
}