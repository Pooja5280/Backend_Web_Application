import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar'; // <--- 1. Import Navbar

const Profile = () => {
    // We still need 'logout' here for the handleSubmit function (forcing re-login after update)
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            resetForm();
        }
    }, [user]);

    const resetForm = () => {
        setFormData({
            fullName: user?.fullName || '',
            email: user?.email || '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        resetForm();
        toast.info('Changes cancelled');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            const { confirmPassword, ...updateData } = formData;
            if (!updateData.password) delete updateData.password;
            
            await API.put('/users/profile', updateData);
            
            toast.success('Profile Updated! Please log in again.');
            
            // Security: Force logout after profile update
            logout(); 
            navigate('/login');
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    // --- STYLES ---
    const inputStyle = {
        width: '100%',
        padding: '12px',
        background: 'black',
        border: '1px solid #333',
        color: 'white',
        borderRadius: '4px',
        fontSize: '15px'
    };

    const labelStyle = {
        display: 'block', 
        marginBottom: '8px', 
        color: '#e7e9ea',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    return (
        <>
            {/* 2. Insert Navbar Component (Handles Logo, Links, User Info, Logout) */}
            <Navbar />

            {/* Main Content */}
            {/* Added marginTop to ensure content isn't hidden behind fixed Navbar */}
            <div style={{ 
                marginTop: '100px', 
                display: 'flex', 
                justifyContent: 'center', 
                paddingBottom: '40px' 
            }}>
                <div className="auth-container" style={{ margin: 0, maxWidth: '600px', width: '100%' }}>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #2f3336', margin: '30px 0' }} />

                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#e7e9ea' }}>Security</h3>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>New Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Leave blank to keep current"
                                value={formData.password}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '40px' }}>
                            <label style={labelStyle}>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                type="submit" 
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'white',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '99px',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    cursor: 'pointer'
                                }}
                            >
                                Update Profile
                            </button>

                            <button 
                                type="button" 
                                onClick={handleCancel}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'transparent',
                                    color: 'white',
                                    border: '1px solid #536471',
                                    borderRadius: '99px',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;