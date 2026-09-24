import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import Login from './pages/Login';
import ShippingLabels from './pages/ShippingLabels';
import { useAuth } from './context/AuthContext';
import NewShippingLabel from './pages/NewShippingLabel';
import Register from './pages/Register';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({
    children,
}: Readonly<ProtectedRouteProps>) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/shipping-labels"
                element={
                    <ProtectedRoute>
                        <ShippingLabels />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to="/shipping-labels"
                        replace
                    />
                }
            />

            <Route
              path="/shipping-labels/new"
              element={
                  <ProtectedRoute>
                      <NewShippingLabel />
                  </ProtectedRoute>
              }
            />

            <Route
                path="/register"
                element={<Register />}
            />
        </Routes>
    );
}