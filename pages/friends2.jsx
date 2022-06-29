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
          <article className="  flex flex-col w-1/6 bg-color1-nav gap-4 md:gap-2      md:flex md:flex-row md:w-full border-r-2 border-color6-lineas md:border-t-2 md:py-1   ">
            <p className="text-white text-2xl md:text-xl px-3 md:px-1 py-2  font-semibold  border-color6-lineas border-t-2 border-b-2 md:border-0 ">Amigos</p>

            {mostrarSugerencias?<button className="bg-emerald-300 shadow-md shadow-black hover:shadow-white p-3  mx-1 text-left md:text-xs md:mx-0 md:p-1  2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(true);setMostrarSolicitudes(false)}}>Sugerencias de Amistad</button>:
            <button className="bg-emerald-500 shadow-md shadow-black hover:shadow-white p-3  mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm  rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(true);setMostrarSolicitudes(false)}}>Sugerencias de Amistad</button>}

            {mostrarAmigos?<button className="bg-emerald-300 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(true);setMostrarSugerencias(false);setMostrarSolicitudes(false)}}>Todos tus Amigos</button>:
            <button className="bg-emerald-500 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(true);setMostrarSugerencias(false);setMostrarSolicitudes(false)}}>Todos tus Amigos</button>}

            {mostrarSolicitudes?<button className="bg-emerald-300 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(false);setMostrarSolicitudes(true)}}>Solicitudes de Amistad</button>:
            <button className="bg-emerald-500 shadow-md shadow-black hover:shadow-white p-3 mx-1 text-left md:text-xs md:mx-0 md:p-1 2xl:text-sm rounded-md text-white text-shadow-lg"onClick={()=>{setMostrarAmigos(false);setMostrarSugerencias(false);setMostrarSolicitudes(true)}}>Solicitudes de Amistad</button>}
          </article>

          <article className=" w-full   bg-color3-publicacion h-full overflow-hidden ">
          {mostrarAmigos&&<p className="bg-color1-nav text-white p-2 text-2xl  px-7 text-shadow-md md:text-lg md:px-2 border-y-2 border-color6-lineas">Todos tus amigos</p>}
            {mostrarAmigos&&<article className="grid 3xl:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 md:gap-0  w-full justify-items-center  h-fit">
              
              {friends?.map((friend) => (
                <Link href={"/profile/" + friend?.id} key={friend.id} className="">
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
                    <div className="flex flex-col justify-between  max-w-40 w-52 md:w-40  ">
                        <p className="text-white text-lg text-shadow-lg p-2  md:px-1 md:text-sm h-10 md:h-7 overflow-hidden w-11/12 ">{friend?.name}</p>
                        <button className="bg-cyan-300 p-1 mx-auto md:mx-1 text-shadow-lg text-white w-11/12 mb-2 md:text-sm rounded-md shadow-sm shadow-black hover:shadow-white">Visitar perfil</button>
                    </div>
                    
                  </a>
                </Link>
              ))}
        
              
      



            </article>}
            {mostrarSugerencias&&<h2 className="bg-color1-nav text-white p-2 text-2xl   px-7 md:px-2 text-shadow-md md:text-lg  border-b-2 border-color6-lineas border-t-2 mb-4">Personas que quizás conozcas</h2>}
            {mostrarSugerencias&&<article className="  grid 3xl:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  gap-5 md:gap-0  w-full justify-items-center   h-fit ml-2 ">
              {users?.map((user) => {
                if (user.id !== auth2.user.id) {
                  return (
                    <article className="bg-color8-inputs rounded-md  mt-2 shadow-md shadow-emerald-500  h-fit mb-3">
                      <div className="  ">
                        <a className="    ">
                          <div className=" w-48 h-48 md:h-40  md:w-40 bg-black flex items-center justify-center rounded-t-md  rounde-md overflow-hidden">
                            <img className=" h-48 md:h-40 " src={user.profilePic} alt="" />
                          </div>
                            
                            <div className="flex flex-col md:px-0 px-1 max-w-40 justify-between items-center   h-24 w-48 md:w-40 ">
                                <p className=" text-white text-lg md:text-sm text-shadow-lg p-2  w-48 md:w-40 h-1/3 hover:overflow-visible overflow-hidden ">{user.name}</p>
                                <button
                                        className="bg-cyan-300  p-1 md:mt-3 md:m-auto m-1   mt-0 text-shadow-lg md:text-xs   text-white rounded-md shadow-sm shadow-black hover:shadow-white justify-end w-44 md:w-36"
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
              <article className="w-full   bg-color3-publicacion h-full overflow-hidden  ">
              {mostrarSolicitudes&&<h1 className="bg-color1-nav text-white p-2 text-2xl border-y-2 border-color6-lineas px-7 text-shadow-md md:text-lg md:px-2">Solicitudes de amistad</h1>}
              <article className="grid 3xl:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 md:gap-1  w-full justify-items-center   h-fit">
            {solicitudes?.map((e) => {
              if (e.solicitud === "recibida") {
                return (
                  <article className="    ">
                     


                    {mostrarSolicitudes&&<div className=" ">
                     <div className="bg-color4-comentarios rounded-md mt-2 shadow-md shadow-black  h-fit">
                      <div className="w-52 h-52 md:h-40 md:w-40 bg-black flex items-center justify-center rounded-t-md  rounde-md overflow-hidden">
                        {allUsers.map((user) => {
                          if (user.id === e.idFriend) {
                            return (
                              
                                <img className="h-52 md:h-40 " src={user.profilePic} />
                              
                            );
                          }
                        })}
                      </div>
                      <p className="text-white text-[14px] text-shadow-xl p-2 mb-0   overflow-hidden w-52 md:w-40 h-8  ">{e.name}</p>
                      <div className="flex flex-col gap-2 p-1 w-full ">
                            <button
                            className="bg-cyan-500  rounded-md  w-full text-white shadow-sm shadow-black   hover:shadow-white hover:shadow-md hover:bg-cyan-400 hover:text-shadow-sm  "
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
        </article>
    </section>
      
    
  );
}
