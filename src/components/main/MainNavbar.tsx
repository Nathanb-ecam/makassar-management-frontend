import React, { useRef, useState } from 'react';
import { Navbar,Container,Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


import '../css/navbar.css'


import { IoColorPalette } from "react-icons/io5";
import { FaHouse,FaRegPenToSquare,FaBagShopping,FaPerson, FaAngleLeft } from 'react-icons/fa6';
import { IoMdClose, IoMdHome } from 'react-icons/io';
import { MdAccountCircle, MdDashboard } from 'react-icons/md';



const MainNavbar = () => {
  
  const [visibleNavbar,setVisibleNavbar] = useState(false)
  const [selectedItem,setSelectedItem] = useState('')

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  
  const navigate = useNavigate()
  
  const navigateTo = (path,item) => {
    setVisibleNavbar(false)
    setSelectedItem(item)
    navigate(path)
    
  }

  const toggleNavbarVisibility = () =>{
    // console.log("clicked",visibleNavbar)
    setVisibleNavbar(prev=>!prev)        
  }

   // Handle hover enter (start timeout)
   const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setVisibleNavbar(true);
    }, 300); // Adjust delay (in milliseconds)
  };

  // Handle hover leave (cancel timeout if not yet executed)
  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }    
  };
  
  return (
    <>
       

       <div        
        className="hover-area"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
  
  
    {/* <div className="navbar "  style={{display:visibleNavbar? 'block':'none', transition:'translate 1s'}}>     */}
    <div className={`navbar ${visibleNavbar ? 'visible':'hidden'}`}>    
      <IoMdClose className='close-navbar-btn' onClick={()=>setVisibleNavbar(false)}/>
      <ul>
        {/* <li className={`nav-li-item ${selectedItem === "dashboard" ? "selected" : "" }`} onClick={(e)=>navigateTo("/dashboard","dashboard")}>
          <FaHouse className='nav-icons'/>
          <button className="nav-button" >Dashboard</button>
        </li> */}
        <li className={`nav-li-item ${selectedItem === "dashboard" ? "selected" : "" }`} onClick={(e)=>navigateTo("/dashboard","dashboard")}>
          <IoMdHome className='nav-icons'/>          
          <button className="nav-button" >Home</button>
        </li>
        <li className={`nav-li-item ${selectedItem === "orders" ? "selected" : "" }`} onClick={(e)=>navigateTo("/orders","orders")}>
          <FaRegPenToSquare className='nav-icons' />
          <button className="nav-button" >Orders</button>
        </li>
        <li className={`nav-li-item ${selectedItem === "clients" ? "selected" : "" }`} onClick={(e)=>navigateTo("/clients","clients")}>
          <FaPerson className='nav-icons'/>
          <button className="nav-button" >Clients</button>
        </li>
        <li className={`nav-li-item ${selectedItem === "products" ? "selected" : "" }`} onClick={(e)=>navigateTo("/products","products")}>
          <FaBagShopping className='nav-icons'/>
          <button className="nav-button" >Products</button>
        </li>
        <li className={`nav-li-item ${selectedItem === "account" ? "selected" : "" }`} onClick={(e)=>navigateTo("/account","account")}>
          <MdAccountCircle className='nav-icons'/>
          <button className="nav-button" >Account</button>
        </li>
        
        {/* <li className={`nav-li-item ${selectedItem === "materials" ? "selected" : "" }`} onClick={(e)=>navigateTo("/materials","materials")}>
          <div></div>
        </li>
        <li className={`nav-li-item ${selectedItem === "material-colors" ? "selected" : "" }`}  onClick={(e)=>navigateTo("/materials#colors","material-colors")}>
          <IoColorPalette className='nav-icons' />
          <button className="nav-sub-button" >Couleurs</button>
        </li> */}
      </ul>
      <button className='fast-order'>Quick order</button>
    
   
        <FaAngleLeft
        className={`arrow-logo`}    
        onClick={toggleNavbarVisibility} 
        >

        </FaAngleLeft>

    </div>
       
       
    </>
  );
};

export default MainNavbar;


