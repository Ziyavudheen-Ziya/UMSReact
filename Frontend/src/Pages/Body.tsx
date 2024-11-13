import {createBrowserRouter,RouterProvider} from 'react-router-dom'
 import React,{Suspense} from 'react'
// import SignUp from './UserPage/SignUp.js'
// import LoginPage from './UserPage/LoginPage.js'
// import Home from './UserPage/HomePage.js'
// import AdminLogin from './AdminPage/AdminLoginPage.js'
// import AdminDashboard from './AdminPage/AdminDashboard.js'
// import ProtectedUserRoute from '../Compoents/ProtectedUserRoute';
// import ProtectedAdminRouter from '../Compoents/ProtectedAdminRouter.js'


const SignUp = React.lazy(()=> import('./UserPage/SignUp.js')) 
const LoginPage = React.lazy(()=> import('./UserPage/LoginPage.js'))
const Home = React.lazy(()=>import('./UserPage/HomePage.js'))
const AdminLogin = React.lazy(()=>import('./AdminPage/AdminLoginPage.js'))
const AdminDashboard = React.lazy(()=> import('./AdminPage/AdminDashboard.js'))
const ProtectedUserRoute = React.lazy(()=>import('../Compoents/ProtectedUserRoute.js'))
const ProtectedAdminRouter = React.lazy(()=>import('../Compoents/ProtectedAdminRouter.js'))



function body() {


    const appRouter = createBrowserRouter([

         {path:'/',
            element:<SignUp/>
         },

         {path:'/login',
            
            element:<LoginPage/>
         },
         {path:'/user/home',
       
            element:(
               <ProtectedUserRoute>
                <Home/> 
              </ProtectedUserRoute>

                
            )
         },

         {path:'/admin',
            element:<AdminLogin/>         
        },
        {path:'/admindashboard',
         element:(
            
            <ProtectedAdminRouter>
            <AdminDashboard/>
            </ProtectedAdminRouter>
         )
         
        }
         
    ])
  return (
    <div>

   <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={appRouter}/>
    </Suspense>
    </div>
  )
}

export default body
