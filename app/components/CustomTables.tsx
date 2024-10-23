"use client";

import gamelogo from "../assets/gamelogo.jpg";
import gamepad from "../assets/gamepad.png";
import Image from "next/image";
import { useUserContextData } from "../context/userData";

function CustomTables() {
  const { userInfo, customPaidUsers } = useUserContextData();

  // Filter users who have registered for the custom league
  const filterPaidUsers = customPaidUsers?.filter((user) => {
    return user.leagueRegistered.customLeague === "Active";
  }) || [];

  // Create teams based on the filtered users
  const teams = filterPaidUsers?.map((user, index) => ({
    id: index + 1,
    name: user.username,
    logo: user.profileImageUrl || gamelogo, // Fallback to gamelogo if profileImageUrl is not available
    points: user.league.customLeague.points,
    goals: user.league.customLeague.goals,
    wins: user.league.customLeague.wins,
    losses: user.league.customLeague.losses,
  }));

  return (
    <div>
      {filterPaidUsers?.length > 0 && (
        <>
          <h2 className="font-semibold text-lg">Custom League</h2>
          <table className="text-sm rounded-lg shadow-md overflow-hidden min-w-full mt-2">
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
              {teams?.map((team) => (
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
                    <h3 className="text-sm flex gap-3 items-center">
                      {userInfo?.username === team.name ? (
                        <>
                          {team.name}
                          <Image
                            src={gamepad}
                            width={30}
                            height={30}
                            className="rounded-md"
                            alt="Gamepad icon"
                          />
                        </>
                      ) : (
                        team.name
                      )}
                    </h3>
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
      )}
    </div>
  );
}

export default CustomTables;
