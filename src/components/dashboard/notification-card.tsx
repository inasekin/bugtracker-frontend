import { cn } from "@/lib/utils";

type NotificationType = 'info' | 'warning' | 'error' | 'success';

type NotificationCardProps = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  onClick?: () => void;
};

export function NotificationCard({
  title,
  message,
  time,
  type,
  read,
  onClick
}: NotificationCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-md border p-3 cursor-pointer transition-all",
        !read && "bg-slate-50 border-l-4",
        !read && type === 'info' && "border-l-blue-500",
        !read && type === 'warning' && "border-l-yellow-500",
        !read && type === 'error' && "border-l-red-500",
        !read && type === 'success' && "border-l-green-500",
        read && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="font-medium text-sm">{title}</h4>
        <span className="text-xs text-slate-500">{time}</span>
      </div>
      <p className="text-sm text-slate-600 line-clamp-2 mb-1">{message}</p>
      <div className="flex justify-end">
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            type === 'info' && "bg-blue-100 text-blue-700",
            type === 'warning' && "bg-yellow-100 text-yellow-700",
            type === 'error' && "bg-red-100 text-red-700",
            type === 'success' && "bg-green-100 text-green-700"
          )}
        >
          {type}
        </span>
      </div>
    </div>
  );
}
