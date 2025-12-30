import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            const { confirmPassword, ...registerData } = formData;

            // This appends /auth/register to your VITE_API_URL
            await API.post('/auth/register', registerData);
            
            toast.success('Registration Successful! Please log in.');
            navigate('/login');
            
        } catch (error) {
            // Displays specific server error (like "User already exists") or a default message
            toast.error(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div style={{ fontSize: '2rem', color: 'white', marginBottom: '2rem', fontWeight: 'bold' }}>Sign Up</div>
                <h2>Create your account</h2>
                
                <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password (min 6 chars)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ marginBottom: '1.5rem' }}>
                        Sign up
                    </button>
                </form>

                <p style={{ fontSize: '15px', color: '#71767b' }}>
                    Have an account already? <Link to="/login" style={{ color: '#1d9bf0', textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;