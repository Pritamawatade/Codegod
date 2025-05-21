import React from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

import { ALargeSmall, Loader, Loader2, Mail, Pencil, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const updateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
});

const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .nonempty()
    .min(6, "Password must be at least 6 characters"),
  newPassword: z
    .string()
    .nonempty()
    .min(6, "Password must be at least 6 characters"),
});

function ProfilePage() {
  const {
    authUser,
    updateProfile,
    isUpdating,
    isUpdatingPassword,
    updatePassword,
  } = useAuthStore();
  const navigate = useNavigate();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const passwordSubmit = async (data) => {
    try {
      await updatePassword(data);
      document.getElementById("my_modal_2").close();
    } catch (error) {
      console.log("Error updating password", error);
    }
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
                      <ALargeSmall />
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
                <div className="modal-box  bg-gray-50 dark:bg-gray-900 rounded-4xl">
                  <h3 className="font-bold text-lg text-slate-700 dark:text-gray-100">Edit profile</h3>
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
                        placeholder={authUser.name}
                        {...register("name")}
                        className={`input input-bordered w-full bg-gray-50 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
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
                        {...register("username")}
                        className={`input input-bordered w-full bg-gray-50 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
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
                        className="file-input bg-gray-50 text-black file-input-bordered w-full dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <div className="modal-action">
                      <button type="submit" className="btn btn-success text-black">
                        {isUpdating ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>updating profile...</span>
                          </div>
                        ) : (
                          "Update"
                        )}
                      </button>
                      <button
                        onClick={() =>
                          document.getElementById("my_modal_1").close()
                        }
                        type="button"
                        className="btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </dialog>

              <button
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
                className="flex items-center justify-between w-full text-gray-800 dark:text-gray-200 mt-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 rounded-lg p-3 transition-all duration-300 ease-in-out transform cursor-pointer "
              >
                <span>Update Password</span>
                <Pencil />
              </button>

              <dialog id="my_modal_2" className="modal">
               <div className="modal-box  bg-gray-50 dark:bg-gray-900 rounded-4xl">
                  <h3 className="font-bold text-lg text-black dark:text-white mb-4">Update Password</h3>
                  <form
                    className="space-y-4"
                    onSubmit={passwordHandleSubmit(passwordSubmit)}
                  >
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Current Password
                      </label>
                      <input
                        type="text"
                        id="currentPassword"
                        placeholder="Current Password"
                        {...passwordRegister("currentPassword")}
                        className={`input input-bordered w-full bg-gray-50 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                          passwordErrors.currentPassword
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        New Password
                      </label>
                      <input
                        type="text"
                        id="newPassword"
                        placeholder="New Password"
                        {...passwordRegister("newPassword")}
                        className={`input input-bordered w-full bg-gray-50 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 ${
                          passwordErrors.newPassword
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}

                    <div className="modal-action">
                      <button type="submit" className="btn btn-success text-black">
                        {isUpdatingPassword ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>updating password...</span>
                          </div>
                        ) : (
                          "Update password"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("my_modal_2").close()
                        }
                        className="btn"
                      >
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
