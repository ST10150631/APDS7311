import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import bannerImage from '../Img/TransferBG.png';
import Logo from '../Img/SWIFT BANKING.png';
import './styles/TransactionTable.css';

const StaffTransactions = () => {
    const [transactions, setTransactions] = useState([]); // State to hold transactions
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetch transactions with a status of 'pending' or any other criteria as needed
                const response = await fetch('https://localhost:3001/payment/transactions/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const transactions = [];
                    data.forEach(element => {
                        // Can change to others later
                        if (element.status === 'Pending') {
                            transactions.push(element);
                        }
                    });
                    setTransactions(transactions);
                } else {
                    console.error("Failed to fetch pending transactions");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []); 

    // Handle Confirm action
    const handleConfirm = async (transactionId) => {
        try {
            const response = await fetch(`https://localhost:3001/payment/transaction/${transactionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: 'confirmed' }) // Confirm status
            });

            if (response.ok) {
                setTransactions(prevTransactions =>
                    prevTransactions.map(transaction =>
                        transaction._id === transactionId ? { ...transaction, status: 'Confirmed' } : transaction
                    )
                );
                alert('Transaction confirmed');
            } else {
                console.error("Failed to confirm transaction");
            }
        } catch (error) {
            console.error("Error confirming transaction:", error);
        }
    };

    // Handle Deny action
    const handleDeny = async (transactionId) => {
        try {
            const response = await fetch(`https://localhost:3001/payment/transaction/${transactionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: 'denied' }) // Deny status
            });

            if (response.ok) {
                setTransactions(prevTransactions =>
                    prevTransactions.map(transaction =>
                        transaction._id === transactionId ? { ...transaction, status: 'Denied' } : transaction
                    )
                );
                alert('Transaction denied');
            } else {
                console.error("Failed to deny transaction");
            }
        } catch (error) {
            console.error("Error denying transaction:", error);
        }
    };

    // Handle Flag action
    const handleFlag = async (transactionId) => {
        try {
            const response = await fetch(`https://localhost:3001/payment/transaction/${transactionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: 'flagged' }) // Flag status
            });

            if (response.ok) {
                setTransactions(prevTransactions =>
                    prevTransactions.map(transaction =>
                        transaction._id === transactionId ? { ...transaction, status: 'Flagged' } : transaction
                    )
                );
                alert('Transaction flagged');
            } else {
                console.error("Failed to flag transaction");
            }
        } catch (error) {
            console.error("Error flagging transaction:", error);
        }
    };

    return (
        <div className="bgDashboard">
            <div className="TopNavbar">
                <img src={Logo} className="logo" alt="Logo" />
                <h1>Staff Transactions</h1>
            </div>

            <div className="Image-Banner">
                <img src={bannerImage} style={{ width: '100%', height: 'auto' }} alt="Banner" />
            </div>

            <div className="dashboard-container">
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
                <div className="transaction-content">
                    <h2>Hello, Mike</h2>

                    <h2>Transaction History</h2>

                    {/* Transaction Table */}
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Recipient Name</th>
                                <th>Recipient Bank</th>
                                <th>Amount</th>
                                <th>SWIFT Code</th>
                                <th>Status</th>
                                <th>Confirm</th>
                                <th>Deny</th>
                                <th>Flag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{transaction.recipientName}</td>
                                    <td>{transaction.recipientsBank}</td>
                                    <td>{transaction.amountToTransfer}</td>
                                    <td>{transaction.swiftCode}</td>
                                    <td>{transaction.status || 'Pending'}</td>
                                    <td>
                                        {transaction.status === 'Pending' && (
                                            <button
                                                onClick={() => handleConfirm(transaction._id)}
                                                className="confirm-button">
                                                <i className="fas fa-check-circle"></i> Confirm
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {transaction.status === 'Pending' && (
                                            <button
                                                onClick={() => handleDeny(transaction._id)}
                                                className="deny-button">
                                                <i className="fas fa-times-circle"></i> Deny
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {transaction.status !== 'Flagged' && (
                                            <button
                                                onClick={() => handleFlag(transaction._id)}
                                                className="flag-btn">
                                                <i className="fas fa-flag"></i> Flag
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffTransactions;
