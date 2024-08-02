"use client"
import React from "react";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import ScheduleSession from "./ScheduleSessions";
import { api as trpc } from "~/trpc/react"  

import type { TrainingSession, Template } from "@prisma/client"

type SessionWithTemplate = TrainingSession & {
  template: Template | null;
}

interface SessionsProps extends Omit<TrainingSession, 'template'> {
  template: Pick<Template, 'name'>;
}

const getFormattedDate = (date: Date): string => date.toISOString().split("T")[0]!;

const getDisplayDate = (date: Date): string => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const monthName = monthNames[date.getMonth()];

  const getOrdinalSuffix = (n: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]!)
  };

  return `${dayName} (${getOrdinalSuffix(day)} of ${monthName})`;
};

const CarouselItems: React.FC = () => {
  const getAllSessions = trpc.session.getAll.useQuery();
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

  const renderSessions = (sessions: SessionsProps[]) => {
    return sessions.map((session) => (
      <div key={session.id} className="mb-4">
        <div className="text-xl font-semibold">{session.template.name}</div>
        <div className="text-sm">
          Duration: {Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))} minutes
        </div>
        <Badge variant="outline" className="text-xs">
          {session.completed ? "Completed" : "Not Completed"}
        </Badge>
      </div>
    ));
  };

  const renderEmptyState = (date: Date) => (
    <div className="text-center">
      <ScheduleSession  />
    </div>
  );

  return (
    <Carousel className="w-full overflow-hidden relative" opts={{ startIndex: 4 }}>
      <CarouselContent className="flex w-full px-12 -ml-2 md:-ml-4">
        {dates.map((date, index) => {
          const dateStr = getFormattedDate(date);
          const displayDate = date.toDateString() === today.toDateString()
            ? "Today"
            : date.toDateString() === new Date(today.getTime() - 86400000).toDateString()
            ? "Yesterday"
            : date.toDateString() === new Date(today.getTime() + 86400000).toDateString()
            ? "Tomorrow"
            : getDisplayDate(date);
          
          const dailySessions = getAllSessions.data
            ?.filter((session): session is SessionWithTemplate => 
              getFormattedDate(session.startTime) === dateStr && session.template !== null)
            .map((session): SessionsProps => ({
              ...session,
              template: { name: session.template!.name }
            }));

          return (
            <CarouselItem className="pl-10 md:basis-1/2 lg:basis-1/3" key={index}>
              <Card className="min-w-[250px]">
                <CardHeader>
                  <CardTitle>{displayDate}</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailySessions && dailySessions.length > 0 ? (
                    renderSessions(dailySessions)
                  ) : (
                    renderEmptyState(date)
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