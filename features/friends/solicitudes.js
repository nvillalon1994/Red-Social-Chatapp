import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {database} from '../../config/firebase'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs,setDoc} from 'firebase/firestore'




export const getSolicitud = createAsyncThunk("solicitud/obtenerSolicitud",async (data,thunkAPI)=>{
    const idUser=data
    const col = collection(database,"usuarios",idUser,"solicitudes")
    const snapshot = await getDocs(col)
    const solicitudes = []

    snapshot.forEach(doc=>{
      solicitudes.push({...doc.data(),id:doc.id})
    })
    
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
    
    // const col = collection(database,`usuarios/${state.auth.user.id}/solicitudes/`)
    const a = Date.now()
    const b = "a"+a
    
    setDoc(doc(database,"usuarios/"+state.auth.user.id+"/solicitudes",b),{
        estado:"pendiente",
        solicitud:"enviada"
    })
    setDoc(doc(database,"usuarios/"+data+"/solicitudes",b),{
        estado:"pendiente",
        solicitud:"recibida",
        name:state.auth.user.name,
        profilePic:state.auth.user.profilePic,
        idFriend:state.auth.user.id
    })
    
  
    
    
    
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