import React from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { EqualApproximatelyIcon, FolderPen, Mail, User } from "lucide-react";

function ProfilePage() {
  const { authUser } = useAuthStore();
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

              
            </div>
          </div>
          <div className="w-[70%]">Right</div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
