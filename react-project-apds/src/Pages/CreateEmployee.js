const CreateEmployee = () =>{
    const [enteredFirstNameEmployee, setEnteredFirstNameEmployee] = useState('');
    const [enteredLastNameEmployee, setEnteredLastNameEmployee] = useState('');
    const [enteredEmailAddressEmployee, setEnteredEmailAddressEmployee] = useState('');
    const [enteredUsernameEmployee, setEnteredUsernameEmployee] = useState('');
    const [enteredPasswordEmployee, setEnteredPasswordEmployee] = useState('');
    const [enteredConfirmPasswordEmployee, setEnteredConfirmPasswordEmployee] = useState('');
    const [enteredIDNumberEmployee, setIDNumberEmployee] = useState('');
    const [error, setError] = useState(''); 
    const [successMessage, setSuccessMessage] = useState(''); 
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
}