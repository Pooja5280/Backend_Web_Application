import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            login(res.data);
            toast.success('Login Successful!');
            if (res.data.role === 'admin') navigate('/dashboard');
            else navigate('/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                {/* X Logo Placeholder */}
                <div style={{ fontSize: '1.7rem', color: 'white', marginBottom: '2rem', fontWeight: 'bold' }}>Join Today,</div>
                
                <h2>Sign in</h2>
                
                <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
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
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {/* Primary White Button */}
                    <button type="submit" className="btn-primary">
                        Next
                    </button>
                </form>

                <p style={{ marginTop: '40px', fontSize: '15px', color: '#71767b' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#1d9bf0', textDecoration: 'none' }}>Sign up</Link>
                </p>

                {/* --- NEW: Contact Support Link --- */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #2f3336', paddingTop: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#71767b', fontSize: '14px', margin: 0 }}>
                        Forgot password? <br />
                        <a 
    href="https://mail.google.com/mail/?view=cm&fs=1&to=poojajr2508@gmail.com&su=Account%20Assistance%20Request"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: '#1d9bf0', textDecoration: 'none', fontWeight: 'bold' }}
>
    Contact Support
</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;