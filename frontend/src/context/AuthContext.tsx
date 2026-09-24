import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';
import api from '../api/api';
import type { LoginResponse, User } from '../types/auth';

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    });

    const login = async (
        email: string,
        password: string
    ): Promise<void> => {
        const response = await api.post<LoginResponse>('/login', {
            email,
            password,
        });

        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider'
        );
    }

    return context;
}