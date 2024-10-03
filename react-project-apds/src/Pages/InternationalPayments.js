import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Test = () => {
    const navigate = useNavigate();
    const handleCancel = () => {
        navigate('/dashboard');  
    };

    const [enteredRecipientsName, setEnteredRecipientsName] = useState();
    const [enteredRecipientsBank, setEnteredRecipientsBank] = useState();
    const [enteredRecipientsAccountNumber, setEnteredRecipientsAccountNumber] = useState();
    const [enteredAmountToTransfer, setEnteredAmountToTransfer] = useState();
    const [enteredSWIFTCode, setEnteredSWIFTCode] = useState();

    return (
        <div>
            <div className='international-payment-container'>
                <div className='form-container'>
                    <h1>International Payment</h1>
                    <form onSubmit={handleInternationalPayment} >
                        <div className='input-group'>
                            <input
                                type='text'
                                placeholder='Recepients Name'
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
                                placeholder='Recipients account no'
                                value={enteredRecipientsAccountNumber}
                                onChange={(e) => setEnteredRecipientsAccountNumber(e.target.value)}
                                required
                            />

                        </div>
                        <div className='input-group'>
                            <input
                                type='text'
                                placeholder='Amount to transfer'
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
                        <button type="submit" className="pay-now-btn">Pay Now</button>
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Test;