import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ adminOnly }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;