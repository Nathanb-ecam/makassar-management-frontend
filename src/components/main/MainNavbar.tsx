import React, { useState } from 'react';
import { Navbar,Container,Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


import '../css/navbar.css'


import { IoColorPalette } from "react-icons/io5";
import { FaHouse,FaRegPenToSquare,FaBagShopping,FaPerson, FaAngleLeft } from 'react-icons/fa6';



const MainNavbar = () => {
  
  const [visibleNavbar,setVisibleNavbar] = useState(true)
  const [selectedItem,setSelectedItem] = useState('')
  
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
  
  return (
    <>
       
  
  
    {/* <div className="navbar "  style={{display:visibleNavbar? 'block':'none', transition:'translate 1s'}}>     */}
    <div className={`navbar ${visibleNavbar ? 'visible':'hidden'}`}>    
      
      <ul>
        {/* <li className={`nav-li-item ${selectedItem === "dashboard" ? "selected" : "" }`} onClick={(e)=>navigateTo("/dashboard","dashboard")}>
          <FaHouse className='nav-icons'/>
          <button className="nav-button" >Dashboard</button>
        </li> */}
        <li className={`nav-li-item ${selectedItem === "orders" ? "selected" : "" }`} onClick={(e)=>navigateTo("/orders","orders")}>
          <FaRegPenToSquare className='nav-icons' />
          <button className="nav-button" >Commandes</button>
        </li>
        <li className={`nav-li-item ${selectedItem === "clients" ? "selected" : "" }`} onClick={(e)=>navigateTo("/clients","clients")}>
          <FaPerson className='nav-icons'/>
          <button className="nav-button" >Clients</button>
        </li>
        <li className={`nav-li-item ${selectedItem === "bags" ? "selected" : "" }`} onClick={(e)=>navigateTo("/bags","bags")}>
          <FaBagShopping className='nav-icons'/>
          <button className="nav-button" >Sacs</button>
        </li>
        
        {/* <li className={`nav-li-item ${selectedItem === "materials" ? "selected" : "" }`} onClick={(e)=>navigateTo("/materials","materials")}>
          <div></div>
        </li>
        <li className={`nav-li-item ${selectedItem === "material-colors" ? "selected" : "" }`}  onClick={(e)=>navigateTo("/materials#colors","material-colors")}>
          <IoColorPalette className='nav-icons' />
          <button className="nav-sub-button" >Couleurs</button>
        </li> */}
      </ul>
      <button className='fast-order'>Commande rapide</button>
    
   
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


