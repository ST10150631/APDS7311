import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//------------------------------------------------------//
const AddFunds = () => {
    const navigate = useNavigate();
    const handleCancel = () => {
        navigate('/dashboard');  
    };
    const [enteredAmountOfFundsToAdd, setEnteredAmountOfFundsToAdd] = useState('');
    const handleAddFunds = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:3001/payment/add-balance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({
                    amount: parseFloat(enteredAmountOfFundsToAdd) 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add funds');
            }

            const data = await response.json();
            alert(`Balance updated successfully! New Balance: ${data.newBalance}`);
            navigate('/internationalpayments');
        } catch (error) {
            console.error('Error adding funds:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <div className='add-funds-container'>
                <div className='form-container'>
                    <h1>Add Funds</h1>
                    <form onSubmit={handleAddFunds}>
                        <div className='input-group'>
                            <input
                                type='text'
                                placeholder='Funds to Add'
                                value={enteredAmountOfFundsToAdd}
                                onChange={(e) => setEnteredAmountOfFundsToAdd(e.target.value)}
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
//------------------------------------------------------//
export default AddFunds;
//---------------------------------------END OF FILE--------------------------//