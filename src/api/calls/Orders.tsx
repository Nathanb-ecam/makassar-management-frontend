import React from 'react'
import axios from '../axios'
import { Bag } from '../../models/entities'
import Orders from '../../pages/Orders';
import { processHttpError } from '../../utils/httpErros';

export const getOrders = async (auth) => {
    
    try{
        const response = await axios.get('/orders',{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        console.log("Fetched orders: ",JSON.stringify(response?.data))
        if(Array.isArray(response.data)){
            return {"ordersArray":response.data}
        }else{
            return {"ordersArray":[] , "err":"Response is not an array"}
        }
    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        return {"ordersArray" : [], "err": errMsg }
    }
}


export const updateBagsForOrderWithId = async (auth,orderId,bagIdsToQuantity: Map<string,string>) : Promise<boolean> => {
    try{
        const plainBagsIdsToQuantity = Object.fromEntries(bagIdsToQuantity);
        console.log("DEBUG",plainBagsIdsToQuantity);
        const response = await axios.put(`/orders/${orderId}`,
        {"bags":plainBagsIdsToQuantity},
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        
        )
        if (response.status == 200) return true  
        else false 
        // console.log(`Update bags for order: `,JSON.stringify(response?.data))
        
    }catch(err){
        var errMsg = processHttpError('updateBagsForOrderWithId',err);
        return false
    }
    return false

}



export const getOrderById = async (auth,orderId) => {
    
    try{
        const response = await axios.get(`/orders/${orderId}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        console.log("Fetched orders: ",JSON.stringify(response?.data))
        return {"order":response.data}
        
    }catch(err){
        var errMsg = processHttpError('getOrderById',err)
        return {"ordersArray" : [], "err" : errMsg }
    }
}


export const addBagToOrder = async (auth,orderId,bagId, quantity)=>{
    try{
        const response = await axios.get(`/orders/${orderId}/addBag/${bagId}/${quantity}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        // console.log("Fetched orders: ",JSON.stringify(response?.data))
        if(response?.status === 200){
            console.log("Successfully added bag to order: ")
            return true
        }else{
            return false
        }
        
    }catch(err){
        var errMsg = processHttpError('getOrderById',err)
        console.log(errMsg)
        return false
    }
}