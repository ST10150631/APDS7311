import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import bannerImage from '../Img/skyscrapers.jpeg';
import Logo from '../Img/SWIFT BANKING.png';
import card from '../Img/Swift Card.png'
import './styles/Navbar.css';
import './styles/UserTable.css';
import { jwtDecode } from 'jwt-decode';
const Dashboard = () => {
    const [customerName, setCustomerName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [availableBalance, setAvailableBalance] = useState('');
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [allUsers, setAllUsers] = useState([])
    const [selectedRole, setSelectedRole] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('https://localhost:3001/payment/transactions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setTransactions(data);
                } else {
                    console.error("Failed to fetch transactions");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);  // Set loading to false after fetching
            }
        };

        fetchTransactions();
    }, []);

    const fetchUsers = async (role) => {
        if (!role) return;
        setLoading(true);
        try {
            const response = await fetch(`https://localhost:3001/user/allUsers?role=${role}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched Data:", data);

                // Check if data is an object with roles or an array
                if (Array.isArray(data)) {
                    // If the response is an array, filter by role
                    const filteredUsers = data.filter(user => user.role === role);
                    setAllUsers(prevState => ({ ...prevState, [role]: filteredUsers }));
                } else if (data[role]) {
                    // If the response is an object with roles, update the respective role array
                    setAllUsers(prevState => ({ ...prevState, [role]: data[role] || [] }));
                } else {
                    console.error(`Role "${role}" not found in response`);
                    setAllUsers(prevState => ({ ...prevState, [role]: [] }));
                }
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };
    const deleteUser = async (id) => {
        try {
            const response = await fetch(`https://localhost:3001/user/deleteUser/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                alert('User successfully deleted');
                fetchUsers(selectedRole); // Refresh users after deletion
            } else {
                console.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // Fetch users based on selected role
    // useEffect(() => {
    // fetchUsers(selectedRole);
    ///  console.log("Selected Role",selectedRole)
    // }, [selectedRole]);

    // useEffect(() => {
    //    console.log('All Users:', allUsers);
    // }, [allUsers]);

    const fetchUserByUsername = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Decode the JWT token
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken); // Log the entire decoded token

            const username = decodedToken.username;
            console.log("Username from Token:", username); // Log the username to ensure it's correct

            // Fetch user data using the decoded username
            const response = await fetch(`https://localhost:3001/user/getUserByUsername?username=${username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log("API Response:", result);  // Log the API response to see if data is correct

                if (result.schema === 'User') {
                    setCustomerName(`${result.user.firstName} ${result.user.lastName}`);
                    setAccountNumber(result.user.accountNumber);
                    setAvailableBalance(result.user.balance ? `$${result.user.balance.toFixed(2)}` : '$0.00');
                    setUserRole(result.user.role);
                } else if (result.schema === 'Admin') {
                    setCustomerName(`${result.admin.firstName} ${result.admin.lastName}`);
                    setAvailableBalance(result.admin.balance ? `$${result.admin.balance.toFixed(2)}` : '$0.00');
                    setUserRole(result.admin.role);
                    console.log("Role", result.admin.role);
                } else if (result.schema === 'Employee') {
                    setCustomerName(`${result.employee.firstName} ${result.employee.lastName}`);
                    setAccountNumber(result.employee.accountNumber);
                    setUserRole(result.employee.role);
                    console.log("Role", result.employee.role);
                }
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);  // Set loading to false after fetching
        }
    };
    fetchUserByUsername();


    // Function to fetch user details by username


    // Handle navigation for various actions
    const handleLocalPayment = () => navigate('/localpayments');
    const handleAddFunds = () => navigate('/addfunds');
    const handleTransactions = () => navigate('/Transactions');
    const handleStaffTransactions = () => navigate('/StaffTransactions');
    const handleInternationalPayment = () => navigate('/InternationalPayments');
    useEffect(() => {
        if (selectedRole) {
            fetchUsers(selectedRole);
        }
    }, [selectedRole]);
    if (loading) {
        return <div>Loading...</div>;
    }

    // Determine the dashboard heading based on the user role
    const dashboardHeading = userRole === 'admin' ? 'Admin Dashboard' :
        userRole === 'employee' ? 'Employee Dashboard' : 'Customer Dashboard';

    return (
        <div className="bgDashboard">
            <div className="TopNavbar">
                <img src={Logo} className="logo" alt="Logo" />
                <h1>{dashboardHeading}</h1>
            </div>

            <div className="Image-Banner">
                <img src={bannerImage} style={{ width: '100%', height: 'auto' }} alt="Banner" />
            </div>

            <div className="dashboard-container">
                <div className="navbar">
                    <button className="nav-button" onClick={handleTransactions}>Transactions</button>
                    <button className="nav-button" onClick={handleLocalPayment}>Local Payments</button>
                    <button className="nav-button" onClick={handleAddFunds}>Deposit</button>
                    <button className="nav-button" onClick={handleInternationalPayment}>International Payments</button>

                    {(userRole === 'employee' || userRole === 'admin') && (
                        <button className="nav-button" onClick={handleStaffTransactions}>Staff Transactions</button>
                    )}

                    {userRole === 'admin' && (
                        <>
                            <button className="nav-button" onClick={() => navigate('/CreateAdmin')}>Admin Creation</button>
                            <button className="nav-button" onClick={() => navigate('/CreateEmployee')}>Create Employee</button>
                        </>
                    )}
                </div>

                {userRole === 'user' && (
                    <div className="main-content">
                        <h2>Hello, {customerName}</h2>

                        <h2>Payments</h2>
                        <div>
                            <button className="button" onClick={handleLocalPayment}>Make Local Payment</button>
                            <button className="button" onClick={handleInternationalPayment}>Make International Payment</button>
                        </div>

                        <h2>Banking Details</h2>
                        <div>
                            <strong>Current Account</strong>
                            <div><span>Acc No: {accountNumber}</span></div>
                            <div><span>Available Balance: {availableBalance}</span></div>
                        </div>

                        <h2>My Cards</h2>
                        <div className="banking-details-container">
                            <img src={card} alt="Swift Banking" className="banking-logo" />
                            <div className="banking-details">
                                <strong>Current Account</strong>
                                <div><span>Name: {customerName}</span></div>
                                <div><span>Acc No: {accountNumber}</span></div>
                                <div><span>Available Balance: {availableBalance}</span></div>
                                <div><span>Role: {userRole}</span></div>
                            </div>
                        </div>

                        <h2>Payment Receipts</h2>
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Recipient Name</th>
                                    <th>Recipient Bank</th>
                                    <th>Amount</th>
                                    <th>SWIFT Code</th>
                                    <th>Transaction Status</th>
                                    <th>Transaction Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                        <td>{transaction.recipientName}</td>
                                        <td>{transaction.recipientsBank}</td>
                                        <td>{transaction.amountToTransfer}</td>
                                        <td>{transaction.swiftCode}</td>
                                        <td>{transaction.status ? transaction.status : 'No status'}</td>
                                        <td>{transaction.transactionType || 'Unknown'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {userRole === 'admin' && (
                    <div className="user-content">
                        <h2>Select Role to View Users</h2>
                        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            <option value="">Select Role</option>
                            <option value="users">Users</option>
                            <option value="admins">Admins</option>
                            <option value="employees">Employees</option>
                            <option value="managers">Managers</option>
                        </select>

                        <h2>All Users</h2>
                        {selectedRole && allUsers[selectedRole]?.length > 0 ? (
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>ID Number</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers[selectedRole]?.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.username}</td>
                                            <td>{user.idNumber}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        deleteUser(user._id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No users available for this role.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="Footer">
                <h3>Help: 060 744 5462 or Info@SwiftBanking.com</h3>
            </div>
        </div>
    );
};

export default Dashboard;

