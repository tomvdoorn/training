// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Component as AreaChart } from "@/components/ui/areaChart";
// import { Component as BarChart } from "@/components/ui/barChart";
// import { api } from "~/trpc/react";

// const TrainingSummary = ({ userId }: { userId: string }) => {
//   const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('week');

//   const { data: trainingData } = api.training.getSummary.useQuery({ userId, timeFrame });

//   const areaChartData = trainingData?.map(item => ({
//     name: item.date,
//     total: item.duration,
//   })) || [];

//   const barChartData = trainingData?.map(item => ({
//     name: item.date,
//     total: item.calories,
//   })) || [];

//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Training Summary</CardTitle>
//           <CardDescription>View your training data over time</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Select
//             value={timeFrame}
//             onValueChange={(value) => setTimeFrame(value as 'day' | 'week' | 'month')}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select time frame" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="day">Day</SelectItem>
//               <SelectItem value="week">Week</SelectItem>
//               <SelectItem value="month">Month</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Training Duration</CardTitle>
//           <CardDescription>Total minutes spent training</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <AreaChart
//             data={areaChartData}
//             index="name"
//             categories={["total"]}
//             colors={["blue"]}
//             valueFormatter={(value: number) => `${value} min`}
//             className="h-72"
//           />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Calories Burned</CardTitle>
//           <CardDescription>Total calories burned during training</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <BarChart
//             data={barChartData}
//             index="name"
//             categories={["total"]}
//             colors={["orange"]}
//             valueFormatter={(value: number) => `${value} kcal`}
//             className="h-72"
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TrainingSummary;