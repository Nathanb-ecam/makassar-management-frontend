import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';

import './App.css'

import MainNavbar from './components/main/MainNavbar.tsx'
import Orders from './pages/Orders.tsx';
import Clients from './pages/Clients.tsx';
import Materials from './pages/Materials.tsx';
import Bags from './pages/Bags.tsx';
import Dashboard from './pages/Dashboard.tsx';

import ProtectedRoutes from './components/main/ProtectedRoutes.tsx';
import Login from './pages/Login.tsx';


import './pages/css/login.css'
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import Layout from './components/main/Layout.tsx';
import Missing from './pages/Missing.tsx';
import { OrdersProvider } from './hooks/useOrders.tsx';




const App = () => {

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';


  return (
    <>
      {/* {!isLoginPage  && <MainNavbar/>} */}
      
        <Routes>
          <Route path="/login" element={<Login  />} />
          
          <Route path='/' element={<Layout/>}>  
            {/* Public routes  */}
            <Route path="/" element={<Navigate to="login"/>} />
            <Route path="*"  element={<Missing/>} />

           
            {/* Private routes */}
            {/* <Route element={ <PersistLogin/> }> */}
          
              <Route element={< ProtectedRoutes/> }>
                <Route path='/dashboard' element={ <Dashboard /> } />
                <Route path='/orders' element={ <Orders/> } />
                <Route path='/clients' element={<Clients />} />
                <Route path='/bags' element={<Bags />} />
                <Route path="/materials" element={<Materials />} />
              </Route>
            
          </Route>

          {/* </Route> */}
  
            
        </Routes>
      

      
    </>
  );
};

export default App;




