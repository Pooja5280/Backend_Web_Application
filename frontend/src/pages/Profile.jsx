import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName,
                email: user.email
            }));
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Password validation if they are trying to change it
        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                return toast.error("Passwords do not match");
            }
            if (formData.password.length < 6) {
                return toast.error("Password must be at least 6 characters");
            }
        }

        try {
            const updateData = {
                fullName: formData.fullName,
                email: formData.email,
            };

            // Only send password if user typed one
            if (formData.password) {
                updateData.password = formData.password;
            }

            const res = await API.put('/users/profile', updateData);
            
            // Update local context with new user data
            // Maintain the token from the old user object since the backend might not return a new one on update
            const updatedUser = { ...user, ...res.data }; 
            login(updatedUser);
            
            toast.success('Profile Updated Successfully');
            
            // Clear password fields
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>My Profile</h2>
                <div>
                     {user?.role === 'admin' && (
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            style={{ marginRight: '10px', backgroundColor: '#6c757d' }}
                        >
                            Back to Dashboard
                        </button>
                    )}
                    <button onClick={logout} style={{ backgroundColor: '#dc3545' }}>Logout</button>
                </div>
            </header>

            <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <hr style={{ margin: '20px 0' }} />
                    <h4 style={{ margin: '0 0 15px 0' }}>Change Password (Optional)</h4>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Leave blank to keep current"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" style={{ width: '100%' }}>Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;