import { Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import {  Loader } from "lucide-react";
import Layout from "./layout/Layout";
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
    
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
