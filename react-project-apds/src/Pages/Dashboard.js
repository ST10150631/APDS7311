import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import bannerImage from '../Img/skyscrapers.jpeg';
import Logo from '../Img/SWIFT BANKING.png';

const Dashboard = () => {
    const [customerName, setCustomerName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [availableBalance, setAvailableBalance] = useState('');
    const [loading, setLoading] = useState(true); // Added loading state

    const navigate = useNavigate();

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage

            if (!token) {
                // If no token is available, redirect to the login page
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('https://localhost:3001/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setCustomerName(result.user.firstName + ' ' + result.user.lastName); // Set customer name
                    setAccountNumber(result.account.accountNumber); // Set account number
                    setAvailableBalance(`$${result.account.balance.toFixed(2)}`); // Set balance
                } else {
                    console.error('Failed to fetch user data');
                    // Optionally handle unauthorized access
                    if (response.status === 401) {
                        navigate('/login'); // Redirect to login if unauthorized
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false); // Data has been loaded
            }
        };

        fetchUserData();
    }, [navigate]); // Added navigate to dependency array

    // Handlers for button clicks to navigate
    const handleLocalPayment = () => {
        navigate('/LocalPayments');
    };

    const handleInternationalPayment = () => {
        navigate('/InternationalPayments');
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading message while data is being fetched
    }

    return (
        <div className="bgDashboard">
            <div className="TopNavbar">
                <img src={Logo} className="logo" alt="Logo" />
                <h1>Customer Dashboard</h1>
            </div>

            <div className="Image-Banner">
                <img src={bannerImage} style={{ width: '100%', height: 'auto' }} alt="Banner" />
            </div>

            <div className="dashboard-container">
                {/* Side Menu */}
                <nav className="sidebar">
                    <h2>Menu</h2>
                    <ul className="nav-list">
                        <li><Link to="/view-transactions">Transactions</Link></li>
                        <li><Link to="/payment-history">Payments</Link></li>
                    </ul>
                </nav>

                {/* Main Content */}
                <div className="main-content">
                    <h2>Hello, {customerName}</h2>

                    <h2>Payments</h2>
                    <div>
                        <button className="button" onClick={handleLocalPayment}>
                            Make Local Payment
                        </button>
                        <button className="button" onClick={handleInternationalPayment}>
                            Make International Payment
                        </button>
                    </div>
                    <h2>Banking Details</h2>
                    <div className="banking-details">
                        <strong>Current Account</strong>
                        <div>
                            <span>Acc No: {accountNumber}</span>
                        </div>
                        <div>
                            <span>Available Balance: {availableBalance}</span>
                        </div>
                    </div>

                    <h2>Payment Receipts</h2>
                    <ul className="payment-list">
                        <li>
                            <span>2024/08/20 - Sch Fees - $200</span>
                            <button className="button">Pay again</button>
                        </li>
                        <li>
                            <span>2024/08/20 - Home R - $100</span>
                            <button className="button">Pay again</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
