import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
    const [enteredFirstName, setEnteredFirstName] = useState('');
    const [enteredLastName, setEnteredLastName] = useState('');
    const [enteredEmailAddress, setEnteredEmailAddress] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [enteredAccountNumber, setAccountNumber] = useState('');
    const [enteredIDNumber, setIDNumber] = useState('');
    const [error, setError] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

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
                navigate('/login'); // Use navigate to redirect to the login page
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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <input
                        type="text"
                        placeholder='First Name'
                        value={enteredFirstName}
                        onChange={(e) => setEnteredFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='Last Name'
                        value={enteredLastName}
                        onChange={(e) => setEnteredLastName(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder='Email Address'
                        value={enteredEmailAddress}
                        onChange={(e) => setEnteredEmailAddress(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='Username'
                        value={enteredUsername}
                        onChange={(e) => setEnteredUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder='Password'
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        value={enteredConfirmPassword}
                        onChange={(e) => setEnteredConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='Account Number'
                        value={enteredAccountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='ID Number'
                        value={enteredIDNumber}
                        onChange={(e) => setIDNumber(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
            <p>
                Don't have an account? <Link to="/Login">login here</Link>
            </p>
        </div>
    );
};

export default Register;