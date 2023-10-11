"use client";
import { useGlobalContext } from "@/context/GeneralContext";
import fetchProject from "@/helpers/fetchProject";
import { redirectToLogin } from "@/helpers/redirect";
import React, { useEffect, useState } from "react";
import Project from "@/interfaces/project";
import generateDates from "@/utilis/generateDates";

const page = ({ params }: { params: { projectId: string } }) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const fourMonths = generateDatesForFourMonths(currentYear, currentMonth);
  const [months, setMonths] = useState(fourMonths);
  const { setActiveProject, activeProject } = useGlobalContext();

  useEffect(() => {
    const fetchProjectFunc = async () => {
      const response = await fetchProject(params.projectId);
      if (!response) {
      } else {
        const { data, status } = response;
        await redirectToLogin(status, data?.error);
        // console.log(data);
        setActiveProject(data);
        localStorage.setItem(params.projectId, JSON.stringify(data));
      }
    };
    const getProject = async () => {
      if (activeProject) return;
      const stringData = localStorage.getItem(params.projectId);
      const project: Project = stringData ? JSON.parse(stringData) : undefined;

      if (project?._id) {
        setActiveProject(project);
      } else {
        await fetchProjectFunc();
      }
    };
    const syncProject = async () => {
      if (activeProject?._id) {
        await fetchProjectFunc();
      }
    };
    const resolveFuncSync = async () => {
      await Promise.all([getProject(), syncProject()]);
    };
    resolveFuncSync();
  }, []);

  function generateDatesForFourMonths(year: number, month: number) {
    let currentYear = year;
    let currentMonth = month;
    const dates = [];
    const numberOfMonths = 4;
    const invalidMonthPrev = currentMonth - 1 < 0;
    const prevMonth = {
      name: invalidMonthPrev ? monthNames[11] : monthNames[currentMonth - 1],
      year: invalidMonthPrev ? currentYear-- : currentYear,
      dates: invalidMonthPrev
        ? generateDates(currentYear--, 11)
        : generateDates(currentYear, currentMonth),
    };

    dates.push(prevMonth);
    for (let i = 0; i < numberOfMonths; i++) {
      const inValidMonthCurrent = currentMonth > 11;
      const nextYear = currentYear + 1;
      const month = {
        name: inValidMonthCurrent ? monthNames[0] : monthNames[currentMonth],
        year: inValidMonthCurrent ? nextYear : currentYear,
        dates: inValidMonthCurrent
          ? generateDates(nextYear, 0)
          : generateDates(currentYear, currentMonth),
      };
      dates.push(month);
      if (inValidMonthCurrent) {
        // reset
        currentYear++;
        currentMonth = 0;
      }
      currentMonth++;
    }

    return dates;
  }

  const getPrevMonthDays = (year: number, month: number) => {
    if (month === 0) {
      return {
        name: monthNames[11],
        year: year - 1,
        dates: generateDates(year - 1, 11),
      };
    } else {
      return {
        name: monthNames[month - 1],
        year,
        dates: generateDates(year, month - 1),
      };
    }
  };

  const getNextMonthDays = (year: number, month: number) => {
    if (month === 11) {
      return {
        name: monthNames[0],
        year: year + 1,
        dates: generateDates(year + 1, 0),
      };
    } else {
      return {
        name: monthNames[month + 1],
        year,
        dates: generateDates(year, month + 1),
      };
    }
  };
  const handleAddToLeft = () => {
    const firstMonth = months[0];
    const yearOfFirstMonth = firstMonth.year;
    const monthOfFirstMonth = monthNames.findIndex(
      (monthName) => firstMonth.name === monthName
    );

    const prevMonth = getPrevMonthDays(yearOfFirstMonth, monthOfFirstMonth);
    setMonths([prevMonth, ...months]);
    console.log(months);
  };
  const handleAddToRight = () => {
    const lastMonth = months[months.length - 1];
    const yearOfFirstMonth = lastMonth.year;
    const monthOfFirstMonth = monthNames.findIndex(
      (monthName) => lastMonth.name === monthName
    );

    const nextMonth = getNextMonthDays(yearOfFirstMonth, monthOfFirstMonth);
    setMonths([...months, nextMonth]);
    console.log(months);
  };

  return (
    <div>
      <nav className="flex justify-between items-center py-2 text-sm  border-t border-border-default">
        <div> add task</div>
      </nav>
      <h1>what to do</h1>
      <ol>
        <li>initaillty render three or four months </li>
        <li>add horizontal infinity scroll</li>
        <li>
          dont make custom components for diff time views "months, weeks, years"{" "}
        </li>
        <li>
          render all tasks in col from the header down like having long
          veritical bars{" "}
        </li>
      </ol>
      <div className=" border-t border-border-default">
        <header className="flex">
          {months.map((month) => (
            <div className="flex">
              {" "}
              <div>
                {month.name} {month.year}
              </div>
              {month.dates.map((day) => (
                <div>{day.getDay()}</div>
              ))}
            </div>
          ))}
        </header>
      </div>
    </div>
  );
};

export default page;
