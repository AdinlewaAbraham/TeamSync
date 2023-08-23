"use client";

import Link from "next/link";
import React from "react";
import { AiOutlineGoogle } from "react-icons/ai";
const login = () => {
  const authWithGoogle = async () => {
    try {
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, "_self");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center text-white h-[calc(100vh-0px)]">
      <h1 className="text-2xl font-semibold mb-4">Log into TeamSync</h1>
      <div className="flex flex-col justify-center items-center space-y-4 sm:w-[350px] w-[200px]">
        <button
          onClick={authWithGoogle}
          className="w-full whitespace-nowrap flex items-center justify-center rounded-lg text-sm font-medium 
        transition-colors focus:outline-none  
        disabled:pointer-events-none disabled:opacity-50 border border-border-default 
        bg-transparent shadow-sm hover:bg-[#27272a] hover:text-accent-foreground h-9 px-4 py-2"
        >
          <i className="mr-3">
            <AiOutlineGoogle />
          </i>
          Continue with Google
        </button>
        <span className="text-gray-300 text-xs">or</span>
        <div className="w-full grid gap-y-2">
          <label
            htmlFor="email"
            className="block text-xs font-medium leading-none text-start peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email address
          </label>
          <input
            type="text"
            id="email"
            className=" w-full text-input"
            placeholder="example@gmail.com"
          />
        </div>
        <button
          className=" accent-color w-full inline-flex items-center justify-center rounded-lg text-sm font-medium 
        transition-colors focus:outline-none disabled:pointer-events-none
        disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 button-default"
        >
          Continue
        </button>
      </div>
      <p className="text-gray-300 mt-4 text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-200 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default login;
