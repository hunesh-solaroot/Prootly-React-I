import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock, AlertCircle, TrendingUp, Clock, BarChart, FolderKanban, Users, Settings2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import solarootLogo from "@assets/solaroot (1)_1758101120764.png";
import backgroundImage from "@assets/img5_1758101120765.jpg";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const [, setLocation] = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");
    
    try {
      const result = await login(data.email, data.password, data.rememberMe);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        setLocation("/"); // Redirect to dashboard
      } else {
        setLoginError(result.error || "Login failed");
      }
    } catch (error) {
      setLoginError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Background with overlay content */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative items-center justify-center p-12"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Semi-transparent green overlay covering the entire left half */}
        <div className="absolute inset-0 bg-green-600/70"></div>
        
        {/* Logo container - positioned relatively within the left half */}
        <div className="absolute top-49 left-1/2 -translate-x-1/2 mt-12 z-20"> {/* Centered top */}
            <div className="bg-white rounded-lg p-6">
              <img 
                src={solarootLogo} 
                alt="Solaroot Logo" 
                className="h-50 w-auto" // CHANGED: Logo size doubled from h-14 to h-28
                data-testid="img-logo"
              />
            </div>
        </div>

        {/* Content block with blur effect - absolutely positioned */}
        {/* CHANGED: Adjusted vertical position from top-1/2 to top-[55%] to increase gap */}
        {/* <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                      w-[80%] max-w-lg bg-white/10 backdrop-blur-md rounded-xl p-10">
            <div className="text-white text-center">
              <h1 className="text-4xl font-bold mb-8" data-testid="text-heading">
                Master Your Solar Projects
              </h1>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 flex-shrink-0" />
                  <span data-testid="text-feature-1">Track processes smoothly</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 flex-shrink-0" />
                  <span data-testid="text-feature-2">Access live update anytime</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <BarChart className="w-6 h-6 flex-shrink-0" />
                  <span data-testid="text-feature-3">Get customized insights</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-6 h-6 flex-shrink-0" />
                  <span data-testid="text-feature-4">Manage projects with ease</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 flex-shrink-0" />
                  <span data-testid="text-feature-5">Enhance team collaboration</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Settings2 className="w-6 h-6 flex-shrink-0" />
                  <span data-testid="text-feature-6">Personalized fit to your needs</span>
                </div>
              </div>
            </div>
        </div> */}
      </div>
      
      {/* Right Side - Login Form (No changes here) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-green-600 mb-8" data-testid="text-signin-heading">
              Sign in to your account
            </h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {loginError && (
              <Alert variant="destructive" data-testid="alert-login-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  className={`pl-10 h-12 border-gray-200 rounded-md focus:border-green-500 focus:ring-green-500 ${errors.email ? 'border-red-500' : ''}`}
                  data-testid="input-email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500" data-testid="error-email">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`pl-10 pr-10 h-12 border-gray-200 rounded-md focus:border-green-500 focus:ring-green-500 ${errors.password ? 'border-red-500' : ''}`}
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500" data-testid="error-password">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  {...register("rememberMe")}
                  id="remember-me" 
                  data-testid="checkbox-remember-me"
                />
                <Label htmlFor="remember-me" className="text-sm text-gray-600 font-medium">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password">
                <span className="text-sm text-green-600 hover:text-green-800 cursor-pointer font-medium" data-testid="link-forgot-password">
                  Forgot Password?
                </span>
              </Link>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold rounded-md disabled:opacity-50"
              data-testid="button-signin"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup">
                  <span className="text-green-600 hover:text-green-800 cursor-pointer font-semibold" data-testid="link-signup">
                    Sign up
                  </span>
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}