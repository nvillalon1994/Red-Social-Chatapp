import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {database} from '../../config/firebase'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs,setDoc} from 'firebase/firestore'




export const getSolicitud = createAsyncThunk("solicitud/obtenerSolicitud",async (data,thunkAPI)=>{
    // const idUser=data
    // const col = collection(database,"usuarios",idUser,"solicitudes")
    // const snapshot = await getDocs(col)
    // const solicitudes = []

    // snapshot.forEach(doc=>{
    //   solicitudes.push({...doc.data(),id:doc.id})
    // })

    const solicitudes = data
    
    return solicitudes
})
export const getFriends = createAsyncThunk("friends/obtenerAmigos",async (data,thunkAPI)=>{
    const idUser=data
    const col = collection(database,"usuarios",idUser,"friends")
    const snapshot = await getDocs(col)
    const amigos = []

    snapshot.forEach(doc=>{
      amigos.push({...doc.data(),id:doc.id})
    })
    
    return amigos
})

export const addFriend = createAsyncThunk("friends/addFriends",async (data,thunkAPI)=>{
    const state = thunkAPI.getState()
    console.log(data)
    const idUser = data
    // const col = collection(database,`usuarios/${state.auth.user.id}/solicitudes/`)
    const a = Date.now()
    const b = "a"+a
    const friends =state.friends.friends
    const solicitudes = state.friends.solicitudes
    const crearSolicitud=()=>{
            setDoc(doc(database,"usuarios/"+state.auth.user.id+"/solicitudes",b),{
            estado:"pendiente",
            solicitud:"enviada",
            idFriend:data
        })
        setDoc(doc(database,"usuarios/"+data+"/solicitudes",b),{
            estado:"pendiente",
            solicitud:"recibida",
            name:state.auth.user.name,
            profilePic:state.auth.user.profilePic,
            idFriend:state.auth.user.id
        })
  
    }
    console.log(solicitudes,friends)
    if(friends.length===0 && solicitudes.length===0){
        console.log("no hay amigos ni solicitudes enviarmos solicitud")
        crearSolicitud()
    }
    if(friends.length!==0 && solicitudes.length===0){
        console.log("hay amigos,no hay solicutudes")
       const a = friends.find((friend)=>friend.id===idUser)
        if(a===undefined){
            console.log("no esta en amigosaca se agrega la solicitud")
            crearSolicitud()
           }else{
            console.log("no se hace nada")
           }
    }   
    if(friends.length===0 && solicitudes.length!==0){
        console.log("no hay amigos, si hay solicutudes")
        const a = solicitudes.find((solicitud)=>solicitud.idFriend===idUser)
        
        if(a===undefined){
            console.log("no esta en solicitudes,aca se agrega la solicitud")
            crearSolicitud()
        }else{
            console.log("no se hace nada")
        }
    }
    if(friends.length!==0 && solicitudes.length!==0){
        // friends.map((friend)=>console.log(friend.id===idUser))
        const a = solicitudes.find((solicitud)=>solicitud.idFriend===idUser)
        console.log("hay amigos y hay solicitudes")
        const b = friends.find((friend)=>friend.id===idUser)
        // console.log(a,b)
        if(a===undefined&&b===undefined){
               console.log("no esta en solicitudes ni en amigos,aca se agrega la solicitud")
               crearSolicitud()
              }else{
                console.log("no esta ni en los amigos, ni en las solicitudes,no se hace nada")
              }
    }
    
    
    
    
    
    
    
    
})
export const acceptFriend = createAsyncThunk("friends/acceptFriends",async (data,thunkAPI)=>{
    
    const state = thunkAPI.getState()
    
    
    setDoc(doc(database,`usuarios/${state.auth.user.id}/friends`,data.idFriend),{
        name:data.name,
        profilePic:data.profilePic
    })
    deleteDoc(doc(database,"usuarios/"+state.auth.user.id+"/solicitudes",data.idSolicitud))

    setDoc(doc(database,`usuarios/${data.idFriend}/friends`,state.auth.user.id),{
        name:state.auth.user.name,
        profilePic:state.auth.user.profilePic
    })
    deleteDoc(doc(database,"usuarios/"+data.idFriend+"/solicitudes",data.idSolicitud))



})
export const declineFriend = createAsyncThunk("friends/acceptFriends",async (data,thunkAPI)=>{
    
    const state = thunkAPI.getState()
    
    
    
    deleteDoc(doc(database,"usuarios/"+state.auth.user.id+"/solicitudes",data.idSolicitud))

    
    deleteDoc(doc(database,"usuarios/"+data.idFriend+"/solicitudes",data.idSolicitud))



})
export const deleteFriend = createAsyncThunk("friends/acceptFriends",async (data,thunkAPI)=>{
    
    const state = thunkAPI.getState()
    console.log(data)
    
    
    deleteDoc(doc(database,"usuarios/"+state.auth.user.id+"/friends",data))
    deleteDoc(doc(database,"usuarios/"+data+"/friends",state.auth.user.id))

    
    



})


const friendsSlice = createSlice({
    name:"friends",
    initialState:{
        solicitudes:[],
        friends:[],
        loading:false
        
    
    },
    reducers:{
     
    },
    extraReducers(builder){
        
        

        //AGREGAR SOLICITUDES
        builder.addCase(addFriend.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(addFriend.fulfilled,(state,action)=>{
            state.loading= false
            state.solicitudes=action.payload
        })
        builder.addCase(addFriend.rejected,(state,action)=>{
            state.loading = false
        })
        //OBTENER SOLICITUDES
        builder.addCase(getSolicitud.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getSolicitud.fulfilled,(state,action)=>{
            state.loading= false
            state.solicitudes=action.payload
        })
        builder.addCase(getSolicitud.rejected,(state,action)=>{
            state.loading = false
        })
        builder.addCase(getFriends.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getFriends.fulfilled,(state,action)=>{
            state.loading= false
            state.friends=action.payload
        })
        builder.addCase(getFriends.rejected,(state,action)=>{
            state.loading = false
        })

        builder.addCase(acceptFriend.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(acceptFriend.fulfilled,(state,action)=>{
            state.loading= false
            state.friends=[...state.friends,action.payload]
        })
        builder.addCase(acceptFriend.rejected,(state,action)=>{
            state.loading = false
        })


    }

})

const friendsReducer = friendsSlice.reducer

export default friendsReducer