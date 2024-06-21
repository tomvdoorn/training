"use client";

import CalendarDayDropComponent from "./CalendarDaysDropComponent";
import CalendarEvent from "./CalendarEvents";

interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  attendees: string[];
  status?: string;
}


interface CalendarItemProps {
  key: number;
  dateObj: { date: number; currentMonth: boolean };
  isToday: boolean;
  eventsForDate: Event[];
}

export default function CalendarDay({key, dateObj, isToday, eventsForDate }: CalendarItemProps) {

  return (
    <CalendarDayDropComponent dateObj={dateObj} key={key} >

    <div  className="relative col-span-1 h-50 w-50 border-b border-r border-gray-200 dark:border-gray-700 last:border-b-0 last:border-r-0 sm:border-b-0 sm:border-r">
      <div className={`p-4 ${isToday ? 'text-red-500' : ''} ${dateObj.currentMonth ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
        <div className={`text-lg font-semibold `}>
            {dateObj.date}
        </div>
      </div>
      {eventsForDate.map(event => (
        <CalendarEvent key={event.id} event={event} />
      ))}
      {eventsForDate.length===0 && <div className="text-gray-400 dark:text-gray-600 items-center p-4 ">Rest day</div>}
    </div>
    </CalendarDayDropComponent>


  );
}

function SpaceIcon(props: any) {
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
