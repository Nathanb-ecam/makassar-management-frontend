import React , { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect } from "react";


const ProtectedRoutes = () => {
    const {auth} = useAuth()
    const location = useLocation()

    return (
        auth?.user 
            ? <Outlet /> 
            : <Navigate to="/login" state={{from: location}} replace/>
         
    )
}

export default ProtectedRoutes