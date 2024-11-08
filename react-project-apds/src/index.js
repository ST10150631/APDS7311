import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import './index.css'; 
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import Register from './Pages/Register';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Test from './Pages/Test';
import InternationalPayment from './Pages/InternationalPayments';
import LocalPayment from './Pages/LocalPayments';
import Transactions from './Pages/Transactions';
import '@fortawesome/fontawesome-free/css/all.min.css';
import StaffTransactions from './Pages/StaffTransactions';
import AddFunds from './Pages/AddFunds';
//Router for navigation so if a new page is created add the path to this so that you can use links to access it 
//-------------------------------------------------------//
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Register/>,
    },
    {
      path: "Transactions",
      element: <Transactions/>,
    },
    {
      path: "Dashboard",
      element: <Dashboard/>,
    },
    {
        path: "Login",
        element: <Login/>,
    },
    {
      path: "/test", 
      element: <Test />,
  },
  {
    path: "/internationalpayments", 
    element: <InternationalPayment/>,
},
{
  path: "/localpayments", 
  element: <LocalPayment/>,
},
{
  path: "/StaffTransactions",
  element: <StaffTransactions/>,
},
{
  path: "/addfunds", 
  element: <AddFunds/>,
}
  ]);
//-------------------------------------------------------//
const rootElement = document.getElementById('root'); 
const root = ReactDOM.createRoot(rootElement); 
//-------------------------------------------------------//
root.render(
    <React.StrictMode>
         <RouterProvider router={router} />
    </React.StrictMode>
);
//-------------------------------------------------------//

//---------------------------------------END OF FILE--------------------------------------//