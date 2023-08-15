"use client";
import axios from "axios";
import React, {  useEffect } from "react";
import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";
import MainSkeleton from "./MainSkeleton";
const App = () => {
  useEffect(() => {
    const fetchStuff = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/workspace/64d7e394b65c43d08e34220f"
        );
        const data = res.data;
        console.log(data);
      } catch (err) {
        console.error("error fetching data " + err);
      }
    };
    fetchStuff();
  }, []);

  return (
    <div className="">
      <MainSkeleton >
        <div className="w-10 h-10 ml-10 mt-10  bg-primary">  
          this is a card
        </div>
      </MainSkeleton>
    </div>
  );
};

export default App;
