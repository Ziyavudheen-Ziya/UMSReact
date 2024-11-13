import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Backend_URL } from "../Utils/backendUrl";

type UserData = {
  username: string;
  email: string;
  phone: string;
  image: string | undefined;
};

function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  function imageHandler(e: any) {
    setImage([...e.currentTarget.files][0]);
  }

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userJWT = localStorage.getItem("userJWT");

        if (!userJWT) {
          toast.error("User is not authenticated", {
            position: "top-center",
            autoClose: 3000,
          });
          navigate("/login");
          return;
        }
        const response = await axios.post(`${Backend_URL}/user/fetchUserData`, {
          userJWT,
        });

        if (response.data.success) {
          console.log(response.data.userData);
          alert(JSON.stringify(response?.data?.userData));
          setUserData(response.data.userData);
        } else {
          throw new Error(response.data.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.log("Error fetching user data ", error);
      }
    }
    fetchUserData();
  }, []);

  async function uploadImage(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const userJWT = localStorage.getItem("userJWT");
      if (userJWT) {
        formData.append("userJWT", userJWT);
      }

      const response = await axios.post(
        `${Backend_URL}/user/uploadImage`,
        formData
      );

      console.log(response);

      if (response.data.success) {
        setLoading(false);
        alert("Image added successfully");

        setUserData((prevUserData) => ({
          ...(prevUserData || {
            username: "",
            email: "",
            phone: "",
            image: "",
          }),
          image: response.data.imagePath,
        }));
      }
    } catch (error) {
      setLoading(false);
    }
  }

  function logoutHandler(event: any) {
    const res = confirm("Do you wnat to logout");

    if (res) {
      event.preventDefault();
      localStorage.removeItem("userJWT");

      toast.loading("Logging Out", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      setTimeout(() => navigate("/login"), 2200);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <ToastContainer />
        <h1 className="text-3xl font-bold text-green-500">Dashboard</h1>
        <button
          onClick={logoutHandler}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>

      <div className="flex-grow flex justify-center items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-green-500 mb-8 text-center">
            Welcome to Your Dashboard
          </h1>
          {userData ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Your Details
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Name:</strong>
                {userData?.username}{" "}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong>
                {userData?.email}{" "}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Phone:</strong> {userData?.phone}
              </p>
            </div>
          ) : (
            "Loading User Data"
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upload a File
            </h2>

            <form onSubmit={uploadImage} encType="multipart/form-data">
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Preview:
                </h3>
                <img
                  width="300px"
                  height="200px"
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : userData?.image
                      ? `${Backend_URL}/images/${userData.image}`
                      : `${Backend_URL}/images/default.jpg`
                  }
                />
              </div>
              <input
                type="file"
                name="image"
                onChange={imageHandler}
                accept="image/*"
                className="w-full text-gray-700 mb-4 p-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Upload File
                {loading ? "Loading............" : "Upload Image"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
