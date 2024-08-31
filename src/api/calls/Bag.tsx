import React from 'react'
import axios from '../axios'
import { processHttpError } from '../../utils/httpErros'
import { Bag } from '../../models/entities'

export const getBagsWithIds = async (auth,ids: string[]) => {
    
    try{
        const response = await axios.post('/bags/withIds',
        {
            stringList:ids
        },
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )
        if(response?.status === 200){
            if(Array.isArray(response.data)){
                console.log("Fetched bags: ",JSON.stringify(response?.data))
                return {"bags":response.data}
            }else{
                return null
            }
        }
    }catch(err){
        console.log(err)
        return null
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
        
        // console.log("Fetched bags: ",JSON.stringify(response?.data))
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


export const putBag = async (auth,bagId,dataObj) => {
    
    try{
        const response = await axios.put(`/bags/${bagId}`,
        dataObj,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        }
        )
        
        console.log("Modified bag: ",JSON.stringify(response?.data))
        if(response?.status === 200){
            return true
        }
        return false
    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        return false
    }
}


export const deleteBag = async (auth,bagId,imageUrls) => {
    
    try{
        const response = await axios.delete(`/bags/${bagId}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            data:{stringList:imageUrls},
            withCredentials:true 
        })
    
        if(response?.status === 200){
            console.log("Deleted bag: ",JSON.stringify(response?.data))
            return true
        }
        return false
    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        console.log(errMsg)
        return false
    }
}



export const createBagWithImages = async (auth, formData : FormData) : Promise<Bag | null> =>{
    try{
        const response = await axios.post(
            '/bags/withImages',
            formData,
            {
                headers: {'Content-type':'multipart/form-data','Authorization': `Bearer ${auth.accessToken}`},
                withCredentials:true 
            }
        )
        if(response?.status === 201){
            console.log(response)
            return response.data.bag
        } 
        else return null

    }catch(err){
        var msg = processHttpError("getBagsWithIds",err);
        console.log(msg)
        return null
    }
}

