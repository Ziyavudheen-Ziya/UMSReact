import axios from "axios"
import {useForm,SubmitHandler} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {Bounce,ToastContainer,toast} from 'react-toastify';
import { Backend_URL } from "../Utils/backendUrl";
function AdminLogin() {

  const navigate = useNavigate()

  type Inputs = {

     email:string,
     password:string
  }

 const {
  register,
  handleSubmit,
   formState:{errors},
 } = useForm<Inputs>();


 const OnSubmit: SubmitHandler<Inputs> = async(data)=>{

     try {
       const response = await axios.post(`${Backend_URL}/admin/login`,
        JSON.stringify(data),
        {
          headers:{
            "Content-Type":"application/json",
          },
        }
       )

       console.log(response);


       if(response.data?.success){
        
           
         localStorage.setItem("adminJWT",response.data?.adminJWT);

            toast.success("Logged in successfully",{

                position:"top-center",
                autoClose:5000,
                hideProgressBar:false,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined,
                theme:"dark",
                transition:Bounce
            })

            setTimeout(()=> navigate("/admindashboard"),1500)
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
      })
      
     }
 }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-2xl font-bold text-green-500 text-center mb-8">Admin Login</h1>

      <ToastContainer/>
      <form onSubmit={handleSubmit(OnSubmit)} >
        <input
          type="email"
            {...register("email",{
                pattern:{
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message:"Please enter a valid email id"
                }
            })}
          placeholder="Admin Email"
          className="mb-4 p-2 w-full border rounded"
        />
        {errors.email&&(
             <p className="text-red-500">{errors.email.message}</p>
        )}
        <input
          type="password"
           {...register("password",{

                pattern:{
                    value:
                      /^[a-zA-Z0-9]{6}$/
,
                      message:
                          "Password must contain atleast 6 characteritics"
                      
                    
                },
           })}
          placeholder="Admin Password"
          className="mb-4 p-2 w-full border rounded"
        />
        {errors.password&&(
            
            <p className="text-red-500">{errors.password.message}</p>
        )}
        <button type="submit" className="bg-green-500 text-white w-full p-2 rounded">
          Login
        </button>
      </form>
    </div>
  </div>
  )
}

export default AdminLogin
