import { Navigate } from 'react-router-dom';
import {Spinner} from "@/components/main/spinner";
import {AppRoute, AuthStatus} from "@/types";
import {useAuthContext} from "@/context/app";
import {AuthorizationStatus} from "@/const.ts";
import { ReactElement } from 'react';

type PrivateRouteProps = {
    restrictedFor: AuthStatus;
    redirectTo: AppRoute;
    children: ReactElement;
}

export const PrivateRoute = ({ children, restrictedFor, redirectTo }: PrivateRouteProps) => {
    const { state } = useAuthContext();
    const { status } = state;

    if (status === AuthorizationStatus.Unknown) {
        return <Spinner />;
    }

    return status !== restrictedFor ? children : <Navigate to={redirectTo} />;
}
