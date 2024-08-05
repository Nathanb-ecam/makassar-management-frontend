import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'
import { Outlet } from 'react-router-dom'

const PersistLogin = () => {
  

    const [isLoading, setIsLoading] = useState(true)
    const {auth} = useAuth()
    const refresh = useRefreshToken()

    useEffect(() =>{
        const verifyRefreshToken = async () => {
            try{
                await refresh()
            }catch(err){
                console.error(err)
            }finally{
                setIsLoading(false)
            }
        }    

        auth?.accessToken ? setIsLoading(false) : verifyRefreshToken()
    },[])

    useEffect(()=>{
        console.log(`isLoading: ${isLoading}`)
        console.log(`auth: ${auth?.user}, ${auth?.accessToken}`)
    },[])
    
    return (
    <>
        {
        isLoading 
                ? <p>Loading ... </p>
                : <Outlet/>

            }
    </>
  )
}

export default PersistLogin