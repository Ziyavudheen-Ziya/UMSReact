import { Navigate } from "react-router-dom";

import { verifyAdminJWT } from "../Utils/verifyAdminJWT";


type Element={

     children:JSX.Element;
}


function ProtectedAdminRouter({children}:Element){

    const adminLogged = verifyAdminJWT()

    return adminLogged ? <>{children}</>:<Navigate to='/admin'/>;


}


export default ProtectedAdminRouter;