import { months } from "@/constants/calendar";
import { useCalendarStore } from "@/store/calendarStore";
import React from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

type Props = { goToPrevMonth: () => void; goToNextMonth: () => void };
const CalendarControlPanel: React.FC<Props> = ({
  goToPrevMonth,
  goToNextMonth,
}) => {
  const { showWeekend, currentMonth, currentYear, setShowWeekend } =
    useCalendarStore();

  return (
    <nav className="flex items-center justify-between border-y border-border-default px-8 py-2 text-sm">
      <div
        className="flex items-center text-muted-dark 
     [&>i]:flex [&>i]:h-9 [&>i]:w-7
     [&>i]:cursor-pointer [&>i]:items-center [&>i]:justify-center  [&>i]:rounded-lg  [&>i]:text-lg 
    [&>i]:text-muted-dark [&>i]:transition-colors [&>i]:duration-150  hover:[&>i]:bg-menuItem-active hover:[&>i]:text-white   "
      >
        <button
          className="flex h-9 items-center justify-center rounded-lg border border-border-default px-2
      text-xs hover:border-white hover:bg-menuItem-hover hover:text-white"
          onClick={() => {
            const todayElement = document.getElementsByClassName("today");
            if (todayElement[0]) {
              todayElement[0].scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Today
        </button>
        <i className="" onClick={goToPrevMonth}>
          <MdNavigateBefore />
        </i>
        <i onClick={goToNextMonth}>
          <MdNavigateNext />
        </i>
        <div className="text-xl text-white">
          {months[currentMonth]} {currentYear}
        </div>
      </div>
      <div className="flex">
        {/* <button onClick={}> back </button>
    <button onClick={}>forward</button> */}

        {/* <div>month view</div>
    <div>filter</div>
    <div>color</div> */}
        {JSON.stringify(showWeekend)}
        <input
          type="checkbox"
          checked={showWeekend}
          onChange={(e) => setShowWeekend(e.target.checked)}
        />
      </div>
    </nav>
  );
};

export default CalendarControlPanel;
