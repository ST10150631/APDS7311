# APDS7311 

Github REPO - https://github.com/ST10150631/APDS7311

## Team:

- ST10108388: Aiden Byrne ST10108388
- ST10150631: Michael Stewart Turner ST10150631
- ST10023767: Mikayle Devonique Coetzee ST10023767

## Video 

## Project Overview:
This project involves developing a secure International Payments Portal for an international bank. The portal enables customers to register, log in, and make international payments, which are then verified and processed by employees in part 3.

## Please Note that there are files that would never be uploaded or publically shared in a real world scenerio however to allow lectureres to run the application these files are available and can be configured.

## Technologies Used
- Frontend: React (JavaScript)
- Backend: Node.js with Express
- Database: MongoDB

## Security Tools Used:
- Express Brute for brute-force protection
- SSL for securing communication
- Hashing and Salting for password security
- Input Whitelisting with RegEx patterns

## Prerequisites:
- Node.js: Ensure you have Node.js installed.
- MongoDB: You need a running MongoDB instance. You can use a local setup or MongoDB Atlas.
- Visual Studio Code: Download Visual Studio Code for editing and managing the project.
- Google Chrome

## PLEASE NOTE IF USING CHROME

- Enter this link in your browser  chrome://flags/#allow-insecure-localhost
- You will then have the 'Allow invalid certificates for resources loaded from localhost.' to enabled
- This allows the browser to run the local certificates and ensure HTTPS
- Once deployed onto a server this issue will no longer persist.


## Installation Instructions
1. Clone the Repository
2. Install Backend Dependencies 
3. Install Frontend Dependencies 
4. Configure Environment Variables
5. Run MongoDB Locally (if needed)
6. Run the Application

The application should be running on:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Features

### Customer Portal
- Registration: Secure registration with full name, ID number, account number, and password.
- Login: Customer logs in with username, account number, and password.
### International Payment:
- Select amount, currency, and payment provider (e.g., SWIFT).
- Input payee's account information and SWIFT code.
- Finalize the payment.

## Security Features
- Password Hashing: Passwords are hashed and salted before being stored in the database.
- Express Brute: Protects against brute-force attacks during login.
- RegEx Input Whitelisting: Ensures inputs conform to specific patterns, reducing vulnerability to SQL injection and XSS attacks.
- SSL Encryption: All traffic is encrypted using SSL.
- Session Management: Protects against session hijacking.
