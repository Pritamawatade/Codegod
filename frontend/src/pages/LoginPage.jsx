import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Eye, EyeOff, Loader2, ArrowRight, Check } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const inputClass = (hasError) =>
  `h-11 w-full rounded-lg border bg-white dark:bg-white/[0.03] pl-3.5 pr-10 text-sm outline-none transition-colors placeholder:text-zinc-400 ${
    hasError
      ? "border-rose-300 dark:border-rose-500/50 focus:border-rose-500"
      : "border-zinc-200 dark:border-white/10 focus:border-zinc-400 dark:focus:border-white/30"
  }`;

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/problems");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="grid min-h-screen bg-white dark:bg-[#09090b] lg:grid-cols-2">
      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-[380px]">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-zinc-950 dark:bg-white">
              <Terminal className="h-4 w-4 text-white dark:text-zinc-950" strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">CodeGod</span>
          </Link>

          <h1 className="mt-8 text-[28px] font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-zinc-500">Sign in to continue your practice.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium">Email</label>
              <input type="email" {...register("email")} placeholder="you@example.com" className={inputClass(errors.email)} />
              {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-[13px] font-medium">Password</label>
                <Link to="/forgot-password" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className={inputClass(errors.password)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 dark:bg-white text-sm font-semibold text-white dark:text-zinc-950 transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {isLoggingIn ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              ) : (
                <>Sign in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" /> or <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            </div>

            <GoogleLoginBtn className="mt-4" />

            <p className="pt-1 text-center text-[13px] text-zinc-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-zinc-900 dark:text-white hover:underline">Create account</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Visual */}
      <div className="relative hidden overflow-hidden bg-zinc-950 dark:bg-black lg:block">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-[100px]" />
        <div className="relative flex h-full flex-col justify-center p-14">
          <div className="max-w-md">
            <p className="code-font text-xs text-white/40">$ today --practice</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white">
              Consistency is the whole game.
            </h2>
            <div className="mt-8 space-y-3.5">
              {["Curated problems with company tags", "Streaks and progress that keep you going", "A fast IDE with 13 language runtimes"].map((t) => (
                <p key={t} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  {t}
                </p>
              ))}
            </div>
            <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
              </div>
              <pre className="code-font mt-3 text-[12px] leading-relaxed text-white/70">
                {`day 47  ▓▓▓▓▓▓▓░  solved: 128\nrating ▲ 12 this week\nkeep going.`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
