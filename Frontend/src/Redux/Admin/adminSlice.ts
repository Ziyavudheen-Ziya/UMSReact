import {createSlice} from '@reduxjs/toolkit';

type AdminState = {

     adminLogged : boolean
}


export type AdminSliceState = AdminState


export const adminSlice = createSlice({

     name:'admin',
     initialState:{
     
        adminLogged:false,

         
     }as AdminSliceState,
     reducers:{

         loginAdmin:(state)=>{
             state.adminLogged = true
         },
         logOutAdmin:(state)=>{
             state.adminLogged = false
         },
     },
});


export const {loginAdmin,logOutAdmin} = adminSlice.actions;

export default adminSlice.reducer;