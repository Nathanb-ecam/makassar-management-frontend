import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';

import './App.css'

import MainNavbar from './components/main/MainNavbar.tsx'
import Orders from './pages/Orders.tsx';
import Materials from './pages/Materials.tsx';
import Products from './pages/Products.tsx';
import Dashboard from './pages/Dashboard.tsx';

import ProtectedRoutes from './components/main/ProtectedRoutes.tsx';
import Login from './pages/Login.tsx';


import './pages/css/login.css'
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import Layout from './components/main/Layout.tsx';
import Missing from './pages/Missing.tsx';
import { OrdersProvider } from './hooks/useOrders.tsx';
import Customers from './pages/Customers.tsx';
import ConfirmAccount from './pages/ConfirmAccount.tsx';
import PersistLogin from './components/main/PersistLogin.tsx';




const App = () => {
  return (
    <>
      {/* {!isLoginPage  && <MainNavbar/>} */}
      
        <Routes>
          <Route path="/login" element={<Login  />} />
          

          <Route path='/' element={<Layout/>}>  
            {/* Public routes  */}
            {/* <Route path="/confirmAccount" element={<ConfirmAccount />} />/ */}
            <Route path="/" element={<Navigate to="login"/>} />
            



           
            {/* Private routes */}
            {/* <Route element={ <PersistLogin/> }>           */}
              <Route element={< ProtectedRoutes/> }>
                <Route path='/dashboard' element={ <Dashboard /> } />
                <Route path='/orders' element={ <Orders/> } />
                <Route path='/clients' element={<Customers />} />
                <Route path='/products' element={<Products />} />
                <Route path="/materials" element={<Materials />} />
              </Route>        
            {/* </Route> */}

          </Route>
  
          <Route path="*"  element={<Missing/>} />
            
        </Routes>
      

      
    </>
  );
};

export default App;




