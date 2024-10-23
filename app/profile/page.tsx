"use client";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, db, firebaseStorage } from "../firebase/firebase";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { signOut, updatePassword } from "firebase/auth";
import { useUserContextData } from "../context/userData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

function Page() {
  const { userInfo, isAdmin } = useUserContextData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [sex, setSex] = useState("");
  // const [uploadFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    userInfo?.profileImageUrl || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isLogOut, setIsLogOut] = useState<boolean>(false);
  const router = useRouter();
  // const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID

  // console.log(userInfo?.uid)
  // console.log(adminUid)



  // Handle file change and upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
      await uploadIdToFirestore(file);
    }
  };

  const uploadIdToFirestore = async (file: File) => {
    if (!auth.currentUser) throw new Error("User not authenticated");

    const userId = auth.currentUser.uid;
    const storageRef = ref(
      firebaseStorage,
      `profileImages/${userId}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Error during upload:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { profileImageUrl: downloadURL });
        setProfileImageUrl(downloadURL);
        setImagePreview(downloadURL);
      }
    );
  };

  const handleLogOut = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        router.push("/auth/login");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGenderChange = (value: string) => {
    setSex(value);
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    await updateDoc(userDocRef, {
      username,
      phone,
      sex: sex,
    });
    toast({
      title: "Profile updated",
    });
  
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    console.log(user);

    if (user) {
      try {
        await updatePassword(user, password);
        console.log("Password updated successfully");
        setPassword("");
        toast({
          title: "Password updated successfully",
        });
      } catch (error) {
        console.error("Error updating password:", error);
        toast({
          variant: "destructive",

          title: "Error updating password",
        });
      }
    } else {
      console.error("No authenticated user found");
      toast({
        variant: "destructive",

        title: "No authenticated user found",
      });
    }
    console.log("Password change functionality to be implemented");
  };



  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setPhone(userInfo.phone);
      setSex(userInfo.sex);
    }
  }, [userInfo]);

  return (
    <div className={`animate-slideIn w-full h-full flex flex-col justify-between mb-20`}>
      {isLogOut && (
        <div className="absolute w-full top-0 left-0 bg-[#1a1818b0] h-screen z-[10] flex justify-center items-center ">
          <div className="bg-[#1b1b29] border border-slate-600 shadow-lg md:w-[30%] w-[70%] h-[200px] gap-3 flex flex-col justify-center items-center rounded-md">
            <h3 className="font-semibold">Logout Confirmation</h3>
            <p>Are you sure you want to log out?</p>
            <div className="">
              <button onClick={() => setIsLogOut(false)} className="text-gray-200 px-4 py-2">
                Cancel
              </button>
              <button onClick={handleLogOut} className="text-red-400 px-4 py-2">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col py-6 gap-2 dark:bg-[#25262A]">
        {isAdmin &&  <span className="bg-blue-500 text-center w-80[px] py-1 px-4 absolute right-0 top-0 text-sm">Admin</span>}
       
        <div className="flex flex-col justify-center items-center pb-3">
          <label
            htmlFor="file-upload"
            className=" flex justify-center items-center cursor-pointer overflow-hidden"
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {profileImageUrl || imagePreview ? (
              <div className="h-[80px] w-[80px]">
                <Image
                  src={imagePreview || (profileImageUrl as string)}
                  alt="profile image"
                  className="rounded-full object-contain"
                  width={500}
                  height={500}
                />
              </div>
            ) : (
              <div className="bg-gray-300 w-[80px] flex justify-center items-center rounded-full h-[80px]">
                <User className="text-[50px]" />
              </div>
            )}
          </label>
        </div>
        <header className="text-white bg-black font-semibold px-5 py-2">
          Personal Information
        </header>
        <div className="flex flex-col gap-4 px-5 dark:bg-[#25262A]">
          <form className="flex flex-col gap-3" onSubmit={handlePersonalInfoSubmit}>
            <div className="">
              <Label htmlFor="username">Username</Label>
              <Input
                className="bg-transparent border-gray-600"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                className="bg-transparent border-gray-600"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+2349132316236"
              />
            </div>
            <div className="">
              <Label htmlFor="sex">Gender</Label>
              <Select value={sex} onValueChange={handleGenderChange}>
                <SelectTrigger className="bg-transparent border-gray-600">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent className="bg-[#161622]">
                  <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="btn-grad mt-5 w-[150px]">
              Save
            </Button>
          </form>

          <form onSubmit={handlePasswordChange}>
            <div className="">
              <Label htmlFor="password">Change password</Label>
              <div className="flex items-center gap-3">
                <Input
                  className="bg-transparent border-gray-600"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button type="submit" className="btn-grad w-[100px]">
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="px-5 py-4">
          <Link
            href="/privacy-policy"
            className="text-[12px] text-gray-500 underline"
          >
            Privacy policy
          </Link>
        </div>
      </div>
      <button
        disabled={loading}
        onClick={() => setIsLogOut(true)}
        className="flex justify-center text-white text-sm bg-red-500 py-2 gap-2 items-center"
      >
        <LogOut /> Log out
      </button>
    </div>
  );
}

export default Page;
