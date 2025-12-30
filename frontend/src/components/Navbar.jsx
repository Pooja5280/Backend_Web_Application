import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Used to highlight active link

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    // Helper to style links (Active vs Inactive)
    const getLinkStyle = (path) => ({
        color: location.pathname === path ? 'white' : '#b0b3b8', // White if active, grey if inactive
        textDecoration: 'none',
        fontWeight: location.pathname === path ? 'bold' : 'normal',
        fontSize: '18px', // Increased size
        transition: 'color 0.2s'
    });

    return (
        <header className="app-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '15px 30px', // More breathing room
            borderBottom: '1px solid #2f3336',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'black',
            zIndex: 1000
        }}>
            {/* LEFT SIDE: Logo & Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                {/* Logo */}
                <div style={{ fontSize: '26px', fontWeight: '900', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    
                </div>

                {/* Navigation Links */}
                <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                    {/* Only Admins see Dashboard */}
                    {user.role === 'admin' && (
                        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
                            Dashboard
                        </Link>
                    )}

                    {/* Everyone sees Profile */}
                    <Link to="/profile" style={getLinkStyle('/profile')}>
                        My Profile
                    </Link>
                </nav>
            </div>

            {/* RIGHT SIDE: User Info & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                
                {/* User Name & Role */}
                <div style={{ 
                    textAlign: 'right', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    minWidth: '100px' // Ensures space for name
                }}>
                    {/* FIXED: whiteSpace: 'nowrap' prevents name from breaking into two lines */}
                    <span style={{ 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '16px', 
                        whiteSpace: 'nowrap' 
                    }}>
                        {user.fullName}
                    </span>
                    <span style={{ 
                        color: '#71767b', 
                        fontSize: '12px', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        marginTop: '2px'
                    }}>
                        {user.role}
                    </span>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={handleLogout} 
                    style={{ 
                        background: 'white', 
                        color: 'black', 
                        border: 'none', 
                        padding: '8px 24px', 
                        fontSize: '15px', 
                        borderRadius: '99px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Log out
                </button>
            </div>
        </header>
    );
};

export default Navbar;