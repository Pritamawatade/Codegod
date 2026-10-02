import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Terminal, Eye, EyeOff, Loader2, ArrowRight, Check } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  name: z.string().min(2, "Enter your name"),
  username: z.string().min(3, "At least 3 characters"),
});

const inputClass = (hasError) =>
  `h-11 w-full rounded-lg border bg-white dark:bg-white/[0.03] px-3.5 text-sm outline-none transition-colors placeholder:text-zinc-400 ${
    hasError
      ? "border-rose-300 dark:border-rose-500/50 focus:border-rose-500"
      : "border-zinc-200 dark:border-white/10 focus:border-zinc-400 dark:focus:border-white/30"
  }`;

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data) => {
    try {
      await signup({ name: data.name, email: data.email, password: data.password, username: data.username });
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="grid min-h-screen bg-white dark:bg-[#09090b] lg:grid-cols-2">
      {/* Visual */}
      <div className="relative hidden overflow-hidden bg-zinc-950 dark:bg-black lg:block">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-[100px]" />
        <div className="relative flex h-full flex-col justify-center p-14">
          <div className="max-w-md">
            <p className="code-font text-xs text-white/40">$ start --journey</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white">
              Go from random grinding to deliberate practice.
            </h2>
            <div className="mt-8 space-y-3.5">
              {["Topic-wise sheets from easy to hard", "Discuss approaches with the community", "Interview-focused company sets"].map((t) => (
                <p key={t} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-[380px]">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-zinc-950 dark:bg-white">
              <Terminal className="h-4 w-4 text-white dark:text-zinc-950" strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">CodeGod</span>
          </Link>

          <h1 className="mt-8 text-[28px] font-bold tracking-tight">Create account</h1>
          <p className="mt-1.5 text-sm text-zinc-500">Free to start. No credit card needed.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium">Name</label>
                <input {...register("name")} placeholder="Ada Lovelace" className={inputClass(errors.name)} />
                {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium">Username</label>
                <input {...register("username")} placeholder="adalove" className={inputClass(errors.username)} />
                {errors.username && <p className="mt-1.5 text-xs text-rose-600">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium">Email</label>
              <input type="email" {...register("email")} placeholder="you@example.com" className={inputClass(errors.email)} />
              {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Minimum 6 characters"
                  className={`${inputClass(errors.password)} pr-10`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSigninUp}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 dark:bg-white text-sm font-semibold text-white dark:text-zinc-950 transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {isSigninUp ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
              ) : (
                <>Create account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" /> or <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            </div>

            <GoogleLoginBtn className="mt-4" />

            <p className="pt-1 text-center text-[13px] text-zinc-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
