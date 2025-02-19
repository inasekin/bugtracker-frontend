import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
    children?: React.ReactNode;
}

export const AuthLayout = ({children}: AuthLayoutProps) => {
    const { pathname } = useLocation();
    const isSignIn = pathname === "/login";

    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex items-center justify-between">
                    <img src="./src/assets/logo.svg" alt="logo"/>

                    <Button asChild variant="secondary">
                        <Link to={isSignIn ? "/register" : "/login"}>
                            {isSignIn ? "Создать аккаунт" : "Войти"}
                        </Link>
                    </Button>
                </nav>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 md:py-14">
                {children}
            </div>
        </main>
    );
};