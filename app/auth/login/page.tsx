"use client";
import Loader from "@/app/components/loader";
import { useUserContextData } from "@/app/context/userData";
import { auth, db } from "@/app/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

function Page() {
  const router = useRouter();
const { setIsAdmin} = useUserContextData()
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const provider = new GoogleAuthProvider();
  const { toast } = useToast();

  // async function assignAdminRole(uid: string) {
  //   const response = await fetch('/api/adminRole', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ uid }),
  //   });
  
  //   if (response.ok) {
  //     console.log('Admin role assigned successfully');
  //   } else {
  //     console.error('Failed to assign admin role');
  //   }
  // }



  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
  
    const newErrors: { [key: string]: string } = {};
  
    // Input validation for email and password
    if (!email || !/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
  
    if (!password) {
      newErrors.password = "Please enter a password";
    }
  
    // If there are any validation errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setLoading(true); // Start loading spinner or indicator
  
    try {
      // Firebase sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user document from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      // Check if user document exists
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        // Check if the user has an admin field set to true
        if (userData?.admin === true) {
          console.log("Admin login");
  
          setIsAdmin(true); // Set admin state to true
  
          // Admin login success toast
          toast({
            title: "Admin login successful",
          
          });
  
          // Redirect to admin dashboard
          router.push("/admin");
        } else {
          // Regular user login success toast
          toast({
            title: "Login successful",
           
          });
  
          // Redirect to the home page
          router.push("/home");
        }
      } else {
        throw new Error("User document not found in Firestore");
      }
    } catch (error) {
      console.error("Login error:", error);
  
      // Set an error message and show an error toast
      setErrors({ password: "Invalid email or password" });
      toast({
        title: "Login unsuccessful",
      
        description: "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false); // Stop loading after completion
    }
  };
  

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      setErrors({});
      await signInWithPopup(auth, provider);
      router.push("/home");
      toast({
        title: "User login successful",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "User login unsuccessful",
      });
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      {loading && <Loader />}

      <button
        onClick={() => router.push("/")}
        className="border border-gray-600 p-3 rounded-md"
      >
        <ChevronLeft className="" size={20} />
      </button>

      <div className="flex flex-col gap-5">
        <h2 className="font-semibold text-xl text-center">Log in</h2>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-600 hover:bg-slate-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>{" "}
          Continue with Google
        </Button>

        <div className="flex justify-center">
          <p className="text-center border border-slate-600 px-2 py-1 rounded-md">or</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="">
            <Label htmlFor="email">Email address</Label>
            <Input
              className="bg-transparent border-gray-600"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center justify-between border rounded-md p-2 border-gray-600">
              <input
                className="bg-transparent outline-none border-none w-full"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="XXXXXXXX"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          <Link href="/auth/password-reset" className="underline w-[40%] text-sm hover:text-orange-400 cursor-pointer">
            Forgot password?
          </Link>

          <Button type="submit" className="btn-grad mt-5">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
