export default function SchedulePage() {
    return (
      <div>
        <h1>Schedule</h1>
      </div>
    )
  }
  

//  /* infinite scroll attempt
//  doesn't scroll back correctly and doesn't really scroll forward either

//  */ 
// "use client";
// import { useState, useEffect } from 'react';
// import CalendarDay from "@/components/app/calendar/CalendarDays";
// import { Button } from "@/components/ui/button";
// import InfiniteScroll from '@/components/ui/infinite-scroll';
// import { Loader2 } from 'lucide-react';

// const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];



// const WEEKS_TO_SHOW = 4;

// export default function Calendar() {
//   const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
//   const [weeks, setWeeks] = useState<Date[][]>([]);
//   const today = new Date();

//   useEffect(() => {
//     generateWeeks(currentWeekStart);
//   }, [currentWeekStart]);

//   const generateWeeks = (startOfWeek: Date) => {
//     const weeksArray = [];
//     for (let i = 0; i < WEEKS_TO_SHOW; i++) {
//       const weekDates = generateWeekDates(startOfWeek, i);
//       weeksArray.push(weekDates);
//       startOfWeek = new Date(weekDates[6]); // Move to the next week
//       startOfWeek.setDate(startOfWeek.getDate() + 1); // Start of next week
//     }
//     setWeeks(weeksArray);
//   };

//   const generateWeekDates = (startOfWeek: Date, weekOffset: number) => {
//     const weekDates = [];
//     const startDate = new Date(startOfWeek);
//     startDate.setDate(startDate.getDate() + (weekOffset * 7)); // Offset by number of weeks
//     startDate.setHours(0, 0, 0, 0); // Ensure start from beginning of the day

//     for (let i = 0; i < 7; i++) {
//       const currentDate = new Date(startDate);
//       currentDate.setDate(startDate.getDate() + i);
//       weekDates.push(currentDate);
//     }
//     return weekDates;
//   };

//   const handleNextWeek = () => {
//     const newCurrentWeekStart = new Date(currentWeekStart);
//     newCurrentWeekStart.setDate(newCurrentWeekStart.getDate() + 7);
//     setCurrentWeekStart(newCurrentWeekStart);
//   };

//   const handlePrevWeek = () => {
//     const newCurrentWeekStart = new Date(currentWeekStart);
//     newCurrentWeekStart.setDate(newCurrentWeekStart.getDate() - 7);
//     setCurrentWeekStart(newCurrentWeekStart);
//   };

//   const handleToday = () => {
//     setCurrentWeekStart(new Date());
//   };

//   const getEventsForDate = (date: Date) => {
//     const dateString = date.toISOString().split('T')[0];
//     const eventsForDate = events.filter(event => {
//       return event.startDate <= dateString && event.endDate >= dateString;
//     });
//     return eventsForDate;
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
//       <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full">
//         <div className="flex flex-col items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 w-full">
//           <div className="flex items-center gap-4 w-full">
//             <Button variant="ghost" size="icon" onClick={handlePrevWeek}>
//               <ChevronLeftIcon className="w-5 h-5" />
//             </Button>
//             <h2 className="text-xl font-semibold flex-1 text-center">
//               Week of {currentWeekStart.toLocaleString('default', { month: 'long' })} {currentWeekStart.getDate()}, {currentWeekStart.getFullYear()}
//             </h2>
//             <Button variant="ghost" size="icon" onClick={handleNextWeek}>
//               <ChevronRightIcon className="w-5 h-5" />
//             </Button>
//           </div>
//           <div className="flex items-center gap-4 w-full mt-4 sm:mt-0">
//             <Button variant="outline" size="sm" onClick={handleToday}>
//               Today
//             </Button>
//           </div>
//         </div>
//         <InfiniteScroll
//           dataLength={weeks.length} // This is important field to render the next data
//           next={handleNextWeek} // Load next week when scrolling down
//           hasMore={true} // Always true for infinite scroll
//           loader={<h4>Loading...</h4>}
//           endMessage={<p>No more weeks to show</p>}
//           inverse={true} // Enable scrolling up (backwards) through weeks
//           style={{ overflow: 'visible' }} // Ensure scrolling behaves correctly
//         >
//           {weeks.map((weekDates, weekIndex) => (
//             <div key={weekIndex} className="grid grid-cols-7 gap-4 p-6">
//               {daysOfWeek.map((day, index) => (
//                 <div key={index} className="text-center font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 sm:border-b-0 sm:border-r hidden sm:block">
//                   {day}
//                 </div>
//               ))}
//               {weekDates.map((date, dateIndex) => {
//                 const eventsForDate = getEventsForDate(date);
//                 const isToday =
//                   date.getDate() === today.getDate() &&
//                   date.getMonth() === today.getMonth() &&
//                   date.getFullYear() === today.getFullYear();

//                 return (
//                   <CalendarDay
//                     key={dateIndex}
//                     dateObj={{ date: date.getDate(), currentMonth: true }}
//                     isToday={isToday}
//                     eventsForDate={eventsForDate}
//                   />
//                 );
//               })}
//             </div>
//           ))}
//         </InfiniteScroll>
//       </div>
//     </div>
//   );
// }



// function ChevronRightIcon(props: any) {
//     return (
//       <svg
//         {...props}
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="m9 18 6-6-6-6" />
//       </svg>
//     )
//   }
//   function SpaceIcon(props) {
//       return (
//         <svg
//           {...props}
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
//         </svg>
//       )
//   }
//   function ChevronLeftIcon(props: any) {
//     return (
//       <svg
//         {...props}
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="m15 18-6-6 6-6" />
//       </svg>
//     )
//   }