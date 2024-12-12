import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: number;
    className?: string;
}

export function StatCard({ title, value, trend, className }: StatCardProps) {
    const getTrendIcon = () => {
        if (!trend) return <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />;
        return trend > 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
        ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
        );
    };

    const getTrendText = () => {
        if (!trend) return "0%";
        const absValue = Math.abs(trend);
        return `${trend > 0 ? "+" : "-"}${absValue}% vs last week`;
    };

    return (
        <div className={cn("space-y-1", className)}>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
                <p className="text-xl font-bold">{value}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon()}
                <span>{getTrendText()}</span>
            </div>
        </div>
    );
} 