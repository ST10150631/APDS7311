import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/LandingPage.css';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true); 
    }, 10); 
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    setIsLoaded(false); 
    setTimeout(() => {
    }, 10); 
  };

  return (
    <div
      className={`landing-page ${isLoaded ? 'loaded' : ''}`}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/images/BGImage.png'})`,
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
        transition: 'filter 1s ease-out', 
      }}
    >
      <div className="landing-container">
        <h1>Welcome to Swift Banking</h1>
        <p>
          Your Trusted Partner for Secure Payments! Whether you're logging in or registering, you're about to enjoy a seamless and fully protected banking experience. Our commitment to security and ease of use ensures that your transactions are always safe, so you can manage your finances with confidence.
        </p>

        <div className="button-container">
          <Link to="/login">
            <button onClick={handleButtonClick} className="landing-btn">Login</button>
          </Link>
          <Link to="/register">
            <button onClick={handleButtonClick} className="landing-btn">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
