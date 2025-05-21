import React from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

import {
  Edit,
  EqualApproximatelyIcon,
  FolderPen,
  Loader,
  Loader2,
  Mail,
  Pencil,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const updateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(10, "Username must be at most 10 characters"),
});

function ProfilePage() {
  const { authUser, updateProfile, isUpdating } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");

  if (!authUser) {
    console.log("authUser 26 = ", authUser);
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  } else {
    console.log("authUser 20 = ", authUser);
  }

  const [file, setFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      if (!file) {
        toast.error("Please select an image");
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username); // if you're collecting this too
      formData.append("avatar", file); // file from state

      await updateProfile(formData);

      document.getElementById("my_modal_1").close();
    } catch (error) {
      console.error("update profile failed", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen ">
        <div className="flex w-full space-x-4 ">
          <div className="w-[30%] border-r border-amber-50 pr-4 h-full min-h-screen ">
            <div className="profileSection  px-2">
              <h2 className="text-2xl text-start font-semibold">
                Your Profile
              </h2>
              <div className="flex pb-4 sm:flex-col md:flex-row items-start justify-around border-b border-gray-400 ">
                <div className="w-18 h-18  bg-gray-400 rounded-full mt-2">
                  <img
                    src={authUser.image}
                    className="w-full h-full rounded-full overflow-hidden"
                    alt=""
                  />
                </div>
                <div className="profileInfo mt-8 ">
                  <h2 className="text-sm text-gray-100   text-start font-semibold">
                    {authUser.name}
                  </h2>
                  <h2 className="text-sm text-gray-400   text-start font-semibold">
                    {authUser.email}
                  </h2>
                </div>
              </div>

              <div className="text-white mt-8 p-2 border-b border-gray-400 pb-8">
                <h3>Perosnal Information</h3>

                <div className="mt-4 flex flex-col gap-4">
                  <div className=" flex gap-2 items-start">
                    <div className="icon">
                      <Mail />
                    </div>
                    <div className="name">{authUser.email}</div>
                  </div>
                  <div className=" flex gap-2 items-start">
                    <div className="icon">
                      <FolderPen />
                    </div>
                    <div className="name">{authUser.name}</div>
                  </div>
                  <div className=" flex gap-2 items-start">
                    <div className="icon">
                      <User />
                    </div>
                    <div className="name">{authUser.username}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
                className="flex items-center justify-between w-full text-gray-800 dark:text-gray-200 mt-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 rounded-lg p-3 transition-all duration-300 ease-in-out transform cursor-pointer "
              >
                <span>Edit Profile</span>
                <Pencil />
              </button>

              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Edit profile</h3>
                  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        onChange={handleName}
                        placeholder={authUser.name}
                        {...register("name")}
                        className={`input input-bordered w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                          errors.name
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        placeholder={authUser.username}
                        onChange={handleUsername}
                        {...register("username")}
                        className={`input input-bordered w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                          errors.username
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.username.message}
                      </p>
                    )}
                    <div>
                      <label
                        htmlFor="avatar"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Avatar
                      </label>
                      <input
                        type="file"
                        id="avatar"
                        {...register("avatar")}
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="file-input file-input-bordered w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <div className="modal-action">
                      <button type="submit" className="btn btn-primary">
                        {isUpdating ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>updating profile...</span>
                          </div>
                        ) : (
                          "Update"
                        )}
                      </button>
                      <button type="button" className="btn">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </dialog>
            </div>
          </div>
          <div className="w-[70%]">Right</div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
