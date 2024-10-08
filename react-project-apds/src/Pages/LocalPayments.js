import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Img/SWIFT BANKING.png'

const LocalPayment = () => {
    const navigate = useNavigate();
    const handleCancel = () => {
        navigate('/dashboard');  
    };

    const [enteredRecipientsName, setEnteredRecipientsName] = useState('');
    const [enteredRecipientsBank, setEnteredRecipientsBank] = useState('');
    const [enteredRecipientsAccountNumber, setEnteredRecipientsAccountNumber] = useState('');
    const [enteredAmountToTransfer, setEnteredAmountToTransfer] = useState('');
    const [enteredSWIFTCode, setEnteredSWIFTCode] = useState('');
    const [transactionType, setTransactionType] = useState('Local'); // Use useState for transactionType
    const [status, setStatus] = useState('Pending'); // Use useState for status
    
    const handleInternationalPayment = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('jwt_token'); 

        const paymentData = {
            recipientName: enteredRecipientsName,
            recipientsBank: enteredRecipientsBank,
            recipientsAccountNumber: enteredRecipientsAccountNumber,
            amountToTransfer: parseFloat(enteredAmountToTransfer),
            swiftCode: enteredSWIFTCode,
            transactionType: transactionType,
            status: status

        };

        try {
            const response = await fetch('https://localhost:3001/payment/internationalpayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Payment successful:', data);
                navigate('/dashboard'); 
            } else {
                console.error('Error processing payment:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div
        className='bgDashboard'
        style={{
            backgroundImage: `url(${process.env.PUBLIC_URL + '/images/BGLocal.jpg'})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            margin: '0',
            padding: '0',
            boxSizing: 'border-box',
        }}
    >
                <div className="TopNavbar">
        <img src={Logo} className="logo" alt="Logo" />
        <h1>Local Payment</h1>
         </div>

            <div >
                <div className='form-container'>
                    <h1>Local Payment</h1>
                    <form onSubmit={handleInternationalPayment} >
                        <div className='input-group'>
                            <input
                                type='text'
                                placeholder='Recipient Name'
                                value={enteredRecipientsName}
                                onChange={(e) => setEnteredRecipientsName(e.target.value)}
                                required
                            />
                        </div>
                        <div className='input-group'>
                            <input
                                type="text"
                                placeholder='Recipients Bank'
                                value={enteredRecipientsBank}
                                onChange={(e) => setEnteredRecipientsBank(e.target.value)}
                                required
                            />
                        </div>
                        <div className='input-group'>
                            <input
                                type='text'
                                placeholder='Recipients Account No'
                                value={enteredRecipientsAccountNumber}
                                onChange={(e) => setEnteredRecipientsAccountNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className='input-group'>
                            <input
                                type='text'
                                placeholder='Amount to Transfer'
                                value={enteredAmountToTransfer}
                                onChange={(e) => setEnteredAmountToTransfer(e.target.value)}
                                required
                            />
                        </div>
                        <div className='input-group'>
                            <input
                                type='text'
                                placeholder='SWIFT Code'
                                value={enteredSWIFTCode}
                                onChange={(e) => setEnteredSWIFTCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="button">Pay Now</button>
                        <button type="button" className="button" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LocalPayment;