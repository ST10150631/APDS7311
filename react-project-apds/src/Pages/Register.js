import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Register.css';

//------------------------------------------------------//
const Register = () => {
    const [enteredFirstName, setEnteredFirstName] = useState('');
    const [enteredLastName, setEnteredLastName] = useState('');
    const [enteredEmailAddress, setEnteredEmailAddress] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [enteredAccountNumber, setAccountNumber] = useState('');
    const [enteredIDNumber, setIDNumber] = useState('');
    const [error, setError] = useState(''); 
    const [successMessage, setSuccessMessage] = useState(''); 

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = {
            firstName: enteredFirstName,
            lastName: enteredLastName,
            email: enteredEmailAddress,
            username: enteredUsername,
            password: enteredPassword,
            accountNumber: enteredAccountNumber,
            idNumber: enteredIDNumber,
        };

        try {
            const response = await fetch('https://localhost:3001/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccessMessage('User registered successfully!');
                console.log('User registered successfully:', result);
                navigate('/login'); 

                setEnteredFirstName('');
                setEnteredLastName('');
                setEnteredEmailAddress('');
                setEnteredUsername('');
                setEnteredPassword('');
                setEnteredConfirmPassword('');
                setAccountNumber('');
                setIDNumber('');
                setError('');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Registration failed');
                console.error('Registration failed:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while registering. Please try again.');
        }
    };

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
                    <h1>Customer Registration</h1>
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={enteredFirstName}
                                onChange={(e) => setEnteredFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={enteredLastName}
                                onChange={(e) => setEnteredLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={enteredEmailAddress}
                                onChange={(e) => setEnteredEmailAddress(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={enteredUsername}
                                onChange={(e) => setEnteredUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={enteredPassword}
                                onChange={(e) => setEnteredPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={enteredConfirmPassword}
                                onChange={(e) => setEnteredConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Account Number"
                                value={enteredAccountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="ID Number"
                                value={enteredIDNumber}
                                onChange={(e) => setIDNumber(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="register-btn">Register</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <p className="login-message">
                        Already have an account? <Link to="/login" className="login-link">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
//------------------------------------------------------//
export default Register;
//---------------------------------------------------END OF FILE------------------------//