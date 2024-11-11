import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import bannerImage from '../Img/Digital-Transactions.jpg';
import Logo from '../Img/SWIFT BANKING.png';
import { jwtDecode } from 'jwt-decode';
import './styles/TransactionTable.css'
const Dashboard = () => {
    const [transactions, setTransactions] = useState([]); // State to hold transactions
    const [customerName, setCustomerName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserByUsername = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
    
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.username;
    
                const response = await fetch(`https://localhost:3001/user/getUserByUsername?username=${username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    const result = await response.json();
                        setCustomerName(`${result.user.firstName} ${result.user.lastName}`);
                    
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        
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
                    setTransactions(data);
                } else {
                    console.error("Failed to fetch transactions");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchUserByUsername();
        fetchTransactions();
    }, []); 

    return (
        <div className="bgDashboard">
            <div className="TopNavbar">
                <img src={Logo} className="logo" alt="Logo" />
                <h1>Transactions</h1>
            </div>

            <div className="Image-Banner">
                <img src={bannerImage} style={{ width: '100%', height: 'auto' }} alt="Banner" />
            </div>

            <div className="dashboard-container">
                {/* Side Menu */}
               
                {/* Side Menu */}
                <div className="navbar">
                    <button className="nav-button" onClick={() => navigate('/Dashboard')}>
                        Dashboard
                    </button>
                    <button className="nav-button" onClick={() => navigate('/LocalPayments')}>
                        Local Payments
                    </button>
                    <button className="nav-button" onClick={() => navigate('/AddFunds')}>
                        Add Funds
                    </button>
                    <button className="nav-button" onClick={() => navigate('/InternationalPayments')}>
                        International Payments
                    </button>
                </div>

                {/* Main Content */}
                <div className="main-table-content">
                <h2 class="textBlack">Hello, {customerName}</h2>

                    <h2 className="textBlack">Transaction History</h2>

                    {/* Transaction Table */}
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Recipient Name</th>
                                <th>Recipient Bank</th>
                                <th>Amount</th>
                                <th>SWIFT Code</th>
                                <th>Transaction Status</th>
                                <th>Payment Type</th>
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
                                    <td>{transaction.status}</td>
                                    <td>{transaction.transactionType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
//-------------------------------------END OF FILE-----------------------------------//