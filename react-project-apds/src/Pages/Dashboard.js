import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'
import { useNavigate } from 'react-router-dom';
import bannerImage from'../Img/skyscrapers.jpeg'
import Logo from '../Img/SWIFT BANKING.png'
const Dashboard = () => {
    const customerName = "CustomerName";
    const accountNumber = "XXXXXXXXXXXXXXX"; // Replace with actual data
    const availableBalance = "$1,234.56"; // Replace with actual data

    const navigate = useNavigate();

    // Handlers for button clicks to navigate
    const handleLocalPayment = () => {
        navigate('LocalPayments');
    };

    const handleInternationalPayment = () => {
        navigate('InternationalPayments');
    };


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
