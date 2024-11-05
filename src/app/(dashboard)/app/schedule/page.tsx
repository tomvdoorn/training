/* eslint-disable */
"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import CalendarDay from "@/components/app/calendar/CalendarDays";
import { api } from '~/trpc/react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

// Define the type for the API response
interface ApiSession {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  templateId: number | null;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  template: {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

// Define our Session type
interface Session {
  id: number;
  templateId: number| null;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  template: {
    name: string;
  } | null;
}

interface Session_res {
  id: number;
  templateId: number | null;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  template: {
    name: string;
  } | null;
}

interface SessionDate {
  date: number;
  month: number;
  year: number;
  sessions: Session[];
}

// Function to transform ApiSession to Session
function transformSession(apiSession: ApiSession): Session {
  return {
    id: apiSession.id,
    templateId: apiSession.templateId ?? null,
    startTime: apiSession.startTime,
    endTime: apiSession.endTime,
    completed: apiSession.completed,
    template: apiSession.template ? { name: apiSession.template.name } : null,
  };
}

function getSessionsForDate(date: number, month: number, year: number, sessions: Session[]): Session_res[] {
  const startOfDay = new Date(year, month, date);
  const endOfDay = new Date(year, month, date, 23, 59, 59, 999);
  
  return sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= startOfDay && sessionDate <= endOfDay;
  });
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const [userSessions, setUserSessions] = useState<Session[]>([]);

  const { data: sessions, isLoading } = api.session.getAll.useQuery();

  useEffect(() => {
    if (sessions) {
      const transformedSessions = (sessions as ApiSession[]).map(transformSession);
      setUserSessions(transformedSessions);
    }
  }, [sessions]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonthDays = getDaysInMonth(currentMonth - 1, currentYear);
  const dates: Array<{date: number; month: number; year: number; currentMonth: boolean}> = [];

  // Fill in previous month's dates
  for (let i = 0; i < firstDayOfMonth; i++) {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    dates.push({
      date: prevMonthDays - firstDayOfMonth + i + 1,
      month: prevMonth,
      year: prevYear,
      currentMonth: false
    });
  }

  // Fill in current month's dates
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      date: i,
      month: currentMonth,
      year: currentYear,
      currentMonth: true
    });
  }

  // Fill in next month's dates
  const nextMonthDayCount = 42 - dates.length;  // Ensure 6 weeks display
  for (let i = 1; i <= nextMonthDayCount; i++) {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    dates.push({
      date: i,
      month: nextMonth,
      year: nextYear,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            const sessionsForDate = getSessionsForDate(dateObj.date, dateObj.month, dateObj.year, userSessions);
            const isToday = 
              dateObj.date === today.getDate() &&
              dateObj.month === today.getMonth() &&
              dateObj.year === today.getFullYear();

            return (              
              <CalendarDay 
                key={index} 
                dateObj={dateObj} 
                isToday={isToday} 
                eventsForDate={sessionsForDate} 
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