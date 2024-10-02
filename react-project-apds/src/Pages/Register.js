import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [enteredFirstName, setEnteredFirstName] = useState('');
    const [enteredLastName, setEnteredLastName] = useState('');
    const [enteredEmailAddress, setEnteredEmailAddress] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [enteredAccountNumber, setAccountNumber] = useState('');
    const [enteredIDNumber, setIDNumber] = useState('');

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
            const response = await fetch('https://localhost:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                console.log('User registered successfully');
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
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
            <p>
                Don't have an account? <Link to="/Login">login here</Link>
            </p>
        </div>
    );
};

export default Register;