import SignUPLoginForm from "../../Compoents/SignUpLoginForm";
import { Navigate } from "react-router-dom";
import { verfiyUserJWT } from "../../Utils/verifyUserJWT";

function SignUpPage(){
console.log('1');

   const userLogged = verfiyUserJWT();
  
   
   return userLogged? <Navigate to='/user/home' />: <SignUPLoginForm/>;
}


export default SignUpPage