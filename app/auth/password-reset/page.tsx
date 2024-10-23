"use client";

import React, { FormEvent, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from 'firebase/auth';
import { ChevronLeft } from 'lucide-react';
import { auth } from '@/app/firebase/firebase';
import { Input } from '@/components/ui/input';


function Page() {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!email || !/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/Auth/login" 
      });
      console.log('Password reset email sent to:', email);
      router.push("/Auth/password-reset/succeed");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setErrors({ general: "Failed to send password reset email. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-5 h-screen">
       <button
        onClick={() => router.push("/auth/login")}
        className="border border-gray-600 p-3 rounded-md"
      >
        <ChevronLeft className="" size={20} />
      </button>

      <div className="flex flex-col justify-center items-center h-[80%]">
        <h2 className="text-2xl mb-2">Forgotten Password</h2>
        <p className="mb-4">Input your email for verification</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[300px]">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              className="bg-transparent border-gray-600"
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          {errors.general && <p className="text-red-500">{errors.general}</p>}
          <Button className='btn-grad mt-4' type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </main>
  );
}


export default Page;