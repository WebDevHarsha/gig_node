"use client"

import * as React from "react"
import { useState } from "react"
import { Eye, EyeOff, LogIn, UserPlus, BookOpen, Pencil } from "lucide-react"
import { Navbar } from "@/components/Navbar"


const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ")

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "bg-blue-500 text-white hover:bg-blue-600",
          "h-10 px-4 py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-blue-400 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border border-blue-200 bg-white text-gray-900 shadow-sm", className)} {...props} />
)
Card.displayName = "Card"

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)
CardContent.displayName = "CardContent"

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
)
CardFooter.displayName = "CardFooter"



interface User {
  email: string;
  password: string;
}


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/users');
      const users = await response.json();

      // Check if user exists and password matches
      const matchedUser = users.find(
        (user: User) =>
          user.email === formData.email && 
          user.password === formData.password
      );
      

      if (matchedUser) {
        window.location.href = '/';
      } else {
        setError('Incorrect email or password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during login';
      setError(errorMessage);
      console.error('Error during login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="login-password">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-blue-500" /> : <Eye className="h-4 w-4 text-blue-500" />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full">
        <LogIn className="mr-2 h-4 w-4" />
        Log In
      </Button>
    </form>
  );
};


// Password strength validation function
const isPasswordStrong = (password: string): boolean => {
  // At least 8 characters long
  // Contains at least one uppercase letter
  // Contains at least one lowercase letter
  // Contains at least one number
  // Contains at least one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const SignUpForm=() =>{
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password strength
    if (!isPasswordStrong(formData.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      
      // Set success state to trigger redirect
      setIsSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error during signup:', error);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 rounded-lg shadow-md text-center">
        <div className="text-green-600 font-bold text-xl mb-4">
          Signup Successful! Redirecting...
        </div>
        <div className="animate-pulse">
          <UserPlus className="mx-auto h-12 w-12 text-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <div>
          <Label htmlFor="signup-username">Username</Label>
          <Input
            id="signup-username"
            name="username"
            type="text"
            required
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters with uppercase, lowercase, number, and special character
          </p>
        </div>
        <div>
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full mt-4 flex items-center justify-center"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default function DoodleAuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [isAnimating, setIsAnimating] = useState(false)

  const handleTabChange = (tab: "login" | "signup") => {
    if (tab !== activeTab) {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveTab(tab)
        setIsAnimating(false)
      }, 300) 
    }
  }

  return (
    <>
    <Navbar></Navbar>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center p-4">
     
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-center text-gray-900">Gig it</h2>
          </div>
          <p className="text-center text-sm text-gray-600">Start your gig!</p>
        </CardHeader>
        <CardContent>
          <div className="flex border-b border-blue-200 mb-4">
            <button
              className={cn(
                "flex-1 py-2 text-center font-medium transition-colors duration-300",
                activeTab === "login" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-400"
              )}
              onClick={() => handleTabChange("login")}
            >
              Log In
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-center font-medium transition-colors duration-300",
                activeTab === "signup" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-400"
              )}
              onClick={() => handleTabChange("signup")}
            >
              Sign Up
            </button>
          </div>
          <div className="relative">
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                isAnimating ? "opacity-0 transform translate-x-full" : "opacity-100 transform translate-x-0"
              )}
            >
              {activeTab === "login" ? <LoginForm /> : <SignUpForm />}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-600">
            By using Gig Node, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
      <div className="absolute bottom-4 right-4 animate-bounce">
        <Pencil className="h-8 w-8 text-blue-500" />
      </div>
    </div>
    </>
  )
}