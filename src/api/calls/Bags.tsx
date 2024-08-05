import React from 'react'
import axios from '../axios'

export const getBagsWithIds = async (auth,ids) => {
    
    try{
        const response = await axios.post('/bags/withIds',
        {
            "ids":ids
        },
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )
        // setBags(response.data)
        console.log("Fetched bags: ",JSON.stringify(response?.data))
        if(Array.isArray(response.data)){
            return response.data
        }else{
            return []
        }
    }catch(err){
        if(!err?.response){
            console.error("Bags : No server response")
        }else if (err?.response.status === 400){
            console.error("Bags : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Bags : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return []
    }
}



