import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth";
import friendsReducer from "../features/friends/solicitudes";
import postsReducer from "../features/posts";
import usersReducer from "../features/users";

const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postsReducer,
        users:usersReducer,
        friends:friendsReducer
    }
})

export default store