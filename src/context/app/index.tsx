import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    Dispatch,
    useEffect,
} from 'react';
import { AuthorizationStatus } from '@/const';
import {AuthStatus} from "@/types";
import { useCurrent } from '@/api/auth/use-current';

export type AuthState = {
    status: AuthStatus;
    user: string | null;
};

export type AuthAction =
    | { type: 'SET_AUTH'; payload: { user: string } }
    | { type: 'SET_NO_AUTH' }
    | { type: 'SET_UNKNOWN' };

const initialState: AuthState = {
    status: AuthorizationStatus.Unknown,
    user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_AUTH':
            return { ...state, status: AuthorizationStatus.Auth, user: action.payload.user };
        case 'SET_NO_AUTH':
            return { ...state, status: AuthorizationStatus.NoAuth, user: null };
        case 'SET_UNKNOWN':
            return { ...state, status: AuthorizationStatus.Unknown };
        default:
            return state;
    }
};

type AuthContextType = {
    state: AuthState;
    dispatch: Dispatch<AuthAction>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { data: user, isError } = useCurrent();

    useEffect(() => {
        if (isError) {
            dispatch({ type: 'SET_NO_AUTH' });
            return;
        }

        if (user) {
            dispatch({ type: 'SET_AUTH', payload: { user: user } });
        }
    }, [user, isError]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
