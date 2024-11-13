import { Navigate } from "react-router-dom";
import LoginForm from '../../Compoents/LoginFrom'
import {verfiyUserJWT} from '../../Utils/verifyUserJWT'


function LoginPage(){

     const userLogged = verfiyUserJWT();

     return userLogged ? <Navigate to='/user/home'/>:<LoginForm/>;
}

export default LoginPage;