import  {configureStore} from '@reduxjs/toolkit';



import userReducer from './User/userSlice'
import adminReducer from './Admin/adminSlice'

export const store = configureStore({

     reducer:{
        user:userReducer,
        admin:adminReducer
     }
})



