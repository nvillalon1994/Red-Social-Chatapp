import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { BiLogOutCircle } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { IoStorefront } from "react-icons/IO";

import { AiFillBell, AiFillHome, AiFillWechat,AiOutlineLogin } from "react-icons/ai";
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
  
  const users = useSelector((state) => state.users.usuarios);
  const [config, setConfig] = useState(false);
  const router = useRouter();
  const logout2 = () => {
    dispatch(logout());
    signOut(auth);
    setConfig(false);
    
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
  
  
  
  return (
    <nav className="bg-color1-nav w-full  3xl:p-3 lg:px-1 fixed top-0 z-50
    
       ">
      <ul className=" flex justify-between text-white   ">
        <li className="logo 3xl:w-1/6 lg:w-1/2 p-1  ">
          <Link href="/">Insta-book</Link>
        </li>
        {!auth2.logged && (
          <li>
            <Link href="/login"><AiOutlineLogin className="text-2xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1 mr-1 "/></Link>
          </li>
        )}
        {auth2.logged && (
          <ul className="flex lg:w-2/3 w-4/6 justify-center gap-24 lg:gap-16 md:gap-3 md:ml-5 md:w-1/4 ">
            <li>
              {" "}
              <Link href={"/"}>
                <AiFillHome className="text-2xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1" />
              </Link>
            </li>
            <li className="md:hidden">
              <MdOutlineOndemandVideo className="text-2xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1" />
            </li>
            <li className="md:hidden">
              <FaStoreAlt className="text-2xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1" />
            </li>
            <Link href={"/friends2"}
              
            >
              <FaUsers className="text-2xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1" />
            </Link>

            <li className="md:hidden">
              <SiSquare className="text-2xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1" />
            </li>
          </ul>
        )}
        {auth2.logged && (
          <div className="flex gap-2 text-white 3xl:w-1/6 lg:w-1/2 justify-end">
            <div className=" relative">
              <AiFillBell
                className="text-xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1"
                onClick={() => {
                  setOpen(!open);
                  setConfig(false);
                }}
              />

              {solicitudes?.map((e) => {
                if (e.solicitud === "recibida") {
                  return (
                    <div className="absolute  top-0 right-[-7px] bg-red-300 h-4 w-4 text-white text-shadow-lg text-center rounded-full text-xs">
                      {solicitudes.length}
                    </div>
                  );
                }
              })}
            </div>

            <Link href={"/friends"}>
              <AiFillWechat className="text-2xl bg-emerald-400 shadow-sm shadow-black rounded-full hover:shadow-md hover:shadow-white h-8 w-8 p-1" />
            </Link>
            <div className="flex gap-3 items-center w-8 h-8 rounded-full overflow-hidden bg-black">
              {allUsers.map((user) => {
                if (user.id === auth2.user.id) {
                  return (
                    <div
                      onClick={() => {
                        setConfig(!config);
                        setOpen(false);
                      }}
                      href={"/profile/" + auth2.user.id}
                      className="flex relative w-40 h-40 overflow-hidden rounded-full bg-black"
                    >
                      <img
                        className="w-full h-auto m-auto "
                        src={user.profilePic}
                        alt=""
                        onClick={() => {
                          dispatch(getUserProfile(auth2.user.id));
                          dispatch(getUserPosts(auth2.user.id));
                          dispatch(getUserFriends(auth2.user.id));
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </ul>

      
      {config && (
        <div className="absolute  bg-color1-nav w-60 z-40  shadow-sm shadow-black p-2 flex flex-col gap-3 top-14 right-2 ">
          <div
            className="flex items-center gap-4 text-white text-shadow-md text-lg bg-emerald-300 p-2"
            onClick={() => {
              setConfig(false);
              
            }}
          >
            <BsFillPersonFill className="bg-emerald-400 shadow-sm shadow-black  rounded-full hover:shadow-md hover:shadow-white h-7 w-7 p-1" />
            <Link href={"/profile/" + auth2.user.id}>Ir a tu perfil</Link>
          </div>
          <div
            className="flex items-center gap-4 text-white text-shadow-md text-lg bg-emerald-300 p-2"
            onClick={logout2}
          >
            <BiLogOutCircle className=" bg-emerald-400 shadow-sm shadow-white  rounded-full hover:shadow-lg hover:shadow-white h-7 w-7 p-1" />
            Cerrar Sesión
          </div>
        </div>
      )}
      {open && (
        <div className="absolute right-1 top-14 z-40  w-80  bg-color1-nav shadow-sm rounded-md shadow-black ">
          {solicitudes.length === 0 && (
            <h1 className="text-white p-2 shadow-sm shadow-black rounded-sm">
              No tienes notificaciónes
            </h1>
          )}
          {solicitudes?.map((e) => {
            if (e.solicitud === "recibida") {
              return (
                <div className=" m-1 ">
                  <div className="  flex items-center p-1 gap-1 bg-emerald-300  m-2">
                    <div className="">
                      {allUsers.map((user) => {
                        if (user.id === e.idFriend) {
                          return (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-black">
                              <img className="h-10 " src={user.profilePic} />
                            </div>
                          );
                        }
                      })}
                    </div>
                    <p className="text-xs  w-1/3 text-white text-shadow-lg">
                      {e.name}
                    </p>
                    <div className="flex gap-2   w-1/3">
                      <button
                        className="bg-cyan-400 p-1 rounded-sm m-auto text-white shadow-md  hover:shadow-black text-shadow-md "
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
                        className="bg-red-200 p-1 rounded-md m-auto text-white shadow-md  hover:shadow-black text-shadow-md"
                        onClick={() => {
                          eliminarSolicitud(e.idFriend, e.id);
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
      
    </nav>
  );
}
