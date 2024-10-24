"use client"; // Required for Next.js client components

import React, { useState, useEffect } from "react";
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { User } from "lucide-react";
import { Fixture, Team, useUserContextData } from "@/app/context/userData";
import { Button } from "@/components/ui/button";
import Loader from "@/app/components/loader";

const Page = () => {
  const { customPaidUsers } = useUserContextData();
  const [fixtures, setFixtures] = useState<{ fixture: Fixture; id: string }[]>(
    []
  );
  const [userFixtures, setUserFixtures] = useState<
    { fixture: Fixture; id: string }[]
  >([]);
  const [searchName, setSearchName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputGoals, setInputGoals] = useState<
    { homeGoals: string | number; awayGoals: string | number }[]
  >([]);

  const shuffleArray = (array: Team[]): Team[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Function to generate match fixtures
  const generateFixtures = (teams: Team[]): Fixture[] => {
    const fixtures: Fixture[] = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        fixtures.push({
          home: [{ homeGoals: 0, team: teams[i] }],
          away: [{ awayGoals: 0, team: teams[j] }],
        });
        fixtures.push({
          home: [{ homeGoals: 0, team: teams[j] }],
          away: [{ awayGoals: 0, team: teams[i] }],
        });
      }
    }

    return fixtures;
  };

  const startMatchFixture = async () => {
    setIsLoading(true);
    if (customPaidUsers) {
      const teams: Team[] = customPaidUsers.map((user, index) => ({
        id: index + 1,
        name: user.username,
        logo: user.profileImageUrl,
        goals: user.league?.customLeague?.goals || 0,
      }));

      const shuffledTeams = shuffleArray(teams);
      const generatedFixtures = generateFixtures(shuffledTeams);

      try {
        const fixturesCollection = collection(db, "match-fixtures");
        const fixturesWithId = await Promise.all(
          generatedFixtures.map(async (fixture) => {
            const docRef = await addDoc(fixturesCollection, { fixture });
            return { id: docRef.id, fixture }; // Pair each fixture with its ID
          })
        );

        console.log("Fixtures saved successfully!");
        setFixtures(fixturesWithId); // Set state with the new structure
      } catch (error) {
        console.error("Error saving fixtures to Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fetch fixtures from Firestore
  const fetchFixtures = async () => {
    setIsLoading(true); // Set loading state while fetching
    try {
      const querySnapshot = await getDocs(collection(db, "match-fixtures"));
      const fetchedFixtures: { fixture: Fixture; id: string }[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.fixture) {
          // Store each fixture with its document ID
          fetchedFixtures.push({ fixture: data.fixture, id: doc.id });
        }
      });

      setFixtures(fetchedFixtures); // Set the fetched fixtures to the state
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  useEffect(() => {
    const updatedGoals = fixtures.map(({ fixture }) => ({
      homeGoals: fixture.home[0]?.homeGoals || "",
      awayGoals: fixture.away[0]?.awayGoals || "",
    }));
    setInputGoals(updatedGoals);
  }, [fixtures]);

  const handleHomeGoalsChange = (index: number, value: number) => {
    setInputGoals((prevInputGoals) =>
      prevInputGoals.map((goal, i) =>
        i === index ? { ...goal, homeGoals: value } : goal
      )
    );
  };

  const handleAwayGoalsChange = (index: number, value: number) => {
    setInputGoals((prevInputGoals) =>
      prevInputGoals.map((goal, i) =>
        i === index ? { ...goal, awayGoals: value } : goal
      )
    );
  };

  const updateGoals = async (matchIndex: number) => {
    const { id, fixture } = fixtures[matchIndex];

    const updatedMatch: Fixture = {
      home: [
        {
          homeGoals: inputGoals[matchIndex]?.homeGoals || 0,
          team: fixture.home[0].team,
        },
      ],
      away: [
        {
          awayGoals: inputGoals[matchIndex]?.awayGoals || 0,
          team: fixture.away[0].team,
        },
      ],
    };

    try {
      const fixtureDoc = doc(db, "match-fixtures", id); // Use the document ID
      await updateDoc(fixtureDoc, {
        fixture: updatedMatch, // Update only the fixture data
      });

      console.log(
        `Updated match ${matchIndex + 1} scores: Home ${
          updatedMatch.home[0].homeGoals
        }, Away ${updatedMatch.away[0].awayGoals}`
      );
      // Update local state after successful Firestore update
      setFixtures((prev) => {
        const newFixtures = [...prev];
        newFixtures[matchIndex] = { id, fixture: updatedMatch }; // Replace the updated match in local state
        return newFixtures;
      });
    } catch (error) {
      console.error("Error updating fixture:", error);
    }
  };

  useEffect(() => {
    const filteredFixtures = fixtures.filter(
      ({ fixture }) =>
        fixture.away[0].team.name
          .toLowerCase()
          .includes(searchName.toLowerCase()) ||
        fixture.home[0].team.name
          .toLowerCase()
          .includes(searchName.toLowerCase())
    );
    setUserFixtures(filteredFixtures); // Set the filtered fixtures to state
  }, [fixtures, searchName]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col justify-center items-center gap-5 px-5 py-10 mb-20">
        {userFixtures.length > 0 ? (
          <>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-xl">Fixtures/ Update scores</h3>
              <Input
                type="text"
                placeholder="Search by user name"
                value={searchName}
                className="bg-transparent border-gray-600"
               
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {userFixtures.map((fixtureData, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center gap-5"
              >
                <div className="flex justify-center items-center gap-5">
                  <div className="flex flex-col justify-center items-center gap-3">
                    <h3 className="">
                      {fixtureData.fixture.home[0].team.name}
                    </h3>
                    {fixtureData.fixture.home[0].team.logo ? (
                      <div className="h-[50px] w-[50px]">
                        <Image
                          src={fixtureData.fixture.home[0].team.logo}
                          alt="logo image"
                          className="rounded-full object-contain"
                          width={500}
                          height={500}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-300 w-[50px] flex justify-center items-center rounded-md h-[50px]">
                        <User className="text-[50px]" />
                      </div>
                    )}
                    <Input
                      type="text"
                       placeholder="Home score"
                      className="bg-transparent border-gray-600"
                      value={
                        inputGoals[index]?.homeGoals !== undefined
                          ? inputGoals[index].homeGoals
                          : ""
                      }
                      onChange={(e) =>
                        handleHomeGoalsChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                  vs
                  <div className="flex flex-col justify-center items-center gap-3">
                    <h3 className="">
                      {fixtureData.fixture.away[0].team.name}
                    </h3>
                    {fixtureData.fixture.away[0].team.logo ? (
                      <div className="h-[50px] w-[50px]">
                        <Image
                          src={fixtureData.fixture.away[0].team.logo}
                          alt="logo image"
                          className="rounded-full object-contain"
                          width={500}
                          height={500}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-300 w-[50px] flex justify-center items-center rounded-md h-[50px]">
                        <User className="text-[50px]" />
                      </div>
                    )}
                    <Input
                      type="text"
                      placeholder="Away score"
                      className="bg-transparent border-gray-600"
                      value={
                        inputGoals[index]?.awayGoals !== undefined
                          ? inputGoals[index].awayGoals
                          : ""
                      }
                      onChange={(e) =>
                        handleAwayGoalsChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <Button onClick={() => updateGoals(index)}>Update</Button>
              </div>
            ))}
          </>
        ) : (
          <Button onClick={startMatchFixture} className="btn-grad px-3">
            Start Fixtures
          </Button>
        )}
      </div>
    </>
  );
};

export default Page;
