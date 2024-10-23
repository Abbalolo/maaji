import React, { useEffect, useState } from 'react';
import { useUserContextData } from '../context/userData';
import Image from 'next/image';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Overview: React.FC = () => {
  const { competitions, userInfo } = useUserContextData();
  const [userLeagues, setUserLeagues] = useState<Record<string, string>>({});

  const fetchRegisteredLeague = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const leagueRegistered = userData?.leagueRegistered || {};
        setUserLeagues(leagueRegistered);
       
      }
    } catch (error) {
      console.error("Error fetching registered league:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchRegisteredLeague(userInfo.uid);
    }
  }, [userInfo]);

  const updateLeagueStatus = async (name: string, userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      // Update the leagueRegistered field dynamically based on the league name
      await updateDoc(userDocRef, {
        [`leagueRegistered.${name}`]: "Active", // Use computed property name
      });
      console.log("League status updated successfully");
      setUserLeagues(prev => ({ ...prev, [name]: "Active" })); // Update the local state
    } catch (error) {
      console.error("Error updating league status:", error);
    }
  };

  const pay = (label: string) => {
    console.log("Updating league status for:", label);
    if (userInfo) {
      updateLeagueStatus(label, userInfo.uid);
    }
  };

  return (
    <div className="grid gap-4 p-5">
      <h2>Enter Competition</h2>
      {competitions.map((competition) => (
        <div key={competition.id} className="flex flex-col items-center gap-3 p-4 border border-gray-600 rounded-lg shadow-md">
          <Image
            src={competition.img}
            width={200}
            height={100}
            className="rounded-md"
            alt={competition.name}
          />
          <h3 className="font-semibold text-lg">{competition.name}</h3>
          {userLeagues[competition.label] === "Active" ? (
            <button className="btn-grad w-[100px]" disabled>
              Paid
            </button>
          ) : (
            <button 
              onClick={() => pay(competition.label)} 
              className={`btn-grad w-[100px] ${competition.button === "close" ? "opacity-[0.7] pointer-events-none" : ""}`}
              disabled={competition.button === "close"} // Disable if the button is "close"
            >
              {competition.button}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Overview;
