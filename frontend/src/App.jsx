import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Placeholder Pages (We will create these next)
const Login = () => <div><h1>Login Page</h1></div>;
const Signup = () => <div><h1>Signup Page</h1></div>;
const Dashboard = () => <div><h1>Admin Dashboard</h1></div>;
const Profile = () => <div><h1>User Profile</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes (Logged in Users) */}
            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Only Route */}
            <Route element={<PrivateRoute adminOnly={true} />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;