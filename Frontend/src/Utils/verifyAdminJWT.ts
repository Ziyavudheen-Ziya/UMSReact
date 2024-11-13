import {useDispatch,useSelector}  from 'react-redux';
import {useEffect} from 'react';

import axios from 'axios';
import { Backend_URL } from './backendUrl';
import {loginAdmin,logOutAdmin}  from '../Redux/Admin/adminSlice';


export function verifyAdminJWT(){
     console.log("1");
     
     const dispatch = useDispatch();

     const adminLogged = useSelector((store:any)=> store.admin.adminLogged)

     const adminJWT = localStorage.getItem("adminJWT");

     useEffect(()=>{

         if(!adminJWT){

             dispatch(logOutAdmin());
             return;
         }


         async function verifyAdmin(){
             try {
                const response = await axios.post(`${Backend_URL}/admin/verifyAdmin`,{adminJWT});

                if(response.data.success){

                    dispatch(loginAdmin())
                }else{

                    dispatch(logOutAdmin())
                }
             } catch (error) {
                dispatch(logOutAdmin())
             }
         }
         verifyAdmin();
     },[adminJWT,dispatch])

     return adminLogged;
}