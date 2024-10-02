import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import './index.css'; 
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import Register from './Pages/Register';
import Login from './Pages/Login';
import Test from './Pages/Test';
//Router for navigation so if a new page is created add the path to this so that you can use links to access it 
//-------------------------------------------------------//
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Register/>,
    },
    {
        path: "Login",
        element: <Login/>,
    },
    {
      path: "/test", 
      element: <Test />,
  },
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