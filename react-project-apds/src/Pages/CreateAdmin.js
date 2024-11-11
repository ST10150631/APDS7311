import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import './styles/Register.css';
const CreateAdmin = () => {

    const [enteredFirstNameAdmin, setEnteredFirstNameAdmin] = useState('');
    const [enteredLastNameAdmin, setEnteredLastNameAdmin] = useState('');
    const [enteredEmailAddressAdmin, setEnteredEmailAddressAdmin] = useState('');
    const [enteredUsernameAdmin, setEnteredUsernameAdmin] = useState('');
    const [enteredPasswordAdmin, setEnteredPasswordAdmin] = useState('');
    const [enteredConfirmPasswordAdmin, setEnteredConfirmPasswordAdmin] = useState('');
    const [enteredIDNumberAdmin, setIDNumberAdmin] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState(''); // Initialize role state

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Check the token value
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserRole('');
            }
        }
    }, []);

    const handleAdminCreation = async (e) => {
        e.preventDefault();

        const adminData = {
            firstName: enteredFirstNameAdmin,
            lastName: enteredLastNameAdmin,
            email: enteredEmailAddressAdmin,
            username: enteredUsernameAdmin,
            password: enteredPasswordAdmin,
            idNumber: enteredIDNumberAdmin
        };

        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:3001/user/createAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Add this line to send the token
            },
            body: JSON.stringify(adminData),
        });

        if (response.ok) {
            const result = await response.json();
            setSuccessMessage('Admin account created successfully!');
            //console.log('User registered successfully:', result);
            navigate('/dashboard');
            setEnteredFirstNameAdmin('');
            setEnteredLastNameAdmin('');
            setEnteredEmailAddressAdmin('');
            setEnteredUsernameAdmin('');
            setEnteredPasswordAdmin('');
            setEnteredConfirmPasswordAdmin('');

            setIDNumberAdmin('');
            setError('');
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Admin account creation failed');
            console.error('Admin account creation failed:', errorData);
        }
    };
    // Redirect or show a message if the user is not an admin
    if (userRole !== 'admin') {
        return (
            <div style={{ textAlign: 'center' }}>
                <h1>You do not have permission to access this page.</h1>
            </div>
        );
    }
    return (
        <div
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + '/images/background.jpg'})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0',
                padding: '0',
                boxSizing: 'border-box',
            }}
        >
            <div className="register-container">
                <div className="form-container">
                    <h1>Admin Creation</h1>
                    <form onSubmit={handleAdminCreation}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={enteredFirstNameAdmin}
                                onChange={(e) => setEnteredFirstNameAdmin(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={enteredLastNameAdmin}
                                onChange={(e) => setEnteredLastNameAdmin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={enteredEmailAddressAdmin}
                                onChange={(e) => setEnteredEmailAddressAdmin(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={enteredUsernameAdmin}
                                onChange={(e) => setEnteredUsernameAdmin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={enteredPasswordAdmin}
                                onChange={(e) => setEnteredPasswordAdmin(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={enteredConfirmPasswordAdmin}
                                onChange={(e) => setEnteredConfirmPasswordAdmin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="ID Number"
                                value={enteredIDNumberAdmin}
                                onChange={(e) => setIDNumberAdmin(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="register-btn">Create Admin Account</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </div>
            </div>
        </div>
    );
}
export default CreateAdmin; 