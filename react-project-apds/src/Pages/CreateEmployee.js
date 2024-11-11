import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import './styles/Register.css';

const CreateEmployee = () => {
    const [enteredFirstNameEmployee, setEnteredFirstNameEmployee] = useState('');
    const [enteredLastNameEmployee, setEnteredLastNameEmployee] = useState('');
    const [enteredEmailAddressEmployee, setEnteredEmailAddressEmployee] = useState('');
    const [enteredUsernameEmployee, setEnteredUsernameEmployee] = useState('');
    const [enteredPasswordEmployee, setEnteredPasswordEmployee] = useState('');
    const [enteredConfirmPasswordEmployee, setEnteredConfirmPasswordEmployee] = useState('');
    const [enteredIDNumberEmployee, setIDNumberEmployee] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState('');
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

    const handleEmployeeCreation = async (e) => {
        e.preventDefault();

        const employeeData = {
            firstName: enteredFirstNameEmployee,
            lastName: enteredLastNameEmployee,
            email: enteredEmailAddressEmployee,
            username: enteredUsernameEmployee,
            password: enteredPasswordEmployee,
            idNumber: enteredIDNumberEmployee,
        };

        const token = localStorage.getItem('token'); // Or retrieve it from wherever you store the token

        const response = await fetch('https://localhost:3001/user/createEmployee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add the token here
            },
            body: JSON.stringify(employeeData),
        });

        if (response.ok) {
            const result = await response.json();
            setSuccessMessage('Employee account created successfully!');
            navigate('/dashboard');
            setEnteredFirstNameEmployee('');
            setEnteredLastNameEmployee('');
            setEnteredEmailAddressEmployee('');
            setEnteredUsernameEmployee('');
            setEnteredPasswordEmployee('');
            setEnteredConfirmPasswordEmployee('');
            setIDNumberEmployee('');
            setError('');
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Employee account creation failed');
        }
    };

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
                    <h1>Employee Creation</h1>
                    <form onSubmit={handleEmployeeCreation}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={enteredFirstNameEmployee}
                                onChange={(e) => setEnteredFirstNameEmployee(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={enteredLastNameEmployee}
                                onChange={(e) => setEnteredLastNameEmployee(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={enteredEmailAddressEmployee}
                                onChange={(e) => setEnteredEmailAddressEmployee(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={enteredUsernameEmployee}
                                onChange={(e) => setEnteredUsernameEmployee(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={enteredPasswordEmployee}
                                onChange={(e) => setEnteredPasswordEmployee(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={enteredConfirmPasswordEmployee}
                                onChange={(e) => setEnteredConfirmPasswordEmployee(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="ID Number"
                                value={enteredIDNumberEmployee}
                                onChange={(e) => setIDNumberEmployee(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="register-btn">Create Employee Account</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default CreateEmployee;