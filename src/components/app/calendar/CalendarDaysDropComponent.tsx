"use client";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react"; 
import { cn } from "@/lib/utils";
import React from "react";
import type  { FC } from "react";

interface DayInCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  dateObj: { date: number; currentMonth: boolean };
  children: React.ReactNode;
}

const CalendarDayDropComponent: FC<DayInCalendarProps> = ({
  dateObj,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = ref.current!;

    return dropTargetForElements({
      element,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    });

  }, []);



  return (
    <div
      className={cn("", isOver ? "bg-green-300" : "bg-background")}
      ref={ref}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
};

export default CalendarDayDropComponent;
