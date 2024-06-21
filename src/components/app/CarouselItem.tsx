"use client"
import { useEffect, useState } from "react";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";

interface TrainingSession {
  date: string;
  type: string;
  training_name: string;
  subtype: string;
  completion: boolean;
  length: number;
  length_unit: string;
}

const getFormattedDate = (date: Date): string => date.toISOString().split("T")[0];

const getDisplayDate = (date: Date): string => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const monthName = monthNames[date.getMonth()];

  const getOrdinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"],
          v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${dayName} (${getOrdinalSuffix(day)} of ${monthName})`;
};

const getSessionsForDate = (sessions: TrainingSession[], dateStr: string): TrainingSession[] => {
  return sessions.filter((session) => session.date === dateStr);
};

const CarouselItems: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  useEffect(() => {
    // This would be replaced by a trpc call in the future
    const fetchData = async () => {
      // Mocking an API call with the JSON data
      const data = trainingData.training_sessions; // Make sure trainingData is defined or imported
      setSessions(data);
    };

    fetchData();
  }, []);

  const today = new Date();

  const generateDates = (daysBack: number, daysForward: number): Date[] => {
    const dates = [];
    for (let i = -daysBack; i <= daysForward; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates(5, 5);

  const renderSessions = (sessions: TrainingSession[]) => {
    return sessions.map((session, index) => (
      <div key={index} className="mb-4">
        <div className="text-xl font-semibold">{session.training_name}</div>
        <div className="text-sm">
          {session.type} - {session.subtype}
        </div>
        <div className="text-sm">
          Length: {session.length} {session.length_unit}
        </div>
        <Badge variant="outline" className="text-xs">
          {session.completion ? "Completed" : "Not Completed"}
        </Badge>
      </div>
    ));
  };

  const renderEmptyState = () => (
    <div className="text-center">
      <a href="#" className="underline text-blue-600">Schedule a training</a>
    </div>
  );

  return (
    <Carousel className="w-full  overflow-hidden relative"
    opts={{
        startIndex:4,
    }}>
      <CarouselContent className="flex w-full px-12 -ml-2 md:-ml-4 ">
        {dates.map((date, index) => {
          const dateStr = getFormattedDate(date);
          const displayDate = date.toDateString() === today.toDateString()
            ? "Today"
            : date.toDateString() === new Date(today.getTime() - 86400000).toDateString()
            ? "Yesterday"
            : date.toDateString() === new Date(today.getTime() + 86400000).toDateString()
            ? "Tomorrow"
            : getDisplayDate(date);
          
          const dailySessions = getSessionsForDate(sessions, dateStr);

          return (
            <CarouselItem className="pl-10 md:basis-1/2 lg:basis-1/3" key={index}>
              <Card className="min-w-[250px]">
                <CardHeader>
                  <CardTitle>{displayDate}</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailySessions.length > 0 ? (
                    renderSessions(dailySessions)
                  ) : (
                    renderEmptyState()
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
      <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
    </Carousel>
  );
};

export default CarouselItems;
