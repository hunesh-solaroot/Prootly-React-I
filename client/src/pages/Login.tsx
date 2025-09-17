import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen flex">
      {/* Left Side - Background with overlay content */}
      <div 
        className="flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Green overlay */}
        <div className="absolute inset-0 bg-green-600/80"></div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="p-8">
            <div className="bg-white rounded-lg p-6 w-fit">
              <img 
                src={solarootLogo} 
                alt="Solaroot Logo" 
                className="h-12 w-auto"
                data-testid="img-logo"
              />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex items-center justify-start px-8">
            <div className="text-white max-w-md">
              <h1 className="text-4xl font-bold mb-8" data-testid="text-heading">
                Master Your Solar Projects
              </h1>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13z"/>
                    </svg>
                  </div>
                  <span data-testid="text-feature-1">Track processes smoothly</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                      <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586V7z"/>
                    </svg>
                  </div>
                  <span data-testid="text-feature-2">Access live update anytime</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                      <path d="M8 12l2 2 4-4"/>
                    </svg>
                  </div>
                  <span data-testid="text-feature-3">Get customized insights</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 11V7a5 5 0 0 1 10 0v4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h1zm2-4a3 3 0 0 1 6 0v4H9V7z"/>
                    </svg>
                  </div>
                  <span data-testid="text-feature-4">Manage projects with ease</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span data-testid="text-feature-5">Enhance team collaboration</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  </div>
                  <span data-testid="text-feature-6">Personalized fit to your needs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full max-w-md bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-8" data-testid="text-signin-heading">
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
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  className={`pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.email ? 'border-red-500' : ''}`}
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`pl-10 pr-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 ${errors.password ? 'border-red-500' : ''}`}
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                <Label htmlFor="remember-me" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password">
                <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer" data-testid="link-forgot-password">
                  Forgot Password?
                </span>
              </Link>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium disabled:opacity-50"
              data-testid="button-signin"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup">
                  <span className="text-green-600 hover:text-green-800 cursor-pointer font-medium" data-testid="link-signup">
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