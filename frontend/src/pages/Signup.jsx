import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import API from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Frontend Validation
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            // We don't send confirmPassword to backend
            const { confirmPassword, ...registerData } = formData;
            
            const res = await API.post('/auth/register', registerData);
            login(res.data);
            toast.success('Registration Successful!');
            
            // Redirect based on role
            if (res.data.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
                    Register
                </button>
            </form>
            <p style={{ marginTop: '10px' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Signup;