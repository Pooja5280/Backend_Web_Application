import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';


import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Only Route */}
            <Route element={<PrivateRoute adminOnly={true} />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Default redirect to login if route not found */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;