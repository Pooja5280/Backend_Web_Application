import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Context & Components
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Import your file

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Default Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* --- PROTECTED ROUTES (User) --- */}
          {/* This wrapper checks if user is logged in. If yes, it renders the child route via <Outlet /> */}
          <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
          </Route>

          {/* --- PROTECTED ROUTES (Admin) --- */}
          {/* This wrapper checks if user is logged in AND is admin */}
          <Route element={<PrivateRoute adminOnly={true} />}>
              <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;