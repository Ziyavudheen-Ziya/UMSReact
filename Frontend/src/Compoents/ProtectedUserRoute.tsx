import {Navigate} from 'react-router-dom';
import {verfiyUserJWT} from '../Utils/verifyUserJWT';




type Element = {

    children:JSX.Element
}




function ProtectedUserRoute({children}:Element) {
console.log("protect");


  const userLogged = verfiyUserJWT();


    
  return userLogged? <>{children }</> : <Navigate to='/login'/>
}

export default ProtectedUserRoute
