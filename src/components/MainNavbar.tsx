import React, { useState } from 'react';
import { Navbar,Container,Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


import './css/navbar.css'




const MainNavbar = () => {
  
  const [visibleNavbar,setVisibleNavbar] = useState(true)
  
  const navigate = useNavigate()
  
  const navigateTo = (path) => {
    setVisibleNavbar(false)
    navigate(path)
    
  }

  const toggleNavbarVisibility = () =>{
    console.log("clicked",visibleNavbar)
    setVisibleNavbar(prev=>!prev)
    
    
  }
  
  return (
    <>
       
     
    <button className="button-logo" onClick={toggleNavbarVisibility} >
      <img className='button-logo-img' src="/src/assets/logo.png" alt="logo makassar" />
    </button>

  
    {/* <div className="navbar "  style={{display:visibleNavbar? 'block':'none', transition:'translate 1s'}}>     */}
    <div className={`navbar ${visibleNavbar ? 'visible':'hidden'}`}>    
      <ul>
        <li><button className="nav-button" onClick={(e)=>navigateTo("/dashboard")}>Dashboard</button></li>
        <li><button className="nav-button" onClick={(e)=>navigateTo("/orders")}>Orders</button></li>
        <li><button className="nav-button" onClick={(e)=>navigateTo("/clients")}>Clients</button></li>
        <li><button className="nav-button" onClick={(e)=>navigateTo("/bags")}>Sacs</button></li>
        
        <li>
          <button className="nav-button" onClick={(e)=>navigateTo("/materials")}>Matières</button>
          <ul className='subLinks'>
            <li><button className="nav-sub-button" onClick={(e)=>navigateTo("/materials#colors")}>Couleurs</button></li>
            <li><button className="nav-sub-button" onClick={(e)=>navigateTo("/materials#types")}>Types</button></li>
            
          </ul>
        
        </li>
      </ul>
      <button className='fast-order'>Commande rapide</button>
    </div>
       
       
    </>
  );
};

export default MainNavbar;


