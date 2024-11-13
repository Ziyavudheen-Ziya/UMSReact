import { Link, useNavigate,  } from "react-router-dom"
import { useDispatch } from "react-redux"
import {useForm,SubmitHandler} from 'react-hook-form'
import {ToastContainer,toast,Bounce} from 'react-toastify'
import axios from "axios"
import { Backend_URL } from "../Utils/backendUrl"
import {loginUser} from '../Redux/User/userSlice'


function SignUp() {


   const dispatch = useDispatch()
   let navigate = useNavigate()
   type Inputs = {
 
    username:string,
    email:string,
    phone:string,
    password:string
       
   }

   const {
  
   register,
    handleSubmit,
    formState:{errors},

   } = useForm<Inputs>();
 

  const Onsubmit : SubmitHandler<Inputs> = async(data)=>{

     let response ;
      console.log("data is comming",data);
      
     try {
       response = await toast.promise(
          
        axios.post(`${Backend_URL}/user/signup`,data),
        {
         
          pending:'Signing up',
          success:'User registered successfully',
          error:'User already exsist'

        },
        {

           position:'top-center',
           autoClose:1500,
           hideProgressBar:false,
           closeOnClick:true,
           pauseOnHover:true,
           draggable:true,
           progress:undefined,
           theme:'dark',
           transition:Bounce
        }
        
        
       );

       console.log(response);

       if(response.data.success){

           localStorage.setItem('userJWT',response.data.userJWT);
           
           setTimeout(()=>{
            dispatch(loginUser());
            navigate('/user/home')
             
           },3000);
       }
       
     } catch (error:any) {
       
      const errorMessage = 
      error.response && error.response.data
      ? error.response.data.message:"Failed to signup";

      toast.error(errorMessage,{

          position:'top-center',
          autoClose:5000,
          hideProgressBar:false,
          closeOnClick:true,
          pauseOnHover:true,
          draggable:true,
          progress:undefined,
          theme:'dark',
          transition:Bounce
      })
      
     }
  }


  return (

<div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-500 mb-8 text-center">Sign Up</h1>
        <ToastContainer/>
        <form onSubmit={handleSubmit(Onsubmit)} className="space-y-6" >
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
               {...register('username',{required:"Name is required"})}
              type="text"
              id="name"
              placeholder="Enter your name"
            />
            {errors.username&&(
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
                 
                 {...register("email",{

                   required:"Email is required",

                   pattern:{
                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                     message:"Invalid email address"
                   },
                 })}

  
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              id="email"
              placeholder="Enter your email"
            />

            {errors.email&&(
               
                <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
               
                {...register("phone",{

                    required:"Phone number is required",
                    pattern:{
                       
                       value: /^[0-9]{10}$/,
                       message:"Invalid phone number"
                    }
                })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
            />

            {errors.phone &&(

                <p className="text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input

              {...register("password",{

                  required:"Password is required",
                   minLength:{
                     value:6,
                     message:"Password must be at leaset 6 characters"
                   }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              type="password"
              id="password"
              placeholder="Enter your password"
            />

            {errors.password&&(
               
                <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              Sign Up
            </button>

            
          </div>
          <p>You have already account</p>
          <Link to='/login'>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
               
            >
              Login
            </button>
            
          </div>
          </Link>

        </form>
      </div>
    </div>

  )
}

export default SignUp
