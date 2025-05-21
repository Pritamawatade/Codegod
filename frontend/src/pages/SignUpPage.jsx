import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import toast from "react-hot-toast";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  username: z.string(),
});

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigninUp } = useAuthStore();
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (file) {
      const isValid =
        file.type.startsWith("image/") && file.size < 5 * 1024 * 1024;
      if (!isValid) {
        toast.error("Only images under 5MB are allowed");
        setFile(null);
      }
    }
  }, [file]);
  const onSubmit = async (data) => {
    try {
      if (!file) {
        toast.error("Please select an image");
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("username", data.username); // if you're collecting this too
      formData.append("avatar", file); // file from state

      await signup(formData);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-amber-100 dark:bg-gray-900 rounded-md shadow-xl p-8 sm:p-10 transition-all duration-300 h-full overflow-hidden">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
              <Code className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50  bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text  ">
            Create Account
          </h1>
          <p className="text-gray-500">Get started with our platform</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register("name")}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 placeholder:opacity-20 ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register("username")}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 placeholder:opacity-20 ${
                  errors.username
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="pirateCoder"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 placeholder:opacity-20 ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-500"
              >
                {!showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative mt-4 mb-4">
            <div className="flex justify-center items-center w-full">
              <label
                htmlFor="avatar"
                className="flex items-center px-4 py-2 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-100"
              >
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 relative">
                  Select an avatar
                  <p
                    className="absolute top-[-100%] right-[-50%] text-md text-gray-400"
                    style={{ fontSize: "0.6rem" }}
                  >
                    *Optional
                  </p>
                </span>
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                {...register("avatar")}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSigninUp}
            className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            {isSigninUp ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          <GoogleLoginBtn className="mt-4" />

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
