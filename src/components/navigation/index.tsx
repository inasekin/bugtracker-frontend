import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill, GoProject, GoGear } from "react-icons/go";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

interface RouteItem {
    label: string;
    href: string;
    icon: IconType;
    activeIcon: IconType;
}

const routes: RouteItem[] = [
    {
        label: "Главная",
        href: "/",
        icon: GoHome,
        activeIcon: GoHomeFill,
    },
    {
        label: "Мои задачи",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label: "Проекты",
        href: "/projects",
        icon: GoProject,
        activeIcon: GoProject,
    },
    {
        label: "Настройки",
        href: "/settings",
        icon: GoGear,
        activeIcon: GoGear,
    },
];

export const Navigation: React.FC = () => {
    const { pathname } = useLocation();

    return (
        <ul className="flex flex-col">
            {routes.map(({ activeIcon, href, icon, label }) => {
                const isActive = pathname === href;
                const Icon = isActive ? activeIcon : icon;
                return (
                    <li key={href}>
                        <Link to={href}>
                            <div
                                className={cn(
                                    "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                                    isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                                )}
                            >
                                <Icon className="size-5 text-neutral-500" />
                                {label}
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
