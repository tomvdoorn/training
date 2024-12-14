"use client";

import CalendarDayDropComponent from "./CalendarDaysDropComponent";
import CalendarEvent from "./CalendarEvents";


interface Session {
  id: number;
  templateId: number | null;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  template: {
    name: string;
  } | null;
}

interface CalendarItemProps {
  key: number;
  dateObj: { date: number; currentMonth: boolean };
  isToday: boolean;
  eventsForDate: Session[];
}

export default function CalendarDay({ key, dateObj, isToday, eventsForDate }: CalendarItemProps) {
  return (
    <CalendarDayDropComponent dateObj={dateObj} key={key} >
      <div className="relative col-span-1 h-50 w-50 border-b border-r border-gray-200 bg-brand-dark/90 dark:border-gray-700 last:border-b-0 last:border-r-0 sm:border-b-0 sm:border-r">
        <div className={`p-4 ${isToday ? 'text-red-500' : ''} ${dateObj.currentMonth ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
          <div className={`text-lg font-semibold `}>
            {dateObj.date}
          </div>
        </div>
        {eventsForDate.map(session => (
          <CalendarEvent key={session.id} event={session} />
        ))}
        {eventsForDate.length === 0 && <div className="text-gray-400 dark:text-gray-600 items-center p-4 ">Rest day</div>}
      </div>
    </CalendarDayDropComponent>
  );
}