import { useEffect } from 'react';
import {useDispatch,useSelector} from 'react-redux'
import { loginUser, logOutUser } from '../Redux/User/userSlice';
import axios from 'axios';
import { Backend_URL } from './backendUrl';


export function verfiyUserJWT(){
console.log('2');

    
    const dispatch = useDispatch();
    const userLogged = useSelector((store: any) => store.user.isLoggedIn);

    const userJWT = localStorage.getItem('userJWT')


    useEffect(()=>{
        console.log('3');

         if(!userJWT){

             dispatch(logOutUser());
             return;
         }


         async function verifyUser() {

             try {

                const res = await axios.post(`${Backend_URL}/user/verifyUser`,{userJWT});

                if(res.data.success){
                    dispatch(loginUser())
                }else{

                    dispatch(logOutUser())
                }
                
             } catch (error) {
                dispatch(logOutUser());
                
             }
            
         }

         verifyUser();
    },[dispatch,userJWT])

    return userLogged
}