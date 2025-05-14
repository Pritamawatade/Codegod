import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";

const signUpSchema = z.object({
  eamil: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formstate: { error },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  
  return <div>SignUpPage</div>;
}

export default SignUpPage;
