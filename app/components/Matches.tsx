// import React from 'react'
// import gamelogo from "../assets/gamelogo.jpg";
// import Image from 'next/image';
// import { Swords } from 'lucide-react';
// function Matches() {
//   return (
//     <div className='p-5'>
//       <div className="flex flex-col justify-center items-center gap-10">

//         <div className="flex items-center gap-10">
//         <div className="flex flex-col items-center gap-3 ">
//               <Image
//                 src={gamelogo}
//                 width={100}
//                 height={50}
//                 className="rounded-md"
//                 alt="user team" 
//               />
//               <h3 className="font-semibold text-lg">LOLO</h3>
//             </div>

//             <div className="flex flex-col gap-2">
//               <p>VS</p>
//               <Swords className='text-gray-400'/>
//             </div>

//             <div className="flex flex-col items-center gap-3 ">
//               <Image
//                 src={gamelogo}
//                 width={100}
//                 height={50}
//                 className="rounded-md"
//                 alt="user team"
//               />
//               <h3 className="font-semibold text-lg">Abba</h3>
//             </div>
//         </div>

//         <div className="flex items-center  gap-10">
//         <div className="flex flex-col items-center gap-3 ">
//               <Image
//                 src={gamelogo}
//                 width={100}
//                 height={50}
//                 className="rounded-md"
//                 alt="user team" 
//               />
//               <h3 className="font-semibold text-lg">LOLO</h3>
//             </div>

//             <div className="flex flex-col gap-2">
//               <p>VS</p>
//               <Swords className='text-gray-400'/>
//             </div>

//             <div className="flex flex-col items-center gap-3 ">
//               <Image
//                 src={gamelogo}
//                 width={100}
//                 height={50}
//                 className="rounded-md"
//                 alt="user team"
//               />
//               <h3 className="font-semibold text-lg">Abba</h3>
//             </div>
//         </div>

//       </div>
//     </div>
//   )
// }
import React from 'react';
import { useUserContextData } from '../context/userData';


// // Define the Team type
// type Team = {
//   id: number;
//   name: string;
//   logo: string | StaticImageData ;
//   points: number;
//   goals: number;
//   wins: number;
//   losses: number;
// };

// // Define the Fixture type
// type Fixture = {
//   home: Team;
//   away: Team;
// };

// import Image, { StaticImageData } from 'next/image';

const PremierLeagueSimulator: React.FC = () => {
  const { userFixtures } = useUserContextData();
  // const [fixtures, setFixtures] = useState<Fixture[]>([]);
  // const [userFixtures, setUserFixtures] = useState<Fixture[]>([]);
// console.log(userFixtures)
  // Function to shuffle an array
  // const shuffleArray = (array: Team[]): Team[] => {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  //   }
  //   return array;
  // };

  // // Function to generate home and away fixtures
  // const generateFixtures = (teams: Team[]): Fixture[] => {
  //   const fixtures: Fixture[] = [];

  //   // Each team plays two games against every other team (home and away)
  //   for (let i = 0; i < teams.length; i++) {
  //     for (let j = i + 1; j < teams.length; j++) {
  //       fixtures.push({ home: teams[i], away: teams[j] });
  //       fixtures.push({ home: teams[j], away: teams[i] });
  //     }
  //   }

  //   return fixtures;
  // };

  // useEffect(() => {
  //   if (customPaidUsers) {
  //     // Transform `customPaidUsers` into `Team` type
  //     const teams: Team[] = customPaidUsers.map((user, index) => ({
  //       id: index + 1,
  //       name: user.username,
  //       logo: user.profileImageUrl || gamelogo, // Fallback to gamelogo if no profile image
  //       points: user.league?.customLeague?.points || 0,
  //       goals: user.league?.customLeague?.goals || 0,
  //       wins: user.league?.customLeague?.wins || 0,
  //       losses: user.league?.customLeague?.losses || 0,
  //     }));

  //     // Shuffle teams and generate fixtures
  //     const shuffledTeams = shuffleArray(teams);
  //     const generatedFixtures = generateFixtures(shuffledTeams);
  //     setFixtures(generatedFixtures);


  //     const currentUserFixtures = generatedFixtures.filter(
  //       (match) => match.home.name === userInfo?.username || match.away.name === userInfo?.username
  //     );
  //     setUserFixtures(currentUserFixtures);
  //   }
  // }, [customPaidUsers, userInfo]);

  return (
    <div>
      <h1>My match Fixtures</h1>
      <div className=''>
        {userFixtures?.map((match, index) => (
          <div className='flex flex-col items-center justify-center gap-5' key={index} style={{ marginBottom: '20px' }}>
            <p className='mt-5'>
              Match {index + 1}: 
            </p>

            <div className="flex gap-10 items-center justify-center">
            {/* <div className='flex flex-col justify-center items-center gap-3' >
              <Image  
                src={match.home.logo} 
                alt={`${match.home.name} logo`} 
                style={{ width: '50px', height: '50px', marginRight: '10px' }} 
              />
              <p>{match.home.name} (Home)</p>
            </div> */}
            
            {/* <div className='flex flex-col justify-center items-center gap-3' >
              <Image 
                src={match.away.logo} 
                alt={`${match.away.name} logo`} 
                style={{ width: '50px', height: '50px', marginRight: '10px' }} 
              />
              <p>{match.away.name} (Away)</p>
            </div> */}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremierLeagueSimulator;
