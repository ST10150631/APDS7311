import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [error, setError] = useState(''); 
    const [successMessage, setSuccessMessage] = useState(''); 

    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            username: enteredUsername,
            password: enteredPassword,
        };

        try {
            const response = await fetch('https://localhost:3001/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccessMessage('Login successful!');
                console.log('Login successful:', result);
                localStorage.setItem('token', result.token);
                navigate('/test');
                
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Login failed');
                console.error('Login failed:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
//---------------------------------------------------END OF FILE------------------------//