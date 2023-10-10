import React from "react";

const page = () => {
  return (
    <div>
      <nav className="flex justify-between items-center py-2 text-sm  border-t border-border-default">
        <div> add task</div>
      </nav>
      <h1>what to do</h1>
      <ol>
        <li>initaillty render three or four months </li>
        <li>add horizontal infinity scroll</li>
        <li>dont make custom components for diff time views "months, weeks, years" </li>
        <li>render all tasks in col from the header down like having long veritical bars  </li>
      </ol>
      <div className=" border-t border-border-default"></div>
    </div>
  );
};

export default page;
