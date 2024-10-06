import React from 'react';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import './App.css';

import Login from './Pages/Login'
import Register from './Pages/Register'
import LocalPayments from './Pages/LocalPayments';
import InternationalPayments from './Pages/InternationalPayments';

const App = () => {
    return(
     <div>
      <h1>Hi world</h1>
     </div>
    );
}


export default App;