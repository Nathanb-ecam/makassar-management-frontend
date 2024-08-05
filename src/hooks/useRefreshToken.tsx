import React from 'react'
import { useAuth } from './useAuth'
import axios from '../api/axios'

const useRefreshToken = () => {
  
    const {setAuth} = useAuth() 


    const refresh = async () => {
        try{
            const response = await axios.get('/refresh-token',{withCredentials:true })
            setAuth(prev=>{

                console.log("prev token",JSON.stringify(prev));
                console.log("new token ",response.data.accessToken);
                return {...prev, accessToken: response.data.accessToken}
            })
            return response.data.accessToken
            
        }catch(err){
            console.error(err)
    
        }
    }
    return refresh
}

export default useRefreshToken