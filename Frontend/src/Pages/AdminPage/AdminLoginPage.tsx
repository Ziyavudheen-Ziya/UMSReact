import {Navigate} from 'react-router-dom';
import AdminLogin from '../../Compoents/AdminLoginFrom';

import {verifyAdminJWT} from '../../Utils/verifyAdminJWT';

function AdminLoginPage(){

    const adminLogged = verifyAdminJWT();

    return adminLogged? <Navigate to='/admindashboard'/>:<AdminLogin/>;

}

export default AdminLoginPage;