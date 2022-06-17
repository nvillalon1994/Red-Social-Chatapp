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
export const getUserProfile = createAsyncThunk("users/obtenerAllUsers",async (data,thunkAPI)=>{
    console.log(data)
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
        if(user.id===data){
            usuario=user
        }
    })
    console.log(usuario)
    return usuario
})
export const getUserPosts = createAsyncThunk("users/obtenerUsersFriendPost",async (data,thunkAPI)=>{
    const col3 = collection(database,"usuarios",data,"posts")
    const posts =[]
    const snapshot3 = await getDocs(col3)
    
    snapshot3.forEach(doc=>{
      posts.push({...doc.data(),id:doc.id})
    })
    return posts
    console.log(posts)
})
export const getUserFriends = createAsyncThunk("users/obtenerUserFriends",async (data,thunkAPI)=>{
    const col2 = collection(database,"usuarios",data,"friends")
    const snapshot2 = await getDocs(col2)
    const amigos = []

    snapshot2.forEach(doc=>{
      amigos.push({...doc.data(),id:doc.id})
    })
    return amigos
    console.log(console.log())
})


const usersSlice = createSlice({
    name:"users",
    initialState:{
        usuarios:[],
        usuario:{
            usuario:{},
            friends:[],
            posts:[]
        },
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

        builder.addCase(getUserProfile.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getUserProfile.fulfilled,(state,action)=>{
            state.loading= false
            
            state.usuario.usuario=action.payload
            
        })
        builder.addCase(getUserProfile.rejected,(state,action)=>{
            state.loading = false
        })

        builder.addCase(getUserPosts.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getUserPosts.fulfilled,(state,action)=>{
            state.loading= false
            
            state.usuario.posts=action.payload
        })
        builder.addCase(getUserPosts.rejected,(state,action)=>{
            state.loading = false
        })

        builder.addCase(getUserFriends.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(getUserFriends.fulfilled,(state,action)=>{
            state.loading= false
            state.usuario.friends=action.payload
            
        })
        builder.addCase(getUserFriends.rejected,(state,action)=>{
            state.loading = false
        })


    }

})

const usersReducer = usersSlice.reducer

export default usersReducer