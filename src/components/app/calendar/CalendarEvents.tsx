import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { IconProps } from "@radix-ui/react-icons/dist/types";
import { useEffect, useRef, useState } from "react";

interface Session {
  id: number;
  templateId: number| null;
  startTime: Date;
  endTime: Date;
  template: {
    name: string;
  }| null;
}

interface CalendarEventProps {
  event: Session;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ event }) => {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      console.error("Ref is not assigned to an element");
      return;
    }

    const draggableOptions = {
      element,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    };

    try {
      return draggable(draggableOptions);
    } catch (error) {
      console.error("Error initializing draggable", error);
    }
  }, []);

  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  return (
    <div
      ref={ref}
      className={cn("mt-2 mr-4 bg-primary/10 dark:bg-primary/20 rounded-lg p-2", {
        "cursor-grabbing bg-muted opacity-50": dragging,
      })}
      draggable={true}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-primary">
          <SpaceIcon className="w-4 h-4 mr-2 inline" />
          {event.template?.name ? event.template.name : 'New workout'}
        </div>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
        {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <Badge
        variant="outline"
        className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      >
        Training Session
      </Badge>
    </div>
  );
};

function SpaceIcon(props: IconProps) {
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
  );
}

export default CalendarEvent;