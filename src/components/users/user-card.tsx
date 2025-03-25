import { Link } from "react-router-dom";
import { UserDto } from "@/api/users";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: UserDto;
}

export function UserCard({ user }: UserCardProps) {
  const getRoleBadgeStyles = (role: string) => {
    switch(role) {
      case 'admin':
        return "bg-red-100 text-red-800";
      case 'manager':
        return "bg-purple-100 text-purple-800";
      case 'developer':
        return "bg-blue-100 text-blue-800";
      case 'tester':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin':
        return "Администратор";
      case 'manager':
        return "Менеджер";
      case 'developer':
        return "Разработчик";
      case 'tester':
        return "Тестировщик";
      case 'viewer':
        return "Наблюдатель";
      default:
        return role;
    }
  };
  
  return (
    <Link to={`/users/${user.id}`} className="block">
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{user.name}</h3>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span 
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              getRoleBadgeStyles(user.role)
            )}
          >
            {getRoleLabel(user.role)}
          </span>
          <span className="text-xs text-slate-500">
            С {formatDate(new Date(user.createdAt))}
          </span>
        </div>
      </div>
    </Link>
  );
} 