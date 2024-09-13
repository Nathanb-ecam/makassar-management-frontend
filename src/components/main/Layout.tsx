import React from 'react'
import {Outlet } from 'react-router-dom'
import MainNavbar from './MainNavbar'

const Layout = () => {
    
  return (
    <>
      <MainNavbar/>
      <Outlet/>
    </>
  )
}

export default Layout