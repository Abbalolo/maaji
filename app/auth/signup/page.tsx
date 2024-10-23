"use client";
import Loader from "@/app/components/loader";
import { auth, db } from "@/app/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string>("");
  
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  // const [toggleModal, setToggleModal] = useState<boolean>(false);
  const { toast } = useToast();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const url: string = 'https://free-football-api-data.p.rapidapi.com/football-event-statistics?eventid=12650707';
  //     const options: FetchOptions = {
  //       method: 'GET',
  //       headers: {
  //         'x-rapidapi-key': '04c12fd4b8mshc79341574ca5498p12cd4ajsn8e67fe9fcb1f',
  //         'x-rapidapi-host': 'free-football-api-data.p.rapidapi.com'
  //       }
  //     };

  //     try {
  //       const response: Response = await fetch(url, options);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result: EventData = await response.json(); // Typed response data
  //       console.log(result);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const capitalizeFirstLetter = (letter: string): string => {
    if (!letter) return ""; // Handle empty string case
    const firstLetter = letter.slice(0, 1).toUpperCase(); // Capitalize the first letter
    const restOfString = letter.slice(1); // Get the rest of the string
    return firstLetter + restOfString; // Concatenate and return the result
  };

  // handleSubmit logic
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = "Please enter your username";
    if (!email || !/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) newErrors.password = "Please enter a password";
    if (password !== cPassword) newErrors.cPassword = "Passwords do not match";

    // If there are any errors, set them and return early
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile with a capitalized username
      await updateProfile(user, {
        displayName: capitalizeFirstLetter(username),
      });

      const userData = {
        uid: user.uid,
        league: {
          championsLeague: {
            points: 0,
            goals: 0,
            wins: 0,
            losses: 0,
          },
          customLeague: { points: 0, goals: 0, wins: 0, losses: 0 },
          europaLeague: {
            points: 0,
            goals: 0,
            wins: 0,
            losses: 0,
          },
          conferenceLeague: { points: 0, goals: 0, wins: 0, losses: 0 },
        },
        profileImageUrl: "",
        leagueRegistered: {
          championsLeague: "inActive",
          customLeague: "inActive",
          europaLeague: "inActive",
          conferenceLeague: "inActive",
        },
        username: capitalizeFirstLetter(username),
        phone,
        email,
        createdAt: new Date(),
      };

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData, { merge: true });

      // setToggleModal(true);
      setErrors({});
      toast({ title: "User has been created successfully" });

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error during sign-up",
      });
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
        <h2 className="font-semibold text-xl text-center">Sign Up</h2>

        <Button className="w-full border border-gray-600 hover:bg-slate-700">
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
          Continue with google
        </Button>

        <div className="flex justify-center">
          <p className="text-center border border-slate-600 px-2 py-1 rounded-md">
            or
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="">
            <Label htmlFor="username">Username</Label>
            <Input
              className="bg-transparent border-gray-600"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="">
            <Label htmlFor="email">Email address</Label>
            <Input
              className="bg-transparent border-gray-600"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="">
            <Label htmlFor="email">Phone number</Label>
            <Input
              className="bg-transparent border-gray-600"
              type="numer"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+2349132316236"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          {/* <div className="">
            <Label htmlFor="email">Dream Team</Label>
              <div className="">
              <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
      </div>
          </div> */}

          <div className="">
            <Label htmlFor="password">Password</Label>
            <Input
              className="bg-transparent border-gray-600"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="">
            <Label htmlFor="cpassword">Confirm Password</Label>
            <Input
              className="bg-transparent border-gray-600"
              type="password"
              value={cPassword}
              onChange={(e) => setCpassword(e.target.value)}
              placeholder="confirm password"
            />
            {errors.cPassword && (
              <p className="text-red-500 text-sm">{errors.cPassword}</p>
            )}
          </div>
          <Button className="btn-grad mt-5">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
