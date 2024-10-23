

"use client"
import React, { useEffect, useState } from 'react'
import gamelogo from "../assets/gamelogo.jpg";
import Image from 'next/image';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';


interface LeagueStats {
    points: number;
    goals: number;
    wins: number;
    losses: number;
  }
  
  interface User {
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
    createdAt: Date;
  }






function ConfferenceTables() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
 
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const usersCollection = collection(db, 'users');
            const snapshot = await getDocs(usersCollection);
    
            const usersList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })) as User[]; // Cast the data to the User type
    
            setUsers(usersList);
          } catch (err) {
            console.log(err)
            setError('An error occurred while fetching users');
          } finally {
            setLoading(false);
          }
        };
    
        fetchUsers();
      }, []);

     

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;
  


    const teams = Array.from({ length: 32 }, (_, index) => ({
        id: index + 1,
        name: `Team ${index + 1}`,
        logo: gamelogo, // You can replace this with different images if needed
        points: Math.floor(Math.random() * 50) + 30, // Random points between 30 and 80
        goals: Math.floor(Math.random() * 100), // Random goals between 0 and 100
        wins: Math.floor(Math.random() * 20), // Random wins between 0 and 20
        losses: Math.floor(Math.random() * 20), // Random losses between 0 and 20
      }));

      const filterPaidUsers = users.filter((user) => {
        return user.leagueRegistered.conferenceLeague === "Active";
      });

  return (
    <div>
        
        {filterPaidUsers.length > 0 ? (
        <>
      <h2 className='font-semibold text-lg'>Conference League</h2>
        <table className="text-sm rounded-lg shadow-md overflow-hidden min-w-full mt-5">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 w-full pl-3 text-left">Team</th>
              <th className="py-3 w-full pl-3 text-center">Points</th>
              <th className="py-3 w-full pl-3 text-center">Goals</th>
              <th className="py-3 w-full pl-3 text-center">Wins</th>
              <th className="py-3 w-full px-3 text-center">Losses</th>
            </tr>
          </thead>
          <tbody className="border-b border-slate-600">
            {teams.map((team) => (
              <tr
                key={team.id}
                className="hover:bg-gray-800 cursor-pointer transition duration-300 ease-in-out"
              >
                <td className="py-4 w-full flex items-center gap-3 pl-3">
                  <Image
                    src={team.logo}
                    width={30}
                    height={30}
                    className="rounded-md"
                    alt={`${team.name} logo`}
                  />
                  <h3 className="text-sm">{team.name}</h3>
                </td>
                <td className="py-4 w-full text-center">{team.points}</td>
                <td className="py-4 w-full text-center">{team.goals}</td>
                <td className="py-4 w-full text-center">{team.wins}</td>
                <td className="py-4 w-full text-center">{team.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      ) : (
       null
      )}
        
    </div>
  )
}

export default ConfferenceTables