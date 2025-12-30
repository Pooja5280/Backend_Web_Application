import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar'; 

const Dashboard = () => {
    // Note: 'logout' is no longer needed here because Navbar handles it
    const { user } = useContext(AuthContext); 
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('');

    useEffect(() => { fetchUsers(); }, [page]);

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
            fetchUsers();
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // --- CHANGED: Replaced plain text with Spinner class ---
    if (loading) return <div className="spinner"></div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            
            {/* 1. Insert Navbar Component */}
            <Navbar />

            {/* 2. Added marginTop so the Fixed Navbar doesn't cover the content */}
            <div className="dashboard-container" style={{ marginTop: '80px' }}>
                
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        <div style={{ fontWeight: '700', color: '#e7e9ea', fontSize: '15px' }}>{u.fullName}</div>
                                        <div style={{ color: '#71767b', fontSize: '13px' }}>{u.email}</div>
                                    </td>
                                    <td>
                                        <span style={{ color: u.role === 'admin' ? '#1d9bf0' : '#71767b', fontWeight: 'bold' }}>
                                            {u.role === 'admin' ? '@admin' : 'user'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== 'admin' && (
                                            <>
                                                {u.status === 'inactive' ? (
                                                    <button onClick={() => handleStatusClick(u, 'activate')} className="btn-success">
                                                        Activate
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleStatusClick(u, 'deactivate')} className="btn-outline-danger">
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

                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', borderTop: '1px solid #2f3336' }}>
                    <button style={{ background: 'transparent', color: '#1d9bf0', border: '1px solid #2f3336', padding: '8px 16px', width: 'auto' }} disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </button>
                    <span style={{ color: '#71767b' }}>Page {page} of {totalPages}</span>
                    <button style={{ background: 'transparent', color: '#1d9bf0', border: '1px solid #2f3336', padding: '8px 16px', width: 'auto' }} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3 style={{ marginTop: 0, fontSize: '20px', color: '#e7e9ea' }}>
                                {actionType === 'activate' ? 'Activate User?' : 'Deactivate User?'}
                            </h3>
                            <p style={{ color: '#71767b', lineHeight: '1.5', marginBottom: '20px' }}>
                                Are you sure you want to {actionType} <b>{selectedUser?.fullName}</b>?
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button onClick={confirmStatusChange} className={actionType === 'activate' ? 'btn-primary' : 'btn-danger'} style={{width: '100%', borderRadius: '99px'}}>
                                    Confirm {actionType === 'activate' ? 'Activation' : 'Deactivation'}
                                </button>
                                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'white', border: '1px solid #536471', padding: '10px', width: '100%' }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;