import React from 'react'
import axios from '../axios'
import { Bag, OrderFullyDetailed } from '../../models/entities'
import Orders from '../../pages/Orders';
import { processHttpError } from '../../utils/httpErros';

export const getOrders = async (auth) => {
    
    try{
        const response = await axios.get('/orders',{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        // console.log("Fetched orders: ",JSON.stringify(response?.data))
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


export const createOrder = async (auth,orderDto) => {
    
    try{
        const response = await axios.post('/orders',
        orderDto,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )

        if(response?.status === 201){
            return {"id":response.data.orderId}
        }else{
            return {"err":response.status.toString()}
        }

    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        return {"err": errMsg }
    }
}

export const deleteOrderById = async (auth,id) => {
    
    try{
        const response = await axios.delete(`/orders/${id}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )

    if(response?.status === 200){
        return {"id":response.data.orderId}
    }else{
        return {"err":response.status.toString()}
    }

    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        return {"err": errMsg }
    }
}


export const getOverviewsOfOrders = async(auth) => {
    try{
        const response = await axios.get('/orders-overviews',{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        // console.log("Fetched orders: ",JSON.stringify(response?.data))
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


export const putOrder = async (auth,orderId,dataObj) => {
    
    try{
        const response = await axios.put(`/orders/${orderId}`,
        dataObj,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        }
        )
        // setOrders(response.data)
        // console.log("Modified order: ",JSON.stringify(response?.data))
        if(response?.status === 200){
            return {"id": response.data.id}
        }
        return {"err" : response?.status}
    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        return {"err":err,"errMsg":errMsg}
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
        // console.log("Fetched order: ",JSON.stringify(response?.data))
        return {"order":response.data}
        
    }catch(err){
        var errMsg = processHttpError('getOrderById',err)
        return {"err" : errMsg }
    }
}

export const getOrderOverviewById = async (auth,orderId) => {
    
    try{
        const response = await axios.get(`/orders-overviews/${orderId}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        console.log("getOrderOverviewById order: ",JSON.stringify(response?.data))
        if(response?.status === 200)return {"order":response.data.order}
        return {"err":response?.status}
        
    }catch(err){
        var errMsg = processHttpError('getOrderById',err)
        return {"err":err,"errMsg" : errMsg }
    }
}

export const getOrderByIdWithCustomerDetailed = async (auth,orderId) => {
    
    try{
        const response = await axios.get(`/orders/${orderId}/customer-detailed`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // console.log("Fetched order: ",JSON.stringify(response?.data))
        return {"order":response.data}
        
    }catch(err){
        var errMsg = processHttpError('getOrderByIdWithCustomerDetailed',err)
        return {"err" : errMsg }
    }
}

export const getOrderFullyDetailedById = async (auth,orderId) => {
    try{
        const response = await axios.get<OrderFullyDetailed>(`/orders/${orderId}/fully-detailed`,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        }
        )
        // console.log("Fetched order: ",JSON.stringify(response?.data))
        return {"order":response.data}
        
    }catch(err){
        var errMsg = processHttpError('getOrderFullyDetailedById',err)
        return {"err" : errMsg }
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