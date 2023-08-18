import Link from "next/link";
import React from "react";
import { AiOutlineGoogle } from "react-icons/ai";
const login = () => {
  return (
    <div className="flex flex-col justify-center items-center text-white h-[calc(100vh-0px)]">
      <h1 className="text-2xl font-semibold mb-4">Log into TeamSync</h1>
      <div className="flex flex-col justify-center items-center space-y-4">
        <button
          className="flex items-center justify-center rounded-md text-sm font-medium 
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
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-xs font-medium leading-none text-start peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email address
          </label>
          <input
            type="text"
            id="email"
            className="h-9 w-full rounded-md border border-border-default bg-transparent px-3 py-1 
        text-sm shadow-sm transition-colors placeholder-gray-400 focus:outline-none 
        focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="example@gmail.com"
          />
        </div>
        <button
          className=" accent-color w-full inline-flex items-center justify-center rounded-md text-sm font-medium 
        transition-colors focus:outline-none disabled:pointer-events-none
        disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Continue
        </button>
      </div>
      <p className="text-gray-300 mt-4 text-sm">
        Don't have an account? <Link href="/signup" className="text-blue-200 hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default login;
