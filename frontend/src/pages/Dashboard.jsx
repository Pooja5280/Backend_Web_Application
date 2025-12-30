import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(''); // 'activate' or 'deactivate'

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        try {
            const res = await API.get(`/users?pageNumber=${page}`);
            setUsers(res.data.users);
            setPage(res.data.page);
            setTotalPages(res.data.pages);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleStatusClick = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setShowModal(true);
    };

    const confirmStatusChange = async () => {
        try {
            const newStatus = actionType === 'activate' ? 'active' : 'inactive';
            await API.put(`/users/${selectedUser._id}/status`, { status: newStatus });
            
            toast.success(`User ${newStatus}d successfully`);
            fetchUsers(); // Refresh list
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Admin Dashboard</h2>
                <div>
                    <span style={{ marginRight: '15px' }}>Welcome, {user?.fullName}</span>
                    <button onClick={logout} style={{ backgroundColor: '#dc3545' }}>Logout</button>
                </div>
            </header>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Full Name</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Role</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{u.fullName}</td>
                                <td style={{ padding: '10px' }}>{u.email}</td>
                                <td style={{ padding: '10px' }}>{u.role}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px',
                                        backgroundColor: u.status === 'active' ? '#d4edda' : '#f8d7da',
                                        color: u.status === 'active' ? '#155724' : '#721c24'
                                    }}>
                                        {u.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {u.role !== 'admin' && (
                                        <>
                                            {u.status === 'inactive' ? (
                                                <button 
                                                    onClick={() => handleStatusClick(u, 'activate')}
                                                    style={{ backgroundColor: '#28a745', fontSize: '0.8rem', marginRight: '5px' }}
                                                >
                                                    Activate
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleStatusClick(u, 'deactivate')}
                                                    style={{ backgroundColor: '#ffc107', color: '#000', fontSize: '0.8rem', marginRight: '5px' }}
                                                >
                                                    Deactivate
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px', color: 'black' }}>
                        <h3>Confirm Action</h3>
                        <p>Are you sure you want to <b>{actionType}</b> this user?</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setShowModal(false)} style={{ backgroundColor: '#6c757d' }}>Cancel</button>
                            <button onClick={confirmStatusChange} style={{ backgroundColor: actionType === 'activate' ? '#28a745' : '#dc3545' }}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;