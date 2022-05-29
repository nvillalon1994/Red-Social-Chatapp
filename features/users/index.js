import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {database} from '../../config/firebase'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs} from 'firebase/firestore'




export const getUsers = createAsyncThunk("users/obtenerUsers",async (data,thunkAPI)=>{
    
    const col = collection(database,"usuarios")
    const snapshot = await getDocs(col)
    const users = []

    snapshot.forEach(doc=>{
      users.push({...doc.data(),id:doc.id})
    })
    
    return users
})







const usersSlice = createSlice({
    name:"users",
    initialState:{
        usuarios:[],
        
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


    }

})

const usersReducer = usersSlice.reducer

export default usersReducer