import React , { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect } from "react";


const ProtectedRoutes = () => {
    const {auth}:any = useAuth()
    const location = useLocation()

    return (
        (auth?.accessToken && auth?.user)
            ? <Outlet /> 
            : auth === null
            ? <p>Loading...</p>
            : <Navigate to="/login" state={{ from: location }} replace />
            // ? <Outlet /> 
            // : <Navigate to="/login" state={{from: location}} replace/>
         
    )
}

export default ProtectedRoutes