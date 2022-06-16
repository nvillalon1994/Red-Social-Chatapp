import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {database} from '../../config/firebase'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs} from 'firebase/firestore'





export const getUsers = createAsyncThunk("users/obtenerUsers",async (data,thunkAPI)=>{
    const state = thunkAPI.getState()
    
    const col = collection(database,"usuarios")
    const snapshot = await getDocs(col)
    
    
    const users = []
    snapshot.forEach(doc=>{
        users.push({...doc.data(),id:doc.id})
      })
    
    const users2 = Object.assign([],users)
    
    const friends=Object.assign([],state.friends.friends)
    for(let i=0;i<friends.length;i++){
        const a=friends[i]
        
        let index = users2.findIndex( e => e.id===a.id );
        console.log(index)
        users2.splice(index,1)

    }

    return users2
})
export const getAllUsers = createAsyncThunk("users/obtenerAllUsers",async (data,thunkAPI)=>{
    const state = thunkAPI.getState()
    console.log("estas")
    const col = collection(database,"usuarios")
    const snapshot = await getDocs(col)
    
    
    const users = []
    snapshot.forEach(doc=>{
        users.push({...doc.data(),id:doc.id})
      })
    console.log(users)
    let usuario 
    users.map((user)=>{
        if(user.id=data){
            usuario=user
        }
    })
    console.log(usuario)
    return usuario
})



const usersSlice = createSlice({
    name:"users",
    initialState:{
        usuarios:[],
        usuario:[],
        loading:false
        
    
    },
    reducers:{
     
    },
    extraReducers(builder){
        
        

        //OBTENER PUBLICACIONES
        builder.addCase(getUsers.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getUsers.fulfilled,(state,action)=>{
            state.loading= false
            state.usuarios=action.payload
        })
        builder.addCase(getUsers.rejected,(state,action)=>{
            state.loading = false
        })

        builder.addCase(getAllUsers.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getAllUsers.fulfilled,(state,action)=>{
            state.loading= false
            state.usuario=action.payload
        })
        builder.addCase(getAllUsers.rejected,(state,action)=>{
            state.loading = false
        })


    }

})

const usersReducer = usersSlice.reducer

export default usersReducer