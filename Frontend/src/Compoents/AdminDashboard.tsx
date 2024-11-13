import axios from "axios";
import {useEffect, useState} from "react";
import { useNavigate} from 'react-router-dom'
import { Backend_URL } from "../Utils/backendUrl";
import { Bounce, Id, toast } from "react-toastify";
import {useForm,SubmitHandler} from 'react-hook-form'


type DataType = {
  id: string;
  username: string;
  email: string;
  phone: string;
};



function AdminDashboard() {

  type Inputs = {

    username:string,
    email:string,
    phone:string,
    password:string,

}

const {

 register,
 handleSubmit,
  
 formState:{errors}
} = useForm<Inputs>();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectorUser, setSelectorUser] = useState<DataType | null>(null);

  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const handleEditModalOpen = (user: DataType) => {
    setSelectorUser(user);  
    setEditModalOpen(true);
  };  const handleEditModalClose = () => setEditModalOpen(false);

  
 
  const navigate = useNavigate();
  const [data,setData] = useState<DataType[]>([]);
    const [loading,setLoading] = useState<boolean>(true);


    
    useEffect(()=>{

        console.log("Came here");

        const fetchData = async()=>{

            try {
                const adminJWT = localStorage.getItem("adminJWT");

                console.log(adminJWT);

                const response = await axios.post(`${Backend_URL}/admin/getDashboardData`,
                    JSON.stringify({adminJWT}),
                    {

                       headers:{

                         "Content-Type":"application/json",
                       }
                    }
                )


                console.log(response);


                if(response.data.success){

                   setData(response.data.dashboardData.sort((a:any,b:any)=>a.username>b.username?1:-1));
                }
                
                
            } catch (error) {

              console.log(error);
              
              
            }finally{

              setLoading(false)
            }
        }
        fetchData();
    },[])

  function logoutHandler(event:any){

    event.preventDefault();
    const res = confirm("Are you wnat to logout");

    if(res){

       localStorage.removeItem("adminJWT");
       navigate('/admin')
    }
  

    

  }

  const handleEditSubmit  = async(e:React.FormEvent)=>{

     e.preventDefault()
     if(selectorUser){

       try {
           const response = await axios.put(
            `${Backend_URL}/admin/updateUser/${selectorUser.id}`,
            {

               username:selectorUser.username,
               email:selectorUser.email,
               phone:selectorUser.phone,
            },
            {
              headers:{

                 "Content-Type":"application/json",
              },
            }
           )

   
           if(response.data.success){
             alert("Updating succesfully")
             setEditModalOpen(false)
             const updatedUser = response.data.user;

        const updateUsers = data.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        );
             setData(updateUsers)
           }
       } catch (error) {
           alert("Updated not successfully")
       }
     }
  }

  const deleteUser = async(UserId:Id)=>{

       const res = confirm("Do you want to delete");

       if(res){

         try {
              const response = await axios.delete(
                 `${Backend_URL}/admin/delete/${UserId}`
              )

              if(response.data.success){

                toast("Deleted User added successfully",{

                   position:"top-center",
                   autoClose:3000,
                   hideProgressBar:false,
                   closeOnClick:true,
                   pauseOnHover:true,
                   draggable:true,
                   progress:undefined,
                   theme:"dark",
                   transition:Bounce
                });

                setTimeout(()=>{

                   window.location.reload()
                },1000)
              }
         } catch (error) {
          
         }
       }
  }


  const onSubmit: SubmitHandler<Inputs>= async(data)=>{

    try {
      const response = await axios.post(`${Backend_URL}/admin/add`,data,{

        headers:{
          "Content-Type":"application/json"
        }
      });

      if(response.data.success){
        const newUser = response.data.newUser;  

     
  
         toast("New user added successfully",{

           position:"top-center",
           autoClose:5000,
           closeOnClick:true,
           pauseOnHover:true,
           draggable:undefined,
           theme:"light",
           transition:Bounce
         })
         setData((prevData) => [...prevData, newUser]);

   

         setCreateModalOpen(false);
         setTimeout(()=> navigate('/admindashboard'),3000)
      }else{
     console.log(response.data.message);
      alert(response.data.message)
        toast(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
      
    } catch (error) {
      console.log(error);
      
      
    }
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white p-6 shadow-md">
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-500">Admin Dashboard</h1>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300" 
             onClick={logoutHandler}>
            Logout
          </button>
        </div>

        <h2 className="text-xl mt-4">User List</h2>

      
     {loading?(

        <p>Loading..</p>
     ): data&&data.length>0?(




        <table className="w-full mt-4 table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">S.No</th>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">Email</th>
              <th className="border-b p-2 text-left">Phone</th>
              <th className="border-b p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user,i)=>(



       
            <tr key={user.id}>
              <td className="border-b p-2">{i+1}</td>
              <td className="border-b p-2">{user?.username}</td>
              <td className="border-b p-2">{user?.email}</td>
              <td className="border-b p-2">{user?.phone}</td>
              <td className="border-b p-2">
                <button onClick={()=>handleEditModalOpen(user)} className="mr-2 text-blue-500">
                  Edit
                </button>
                <button className="text-red-500" onClick={()=>deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
     ):(
       <p>No Data Available</p>
         )}
        <button onClick={handleCreateModalOpen} className="mt-8 bg-green-500 text-white p-2 rounded">
          Create New User
        </button>

        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold">Create New User</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
            
                {...register("username",{
                   required:"Username is required",
                   pattern:{
                       value:/^[A-Za-z]+$/i,
                       message:"Please enter Alphabets"
                   }
                })}
                  type="text"
                  placeholder="Name"
                  className="mt-2 p-2 w-full border rounded"
                />
                <p className="text-red-600">{errors.username?.message}</p>
                <input
                {...register('email',{

                    pattern:{
                      value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message:"Please enter valid email"
                    }
                })}
                  type="email"
                  placeholder="Email"
                  className="mt-2 p-2 w-full border rounded"
                />
                <p className="text-red-600">{errors.email?.message}</p>
                <input
                 {...register('phone',{

                  required:"Phone number is required",
                  pattern:{
                    value:/^\d{10}$/,
                    message:"Please enter a valid phone number"
                  }
                 })}
                  type="tel"
                  placeholder="Phone"
                  className="mt-2 p-2 w-full border rounded"
                />
                <p className="text-red-600">{errors.phone?.message}</p>
                <input
                {...register('password',{

                     required:"Password is requires",
                     minLength:{
                       value:6,
                       message:"Password atleast 6 value needed."
                     }
                })}
                  type="password"
                  placeholder="Password"
                  className="mt-2 p-2 w-full border rounded"
                />
                <p className="text-red-600">{errors.password?.message}</p>
                <button type="submit" className="mt-4 bg-green-500 text-white p-2 rounded">
                  Create User
                </button>
              </form>
              <button
                onClick={handleCreateModalClose}
                className="mt-4 bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

   
        {isEditModalOpen && selectorUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold">Edit User</h2>
              <form onSubmit={handleEditSubmit}>
                <input
                  value={selectorUser?.username}
                  type="text"
                  placeholder="Name"
                  className="mt-2 p-2 w-full border rounded"
                  onChange={(e) =>
                    setSelectorUser({ ...selectorUser, username: e.target.value })
                  }
                />
                <input
                  value={selectorUser?.email}
                  type="email"
                  placeholder="Email"
                  className="mt-2 p-2 w-full border rounded"
                  onChange={(e) =>
                    setSelectorUser({ ...selectorUser, email: e.target.value })
                  }
                />
                <input
                  value={selectorUser?.phone}
                  type="tel"
                  placeholder="Phone"
                  className="mt-2 p-2 w-full border rounded"
                  onChange={(e) =>
                    setSelectorUser({ ...selectorUser, phone: e.target.value })
                  }
                />

                <button
                  type="submit"
                  className="mt-4 bg-blue-500 text-white p-2 rounded"
                >
                  Update User
                </button>
              </form>
              <button
                onClick={handleEditModalClose}
                className="mt-4 bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
     
      </div>


    </div>
  )
}

export default AdminDashboard
