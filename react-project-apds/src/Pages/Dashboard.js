import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import bannerImage from '../Img/skyscrapers.jpeg';
import Logo from '../Img/SWIFT BANKING.png';
import card from '../Img/Swift Card.png'
import './styles/Navbar.css';
const Dashboard = () => {
    const [customerName, setCustomerName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [availableBalance, setAvailableBalance] = useState('');
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); 
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('https://localhost:3001/user/getUser', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setCustomerName(`${result.user.firstName} ${result.user.lastName}`);
                    setAccountNumber(result.account.accountNumber);
                    setAvailableBalance(`$${result.account.balance.toFixed(2)}`);
                } else {
                    if (response.status === 401) {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLocalPayment = () => {
        navigate('/AddFunds');
    };

    const handleTransactions = () => {
        navigate('/Transactions');
    };


    const handleInternationalPayment = () => {
        navigate('/InternationalPayments');
    };

    if (loading) {
        return <div>Loading...</div>; 
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
                <div className="navbar">
                    <button className="nav-button" onClick={() => navigate('/Transactions')}>
                        Transactions
                    </button>
                    <button className="nav-button" onClick={() => navigate('/payment-history')}>
                        Payments
                    </button>
                    <button className="nav-button" onClick={() => navigate('/AddFunds')}>
                        Add Funds
                    </button>
                    <button className="nav-button" onClick={() => navigate('/InternationalPayments')}>
                        International Payments
                    </button>
                </div>

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
                    <div >
                        <strong>Current Account</strong>
                        <div>
                            <span>Acc No: {accountNumber}</span>
                        </div>
                        <div>
                            <span>Available Balance: {availableBalance}</span>
                        </div>
                    </div>
                    
                    <h2>My Cards</h2>

                    {/* Updated banking details section */}
                    <div className="banking-details-container">
                        <img src={card} alt="Swift Banking" className="banking-logo" />
                        <div className="banking-details">
                            <strong>Current Account</strong>
                            <div>
                                <span>Name: {customerName}</span>
                            </div>
                            <div>
                                <span>Acc No: {accountNumber}</span>
                            </div>
                            <div>
                                <span>Available Balance: {availableBalance}</span>
                            </div>
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
