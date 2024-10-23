"use client";

import customLeague from "../assets/customeLeague.png";
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { StaticImageData } from "next/image";
import { auth, db } from "../firebase/firebase";
import { collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";

// Define the structure of user data
export interface UserData {
  uid: string;
  username: string;
  email: string;
  phone: string;
  profileImageUrl: string;
  sex: string;
  createdAt: Date;
}

// Define the structure of competitions
interface Comp {
  id: number;
  name: string;
  label: string;
  button: string;
  img: string | StaticImageData;
}

// Define the UserContextType interface
interface UserContextType {
  user: FirebaseUser | null;
  userInfo: UserData | null;
  isAdmin: boolean
   setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  customPaidUsers: CustomUser[] | null
  setUser: React.Dispatch<React.SetStateAction<FirebaseUser | null>>;
  competitions: Comp[];
  setCompetitions: React.Dispatch<React.SetStateAction<Comp[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<UserData | null>>;
  setCustomPaidUsers: React.Dispatch<React.SetStateAction<CustomUser[]>>;
}

interface LeagueStats {
  points: number;
  goals: number;
  wins: number;
  losses: number;
}

interface CustomUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  league: {
    championsLeague: LeagueStats;
    customLeague: LeagueStats;
    europaLeague: LeagueStats;
    conferenceLeague: LeagueStats;
  };
  profileImageUrl: string;
  leagueRegistered: {
    championsLeague: string;
    customLeague: string;
    europaLeague: string;
    conferenceLeague: string;
  };
  createdAt: Date | Timestamp;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [customPaidUsers, setCustomPaidUsers] = useState<CustomUser[]>([]);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [teams, setTeams] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<Comp[]>([
    {
      id: 0,
      name: "Champions League",
      label: "championsLeague",
      button: "close",
      img: "https://www.sportonspec.co.uk/wp-content/uploads/2024/01/uefa-champions-league-banner-862x485.jpg",
    },
    {
      id: 1,
      name: "Europa League",
      label: "europaLeague",
      button: "close",
      img: "https://cdn.vox-cdn.com/thumbor/GNh7b230E6WI_ZtxIijDRTNpVYI=/0x0:5472x3648/920x613/filters:focal(2385x300:3259x1174):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/70263881/1234893442.0.jpg",
    },
    {
      id: 2,
      name: "Conference League",
      label: "conferenceLeague",
      button: "close",
      img: "https://media.asroma.com/prod/images/landscape_medium_fill/eb2b41232410-keyviewsueclrb8zmf.jpg",
    },
    {
      id: 3,
      name: "Custom League",
      label: "customLeague",
      button: "Register",
      img: customLeague,
    },
  ]);



  const pathname = usePathname();
  const router = useRouter();



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);

        const usersList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          };
        }) as CustomUser[];

        setCustomPaidUsers(usersList);
      } catch (err) {
        console.log(err);
       
      } 
    };

    fetchUsers();
  }, []);

  
  
  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserInfo(userDoc.data() as UserData);
      } else {
        console.error("User data not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
    }
  };

  useEffect(() => {
    const excludePaths = ["/auth/login", "/auth/signup", "/"]

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid)

        if (pathname === "/auth/login" && currentUser) {
          // Redirect to home or admin page if already logged in
          router.push("/home");
        }
      } else if (!excludePaths.includes(pathname)) {
        setUser(null);
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);






  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userInfo,
        setUserInfo,
        competitions,
        setCompetitions,
        customPaidUsers,
        setCustomPaidUsers,
        isAdmin, setIsAdmin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContextData = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContextData must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUserContextData };
