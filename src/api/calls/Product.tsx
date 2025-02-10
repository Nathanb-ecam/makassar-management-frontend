import React from 'react'
import axios from '../axios'
import { processHttpError } from '../../utils/httpErros'
import { Product } from '../../models/entities'

export const getProductsWithIds = async (auth,ids: string[]) => {
    
    try{
        const response = await axios.post(`/${auth.tenantId}/products/withIds`,
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
                console.log("Fetched Products: ",JSON.stringify(response?.data))
                return {"products":response.data}
            }else{
                return null
            }
        }
    }catch(err){
        console.log(err)
        return null
    }
}

export const getProducts = async (auth) => {
    try{
        const response = await axios.get(`/${auth.tenantId}/products`,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )
        
        // console.log("Fetched Products: ",JSON.stringify(response?.data))
        if(Array.isArray(response.data)){
            return {"products":response.data}
        }else{
            return {"err":"Products is not an array"}
        }
    }catch(err){
        var msg = processHttpError("getProductsWithIds",err);
        return {"err" : msg}
    }
}


export const putProduct = async (auth,productId,dataObj) => {
    
    try{
        const response = await axios.put(`/${auth.tenantId}/products/${productId}`,
        dataObj,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        }
        )
        
        console.log("Modified Product: ",JSON.stringify(response?.data))
        if(response?.status === 200){
            return true
        }
        return false
    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        return false
    }
}


export const deleteProduct = async (auth,productId,imageUrls) => {
    
    try{
        const response = await axios.delete(`/${auth.tenantId}/products/${productId}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            data:{stringList:imageUrls},
            withCredentials:true 
        })
    
        if(response?.status === 200){
            console.log("Deleted Product: ",JSON.stringify(response?.data))
            return true
        }
        return false
    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        console.log(errMsg)
        return false
    }
}



export const createProductWithImages = async (auth, formData : FormData) : Promise<Product | null> =>{
    console.log("createProductWithImages" + auth.tenantId)
    try{
        const response = await axios.post(
            `/${auth.tenantId}/products/withImages`,
            formData,
            {
                headers: {'Content-type':'multipart/form-data','Authorization': `Bearer ${auth.accessToken}`},
                withCredentials:true 
            }
        )
        if(response?.status === 201){
            console.log(response)
            return response.data.product
        } 
        else return null

    }catch(err){
        var msg = processHttpError("getProductsWithIds",err);
        console.log(msg)
        return null
    }
}

