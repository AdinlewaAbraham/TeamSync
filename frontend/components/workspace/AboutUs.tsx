import React from "react";

const AboutUs = () => {
  return (
    <div className="w-full rounded-lg border border-border-default bg-bg-primary p-4">
      <header className="pb-4">
        <h2 className="text-xl font-medium">About us</h2>
      </header>
      <div>
        <input
          type="text"
          className="min-h-[40px] w-full rounded-lg border border-transparent bg-transparent
          p-0.5 hover:border-border-default focus:border-border-default focus:outline-none
         focus:ring-0 focus:ring-white text-sm
         "
          placeholder="Click to add team description..."
        />
      </div>
    </div>
  );
};

export default AboutUs;
