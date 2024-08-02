"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import  CalendarDay  from "@/components/app/calendar/CalendarDays";
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const events = [
    {
        id: 1001,
        name: "Meeting with team",
        startDate: "2024-06-03",
        endDate: "2024-06-03",
        attendees: ["John", "Jane", "Alice"],
        status: "completed",
    },
    {
        id: 1,
        name: "Meeting with team two",
        startDate: "2024-06-03",
        endDate: "2024-06-03",
        attendees: ["John", "Jane", "Alice"],
        status: "completed",
    },
    {
        id: 2,
        name: "Project deadline",
        startDate: "2024-06-10",
        endDate: "2024-06-10",
        attendees: ["Team A"],
        status: "failed",
    },
    {
        id: 3,
        name: "Conference",
        startDate: "2024-06-15",
        endDate: "2024-06-17",
        attendees: ["John", "Alice"],
        status: "completed",
    },
    {
        id: 4,
        name: "Client call",
        startDate: "2024-06-20",
        endDate: "2024-06-20",
        attendees: ["Jane"],
        status: "completed",
    },
];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

function getEventsForDate(date: number, month: number, year: number) {
  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
  return events.filter(event => event.startDate <= dateString && event.endDate >= dateString);
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonthDays = getDaysInMonth(currentMonth - 1, currentYear);
  const dates = [];

  // Fill in previous month's dates
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push({
      date: prevMonthDays - firstDayOfMonth + i + 1,
      currentMonth: false
    });
  }

  // Fill in current month's dates
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      date: i,
      currentMonth: true
    });
  }

  // Fill in next month's dates
  const nextMonthDayCount = 42 - dates.length;  // Ensure 6 weeks display
  for (let i = 1; i <= nextMonthDayCount; i++) {
    dates.push({
      date: i,
      currentMonth: false
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full">
        <div className="flex flex-col items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 w-full">
          <div className="flex items-center gap-4 w-full">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold flex-1 text-center">
              {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4 w-full mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 p-6">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 sm:border-b-0 sm:border-r hidden sm:block">
              {day}
            </div>
          ))}
          {dates.map((dateObj, index) => {
            const eventsForDate = getEventsForDate(dateObj.date, currentMonth, currentYear);
            const isToday = 
              dateObj.date === today.getDate() &&
              dateObj.currentMonth &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (              
            <CalendarDay 
                key={index} 
                dateObj={dateObj} 
                isToday={isToday} 
                eventsForDate={eventsForDate} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
