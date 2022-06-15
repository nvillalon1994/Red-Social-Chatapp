import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {database} from '../../config/firebase'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs, onSnapshot, getDoc} from 'firebase/firestore'




export const getPosts = createAsyncThunk("posts/obtenerPost",async (data,thunkAPI)=>{
    const idUser=data
    const col = collection(database,"usuarios",idUser,"posts")
    
    
    
    const posts =[]
    const snapshot = await getDocs(col)
    
    snapshot.forEach(doc=>{
      posts.push({...doc.data(),id:doc.id})
    })
    console.log("posts",posts)
    
    return posts
})
export const deletePost = createAsyncThunk("posts/borrarPosts",async (data,thunkAPI)=>{
    const idUser=data.idUser
    const idPost = data.idPost
    
    const col = collection(database,"usuarios",idUser,"posts")
    const docRef=doc(database,"usuarios/"+idUser+"/posts",idPost)
    deleteDoc(docRef)

})
export const editePost = createAsyncThunk("posts/editarPosts",async (data,thunkAPI)=>{
    const idUser=data.idUser
    const idPost = data.idPost
    const editedPost =data.post
    console.log(data)
    // const col = collection(database,"usuarios",idUser,"posts")
    
    updateDoc(doc(database,"usuarios/"+idUser+"/posts",idPost),editedPost)

})




export const getAllPosts = createAsyncThunk("cart/obtenerPost2",async (data,thunkAPI)=>{
    
    const state = thunkAPI.getState()
    const friends = state.friends.friends
    const array =[]
    for(const f in friends){
        
        const col = collection(database,"usuarios",friends[f].id,"posts")
        const snapshot = await getDocs(col)
        snapshot.forEach(doc=>{
        // console.log({...doc.data(),id:doc.id})
        array.push({...doc.data(),id:doc.id})
        })
        
        
    }
    
    return array
    
})


const postsSlice = createSlice({
    name:"posts",
    initialState:{
        items:[],
        allposts:[],
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
        //OBTENER PUBLICACIONES
        builder.addCase(getAllPosts.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getAllPosts.fulfilled,(state,action)=>{
            state.loading= false
            state.allposts=action.payload
        })
        builder.addCase(getAllPosts.rejected,(state,action)=>{
            state.loading = false
        })

    }

})
export const {agregarPost} = postsSlice.actions
const postsReducer = postsSlice.reducer

export default postsReducer