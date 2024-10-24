"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

import gamelogo from "../assets/gamelogo.jpg";
import trophy from "../assets/trophy.png";

// Make sure this import path is correct
import champion from "../assets/champion.jpg";
import Table from "../components/Table";
import Matches from "../components/Matches";
import Overview from "../components/Overview";


import { useRouter } from "next/navigation";
function Page() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Overview", "Table", "Matches"];
// const { setIsAdmin} = useUserContextData()






  return (
    <div>
      {/* Image Section */}
      <div className="relative">
     
        <Image
          src={champion}
          className="w-full h-[40vh] object-cover "
          width={500}
          height={500}
          alt="latest champion"
          priority
        />
       
        <div className="absolute blurred-background -bottom-5 p-3 w-full  flex justify-between ">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 ">
              <Image
                src={gamelogo}
                width={30}
                height={30}
                className="rounded-md"
                alt="user team"
                priority
              />
              <h3 className="font-semibold text-lg">LOLO</h3>
            </div>

            <p className="bg-gray-800 text-sm p-2 rounded-md">
              Latest Champion
            </p>
          </div>
          <div className="bg-gray-200 p-2 rounded-md absolute right-5">
            <Image
              src={trophy}
              width={40}
              height={40}
              className="rounded-md"
              alt="user team"
              priority
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-10 px-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`relative transition-all duration-200 ease-in-out px-4 py-2 text-sm font-medium
        ${
          activeTab === index
            ? "font-semibold text-[#ff9068]"
            : "text-slate-300"
        }
      `}
          >
            {tab}
            {activeTab === index && (
              // Add the after content only for the active tab
              <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff9068] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Select Dropdown for Mobile View */}
      {/* <div className="">
        <Select
          onValueChange={(value) => setActiveTab(Number(value))}
          defaultValue={activeTab.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder={tabs[activeTab]} />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab, index) => (
              <SelectItem key={index} value={index.toString()}>
                {tab}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* Tab Content Section */}
      <div className="mb-20 mt-5">
        {activeTab === 0 && <Overview/>}
        {activeTab === 1 && <Table />}
        {activeTab === 2 && <Matches/>}
        {activeTab === 3 && <div>Recent Content</div>}
      </div>
    </div>
  );
}

export default Page;
