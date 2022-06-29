import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { BiLogOutCircle } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";


import { AiFillBell, AiFillHome, AiFillWechat } from "react-icons/ai";
import { SiSquare } from "react-icons/si";
import { FaUserFriends, FaUsers, FaStoreAlt } from "react-icons/fa";
import { ImEnters } from "react-icons/im";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  acceptFriend,
  addFriend,
  declineFriend,
} from "../features/friends/solicitudes";
import {
  getUserFriends,
  getUserPosts,
  getUserProfile,
  getUsers,
} from "../features/users";
import { getAllPosts } from "../features/posts";
import { logout } from "../features/auth";
export default function Navbar() {
  const auth2 = useSelector((state) => state.auth);
  const solicitudes = useSelector((state) => state.friends.solicitudes);
  const friends = useSelector((state) => state.friends.friends);
  const allUsers = useSelector((state) => state.users.allUsers);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openFriends, setOpenFriends] = useState(false);
  const users = useSelector((state) => state.users.usuarios);
  const [config, setConfig] = useState(false);
  const router = useRouter();
  const logout2 = () => {
    dispatch(logout());
    signOut(auth);
    setConfig(false);
    setOpenFriends(false);
    router.replace("/login");
  };

  const dispatch = useDispatch();
  const agregarAmigo = (idFriend) => {
    // console.log(idFriend)
    dispatch(addFriend(idFriend));
    // dispatch(getSolicitud(auth.user.id))
    // dispatch(getFriends(auth.user.id))
    // dispatch(getUsersSolicitud(idFriend))
    //   setTimeout(()=>{
    //     dispatch(getUsers())
    // },900)
  };
  const aceptarSolicitud = (idFriend, idSolicitud, name) => {
    // console.log(idFriend,idSolicitud,name,profilePic)
    dispatch(
      acceptFriend({
        idUser: auth2.user.id,
        idFriend: idFriend,
        idFriend,
        idSolicitud,
        name,
      })
    );
    // dispatch(getFriends(auth.user.id))
    // dispatch(getSolicitud(auth.user.id))
    setTimeout(() => {
      dispatch(getUsers());
    }, 400);
  };
  const eliminarSolicitud = (idFriend, idSolicitud) => {
    // console.log(idFriend,idSolicitud,name,profilePic)
    dispatch(declineFriend({ idFriend, idSolicitud }));
    // dispatch(getFriends(auth.user.id))
    // dispatch(getSolicitud(auth.user.id))
    dispatch(getAllPosts());
  };
  const[mostrarAmigos,setMostrarAmigos]= useState(false)
  const[mostrarSugerencias,setMostrarSugerencias]= useState(true)
  const[mostrarSolicitudes,setMostrarSolicitudes]= useState(false)
  
  
  return (
    
        <section className="  h-[94vh]  bg-color2-backg w-full top-14 left-0 z-30 flex flex-row md:flex-col ">
          <article className=" md:border-0 flex flex-col w-1/6 bg-color1-nav gap-4 md:gap-2 p-1 border-r-2 border-emerald-800 pr-2 md:flex md:flex-row md:w-full ">
            <p className="text-white text-2xl md:text-xl px-3 md:px-1 py-1  font-semibold">Amigos</p>

            {mostrarSugerencias?<button className="bg-emerald-300 shadow-md shadow-black hover:shadow-white p-3  mx-1 text-left md:text-xs md:mx-0 md:p-1  2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(true);setMostrarSolicitudes(false)}}>Sugerencias de Amistad</button>:
            <button className="bg-emerald-500 shadow-md shadow-black hover:shadow-white p-3  mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm  rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(true);setMostrarSolicitudes(false)}}>Sugerencias de Amistad</button>}

            {mostrarAmigos?<button className="bg-emerald-300 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(true);setMostrarSugerencias(false);setMostrarSolicitudes(false)}}>Todos tus Amigos</button>:
            <button className="bg-emerald-500 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(true);setMostrarSugerencias(false);setMostrarSolicitudes(false)}}>Todos tus Amigos</button>}

            {mostrarSolicitudes?<button className="bg-emerald-300 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(false);setMostrarSolicitudes(true)}}>Solicitudes de Amistad</button>:
            <button className="bg-emerald-500 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(false);setMostrarSolicitudes(true)}}>Solicitudes de Amistad</button>}
          </article>

          <article className=" w-full border-l-2 border-emerald-800 bg-color3-publicacion h-full overflow-hidden md:border-0">
          {mostrarAmigos&&<p className="bg-color1-nav text-white p-2 text-2xl border-l-2 px-7 text-shadow-md md:text-lg md:px-2">Todos tus amigos</p>}
            {mostrarAmigos&&<article className="grid 3xl:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 md:gap-0  w-full justify-items-center  h-fit">
              
              {friends?.map((friend) => (
                <Link href={"/profile/" + friend?.id} className="">
                  <a
                    className="bg-color4-comentarios rounded-md  mt-2 shadow-md shadow-black  h-fit  "
                    onClick={() => {
                      setOpenFriends(false);
                      dispatch(getUserProfile(friend?.id));
                      dispatch(getUserPosts(friend?.id));
                      dispatch(getUserFriends(friend?.id));
                    }}
                  >
                    <div className="w-52 h-52 md:w-40 md:h-40 bg-black flex items-center justify-center rounded-t-md  rounde-md overflow-hidden  ">
                      {allUsers.map((user) => {
                        if (user.id === friend?.id) {
                          return (
                            <img className=" h-52 md:h-40" src={user.profilePic} alt="" />
                          );
                        }
                      })}
                    </div>
                    <div className="flex justify-between items-center max-w-40 w-52 md:w-40  ">
                        <p className="text-white text-lg text-shadow-lg p-2 md:px-1 md:text-sm w-2/3">{friend?.name}</p>
                        <button className="bg-cyan-300 p-1 mx-2 md:mx-1 text-shadow-lg text-white w-1/3 md:text-sm rounded-md shadow-sm shadow-black hover:shadow-white">Visitar perfil</button>
                    </div>
                    
                  </a>
                </Link>
              ))}
        
              
      



            </article>}
            {mostrarSugerencias&&<h2 className="bg-color1-nav text-white p-2 text-2xl border-l-2 md:border-0 px-7 md:px-2 text-shadow-md md:text-lg ">Personas que quizás conozcas</h2>}
            {mostrarSugerencias&&<article className="  grid 3xl:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  gap-5 md:gap-0  w-full justify-items-center   h-fit  ">
              {users?.map((user) => {
                if (user.id !== auth2.user.id) {
                  return (
                    <article className="bg-color4-comentarios rounded-md  mt-2 shadow-md shadow-black  h-fit">
                      <div className="  ">
                        <a className=" ">
                          <div className=" w-48 h-48 md:h-40 md:w-40 bg-black flex items-center justify-center rounded-t-md  rounde-md overflow-hidden">
                            <img className=" h-48 md:h-40" src={user.profilePic} alt="" />
                          </div>
                            
                            <div className="flex flex-col md:px-0 px-1 max-w-40 justify-between   h-20">
                                <p className=" text-white text-lg md:text-sm text-shadow-lg p-2  w-48 md:w-40 h-1/2 ">{user.name}</p>
                                <button
                                        className="bg-cyan-300  p-1 md:mt-3 md:m-auto m-1  mt-0 text-shadow-lg md:text-xs w-48 md:w-36 text-white rounded-md shadow-sm shadow-black hover:shadow-white justify-end"
                                        onClick={() => {
                                        agregarAmigo(user.id);
                                        }}
                                    >
                                        Agregar a mis amigos
                                    </button>
                            </div>
                          
                        </a>
                      </div>
                      
                    </article>
                  );
                }
              })}
            
              
              
              
              
              
            </article>}
              <article className="w-full border-l-2 border-emerald-800 bg-color3-publicacion h-full overflow-hidden md:border-0">
              {mostrarSolicitudes&&<h1 className="bg-color1-nav text-white p-2 text-2xl border-l-2 px-7 text-shadow-md md:text-lg md:px-2">Solicitudes de amistad</h1>}
            {solicitudes?.map((e) => {
              if (e.solicitud === "recibida") {
                return (
                  <article className=" grid 3xl:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  gap-5 md:gap-1  w-full justify-items-center   h-fit ">
                     


                    {mostrarSolicitudes&&<div className=" ">
                     <div className="bg-color4-comentarios rounded-md mt-2  shadow-md shadow-black  h-fit">
                      <div className="w-52 h-52 md:h-40 md:w-40 bg-black flex items-center justify-center rounded-t-md  rounde-md overflow-hidden">
                        {allUsers.map((user) => {
                          if (user.id === e.idFriend) {
                            return (
                              
                                <img className="h- md:h-40" src={user.profilePic} />
                              
                            );
                          }
                        })}
                      </div>
                      <p className="text-white text-lg text-shadow-xl m-2 mb-0">{e.name}</p>
                      <div className="flex flex-col gap-2 p-1 ">
                            <button
                            className="bg-cyan-500  rounded-sm  w-full text-white shadow-sm shadow-black   hover:shadow-white hover:shadow-md hover:bg-cyan-400 hover: text-shadow-sm  "
                            onClick={() => {
                                aceptarSolicitud(
                                e.idFriend,
                                e.id,
                                e.name,
                                e.profilePic
                                );
                            }}
                            >
                            Aceptar
                            </button>
                            <button
                            className="bg-red-400  rounded-md  w-full text-white shadow-sm shadow-black  hover:shadow-white  hover:shadow-md hover:bg-red-500 hover: text-shadow-sm"
                            onClick={() => {
                                eliminarSolicitud(e.idFriend, e.id);
                            }}
                            >
                            Rechazar
                            </button>
                    </div>

                    </div>
                </div>}
                   
                
                    



            </article>
            );
            }
        })}
        </article>
        </article>
    </section>
      
    
  );
}
