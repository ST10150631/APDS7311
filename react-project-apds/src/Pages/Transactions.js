import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import bannerImage from '../Img/Digital-Transactions.jpg';
import Logo from '../Img/SWIFT BANKING.png';

const Dashboard = () => {
   
    const navigate = useNavigate();



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
                <nav className="sidebar">
                    <h2>Menu</h2>
                    <ul className="nav-list">
                        <li><Link to="/view-transactions">Dashboard</Link></li>
                        <li><Link to="/payment-history">Payments</Link></li>
                    </ul>
                </nav>

                {/* Main Content */}
                <div className="main-content">
                    <h2>Hello, Mike</h2>

                    <h2>Transactions</h2>
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
