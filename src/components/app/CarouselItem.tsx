"use client"
import React, { useState } from "react";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import ScheduleSession from "./ScheduleSessions";
import { api as trpc } from "~/trpc/react"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

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
  const deleteSessionMutation = trpc.session.deleteSession.useMutation();
  const deletePostMutation = trpc.post.deletePost.useMutation();
  const { toast } = useToast();
  const today = new Date();
  const [sessionToDelete, setSessionToDelete] = useState<SessionsProps | null>(null);

  const handleDeleteClick = (session: SessionsProps) => {
    setSessionToDelete(session);
  };

  const handleDeleteConfirm = async () => {
    if (sessionToDelete) {
      try {
        await deleteSessionMutation.mutateAsync({ id: sessionToDelete.id });
        if (sessionToDelete.completed) {
          await deletePostMutation.mutateAsync({ trainingSessionId: sessionToDelete.id });
        }
        toast({
          title: "Success",
          description: "Workout deleted successfully.",
        });
        await getAllSessions.refetch();
      } catch (error) {
        console.error('Failed to delete session:', error);
        toast({
          title: "Error",
          description: "Failed to delete workout. Please try again.",
          variant: "destructive",
        });
      }
      setSessionToDelete(null);
    }
  };

  const renderSessions = (sessions: SessionsProps[], showAll = false) => {
    const sortedSessions = sortSessions(sessions);
    const displaySessions = showAll ? sortedSessions : sortedSessions.slice(0, 3);
    const now = new Date();

    return (
      <>
        {displaySessions.map((session) => {
          const isPastDue = session.startTime < now && !session.completed;
          const badgeVariant = session.completed ? "success" : (isPastDue ? "destructive" : "outline");

          return (
            <div key={session.id} className={cn(
              "mb-4 relative p-3 rounded-md",
              session.completed ? "border-green-500 bg-green-500/10" : (isPastDue ? "border-red-500 bg-red-500/10" : "border-gray-700 bg-gray-800/50"),
              "border"
            )}>
              <div className="text-xl font-semibold text-brand-light">
                {session.template.name}
              </div>
              <div className="text-sm text-gray-400">
                Time: {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-400">
                Duration: {Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))} minutes
              </div>
              <Badge variant={badgeVariant} className={cn(
                "text-xs",
                isPastDue && "text-white"
              )}>
                {session.completed ? "Completed" : (isPastDue ? "Past Due" : "Upcoming")}
              </Badge>
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {!session.completed && (
                  <Link href={`/app/workouts/start/${session.templateId}`} passHref>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Start Workout"
                      className="bg-brand-gradient-r border-gray-700 text-brand-light hover:bg-gray-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  title="Delete Workout"
                  onClick={() => handleDeleteClick(session)}
                  className="border-gray-700 bg-brand-dark/90 text-brand-light hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

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

  const sortSessions = (sessions: SessionsProps[]): SessionsProps[] => {
    return sessions.sort((a, b) => {
      // Sort completed sessions to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by start time
      return a.startTime.getTime() - b.startTime.getTime();
    });
  };

  const renderShowAllButton = (sessions: SessionsProps[], date: Date) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          Show All ({sessions.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDisplayDate(date)} - All Sessions</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {renderSessions(sessions, true)}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderEmptyState = (date: Date) => (
    <div className="text-center">
      <ScheduleSession />
    </div>
  );

  return (
    <>
      <Carousel className="w-full overflow-hidden relative" opts={{ startIndex: 4, breakpoints: { '(max-width: 1024px)': { startIndex: 5 } } }}>
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
              <CarouselItem className="pl-1 md:pl-2 md:basis-1/1 lg:basis-1/3" key={index}>
                <Card className="min-w-[250px] bg-gray-800 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-brand-light">{displayDate}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dailySessions && dailySessions.length > 0 ? (
                      <>
                        {renderSessions(dailySessions)}
                        {dailySessions.length > 3 && renderShowAllButton(dailySessions, date)}
                      </>
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
      <DeleteConfirmationModal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isCompleted={sessionToDelete?.completed ?? false}
      />
    </>
  );
};

export default CarouselItems;
