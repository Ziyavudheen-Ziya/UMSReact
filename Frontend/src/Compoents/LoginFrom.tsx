
import { Link } from "react-router-dom"
import {useForm,SubmitHandler} from "react-hook-form"
import { Bounce,ToastContainer,toast } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginUser } from "../Redux/User/userSlice"
import { Backend_URL } from "../Utils/backendUrl"

function Login() {


  const navigate = useNavigate()
  const dispatch = useDispatch()

  type Inputs={

    email:string,
     password:string
  }


  const {
    register,
    handleSubmit,
     formState:{errors}
  }= useForm<Inputs>();


  const onSubmit: SubmitHandler<Inputs> = async(data)=>{

      try {

        console.log("data varunde ",data);
        

        const response = await toast.promise(

           axios.post(`${Backend_URL}/user/login`,data),
           {
                     pending:"Login In",
                     success:"Logged in successfully",
                     error:"Failed to login"
           },
           {

             position:"top-center",
             autoClose:1500,
             hideProgressBar:false,
             closeOnClick:true,
             pauseOnHover:true,
             draggable:undefined,
             progress:undefined,
             theme:"dark",
             transition:Bounce
           }
        );

       
        if(response.data.success){

            localStorage.setItem("userJWT",response?.data?.userJWT)
            dispatch(loginUser())
            setTimeout(()=> navigate('/user/home'),1500);
        }
        
      } catch (error:any) {


        toast.error(error.response.data.message,{

           position:"top-center",
           autoClose:5000,
           hideProgressBar:false,
           closeOnClick:true,
           pauseOnHover:true,
           draggable:true,
           progress:undefined,
           theme:"dark",
           transition:Bounce
        });



      }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-3xl font-bold text-green-500 mb-8 text-center">Login</h1>
       <ToastContainer/>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
              {...register('email',{
                required:"Email is required",
                 pattern:{

                   value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                   message:"Invalid email address"
                 }
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
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input

          {...register('password',{


                required:"Password is required",
                minLength:{

                   value:6,
                   message:"Password must be atleast 6 character"
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
            Log In
          </button>
        </div>
         <p>Do you have account?</p>
         <Link to='/'>
      
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </div> 
        
          
        </Link>
        <br />
        
      <Link to='/admin'>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Admin Login
          </button>
        </div>
        </Link>
      </form>
    </div>
  </div>
  )
}

export default Login
