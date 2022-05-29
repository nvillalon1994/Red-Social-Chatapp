import {createSlice} from '@reduxjs/toolkit'
import {database} from '../../config/firebase'
import {addDoc, collection,deleteDoc,doc,getDocs,updateDoc,docs,setDoc} from 'firebase/firestore'



const authSlice = createSlice({
    name:"auth",
    initialState:{
        logged:false,
        loading:false,
        user:{
            name:"",
            email:"",
            id:"",
            profilePic:""
        }
    },
    reducers:{
        login(state,action){
            state.logged = true
            state.loading = false
            state.user.id = action.payload.id
            state.user.name = action.payload.name
            state.user.email = action.payload.email
            state.user.profilePic = action.payload.profilePic
        },
        logout(state,action){
            state.logged = false
            state.loading = false
            state.user.id = ""
            state.user.name = ""
            state.user.email = ""
            state.user.profilePic = ""
        },
        updateData(state,action){
            state.name = action.payload.name
            state.profilePic = action.payload.profilePic
        }
    }
})


const authReducer = authSlice.reducer

export default authReducer

export const {login,logout,updateData} = authSlice.actions