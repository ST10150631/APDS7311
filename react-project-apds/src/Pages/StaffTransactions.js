import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import bannerImage from '../Img/TransferBG.png';
import Logo from '../Img/SWIFT BANKING.png';
import './styles/TransactionTable.css';

const StaffTransactions = () => {
    const [transactions, setTransactions] = useState([]); // State to hold transactions
    const [filteredTransactions, setFilteredTransactions] = useState([]); // State to hold filtered transactions
    const [statusFilter, setStatusFilter] = useState('All'); // State for dropdown filter
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('https://localhost:3001/payment/transactions/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data); // Set all transactions to state
                    setFilteredTransactions(data); // Initially show all transactions
                } else {
                    console.error("Failed to fetch transactions");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []); // Empty dependency array ensures this runs only once after the component mounts

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
                        transaction._id === transactionId ? { ...transaction, status: 'confirmed' } : transaction
                    )
                );
                // Re-filter transactions after confirming
                filterTransactions(statusFilter);
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
                        transaction._id === transactionId ? { ...transaction, status: 'denied' } : transaction
                    )
                );
                // Re-filter transactions after denying
                filterTransactions(statusFilter);
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
                        transaction._id === transactionId ? { ...transaction, status: 'flagged' } : transaction
                    )
                );
                // Re-filter transactions after flagging
                filterTransactions(statusFilter);
            } else {
                console.error("Failed to flag transaction");
            }
        } catch (error) {
            console.error("Error flagging transaction:", error);
        }
    };

    // Handle dropdown change
    const handleFilterChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);
        filterTransactions(selectedStatus); // Re-filter when dropdown value changes
    };

    // Filter transactions based on the selected status
    const filterTransactions = (status) => {
        if (status === 'All') {
            setFilteredTransactions(transactions); // Show all transactions
        } else {
            const filtered = transactions.filter(transaction => transaction.status === status);
            setFilteredTransactions(filtered); // Show only the transactions with the selected status
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
                    <button className="nav-button" onClick={() => navigate('/Dashboard')}>Dashboard</button>
                    <button className="nav-button" onClick={() => navigate('/LocalPayments')}>Local Payments</button>
                    <button className="nav-button" onClick={() => navigate('/AddFunds')}>Add Funds</button>
                    <button className="nav-button" onClick={() => navigate('/InternationalPayments')}>International Payments</button>
                </div>

                {/* Main Content */}
                <div className="transaction-content">
                    <h2>Hello, Mike</h2>

                    <h2>Transaction History</h2>

                    {/* Dropdown to filter by status */}
                    <div>
                        <label htmlFor="statusFilter">Filter by Status: </label>
                        <select id="statusFilter" value={statusFilter} onChange={handleFilterChange}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="denied">Denied</option>
                            <option value="flagged">Flagged</option>
                        </select>
                    </div>

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
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{transaction.recipientName}</td>
                                    <td>{transaction.recipientsBank}</td>
                                    <td>{transaction.amountToTransfer}</td>
                                    <td>{transaction.swiftCode}</td>
                                    <td>{transaction.status || 'Pending'}</td>
                                    <td>
                                        {(transaction.status === 'Pending' || transaction.status === 'flagged') && (
                                            <button
                                                onClick={() => handleConfirm(transaction._id)}
                                                className="confirm-button">
                                                <i className="fas fa-check-circle"></i> Confirm
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {(transaction.status === 'Pending' || transaction.status === 'flagged') && (
                                            <button
                                                onClick={() => handleDeny(transaction._id)}
                                                className="deny-button">
                                                <i className="fas fa-times-circle"></i> Deny
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {transaction.status !== 'flagged' && (
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
