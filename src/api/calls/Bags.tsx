import React from 'react'
import axios from '../axios'
import { processHttpError } from '../../utils/httpErros'

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
            return {"bags":response.data}
        }else{
            return {"err":"Bags is not an array"}
        }
    }catch(err){
        var msg = processHttpError("getBagsWithIds",err);
        return {"err" : msg}
    }
}

export const getBags = async (auth) => {
    try{
        const response = await axios.get('/bags',
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )
        
        console.log("Fetched bags: ",JSON.stringify(response?.data))
        if(Array.isArray(response.data)){
            return {"bags":response.data}
        }else{
            return {"err":"Bags is not an array"}
        }
    }catch(err){
        var msg = processHttpError("getBagsWithIds",err);
        return {"err" : msg}
    }
}



