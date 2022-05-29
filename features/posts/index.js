import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {database} from '../../config/firebase'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs} from 'firebase/firestore'
import { async } from "@firebase/util";



export const getPosts = createAsyncThunk("cart/obtenerPost",async (data,thunkAPI)=>{
    const idUser=data
    const col = collection(database,"usuarios",idUser,"posts")
    const snapshot = await getDocs(col)
    const posts = []

    snapshot.forEach(doc=>{
      posts.push({...doc.data(),id:doc.id})
    })
    // console.log(carrito)
    return posts
})







const postsSlice = createSlice({
    name:"posts",
    initialState:{
        items:[],
        
        loading:false
        
    
    },
    reducers:{
     
    },
    extraReducers(builder){
        
        

        //OBTENER PUBLICACIONES
        builder.addCase(getPosts.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getPosts.fulfilled,(state,action)=>{
            state.loading= false
            state.items=action.payload
        })
        builder.addCase(getPosts.rejected,(state,action)=>{
            state.loading = false
        })


    }

})

const postsReducer = postsSlice.reducer

export default postsReducer