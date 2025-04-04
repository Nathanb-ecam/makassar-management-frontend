import React from 'react'
import axios from '../axios'
import { Product, OrderFullyDetailed } from '../../models/entities'
import { processHttpError } from '../../utils/httpErros';

export const getOrders = async (auth) => {
    
    try{
        const response = await axios.get(`/${auth.tenantId}/orders`,{
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
        const response = await axios.post(`/${auth.tenantId}/orders`,
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
        const response = await axios.delete(`/${auth.tenantId}/orders/${id}`,{
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
        const response = await axios.get(`/${auth.tenantId}/orders-overviews`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        // console.log("Fetched orders: ",JSON.stringify(response?.data))
        if(Array.isArray(response.data)){
            return {"ordersArray":response.data}
        }else{
            return {"ordersArray":[] }
        }
    }catch(err){
        var errMsg = processHttpError('getOrders',err);
        return {"ordersArray" : [], "err": errMsg }
    }
}


export const putOrder = async (auth,orderId,dataObj) => {
    
    try{
        const response = await axios.put(`/${auth.tenantId}/orders/${orderId}`,
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



export const updateProductsForOrderWithId = async (auth,orderId,productIdsToQuantity: Map<string,string>) : Promise<boolean> => {
    try{
        const plainProductsIdsToQuantity = Object.fromEntries(productIdsToQuantity);
        console.log("DEBUG",plainProductsIdsToQuantity);
        const response = await axios.put(`/${auth.tenantId}/orders/${orderId}`,
        {"products":plainProductsIdsToQuantity},
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        
        )
        if (response.status == 200) return true  
        else false 
        // console.log(`Update Products for order: `,JSON.stringify(response?.data))
        
    }catch(err){
        var errMsg = processHttpError('updateProductsForOrderWithId',err);
        return false
    }
    return false

}



export const getOrderById = async (auth,orderId) => {
    
    try{
        const response = await axios.get(`/${auth.tenantId}/orders/${orderId}`,{
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
        const response = await axios.get(`/${auth.tenantId}/orders-overviews/${orderId}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        console.log("getOrderOverviewById order: ",JSON.stringify(response?.data))
        if(response?.status === 200)return {"order":response.data.order}
        return {"err":response?.status}
        
    }catch(err){
        var errMsg = processHttpError('getOrderOverviewById',err)
        return {"err":err,"errMsg" : errMsg }
    }
}

export const getOrderByIdWithCustomerDetailed = async (auth,orderId) => {
    
    try{
        const response = await axios.get(`/${auth.tenantId}/orders/${orderId}/customer-detailed`,{
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
        const response = await axios.get<OrderFullyDetailed>(`/${auth.tenantId}/orders/${orderId}/fully-detailed`,
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


export const addProductToOrder = async (auth,orderId,productId, quantity)=>{
    try{
        const response = await axios.get(`/${auth.tenantId}/orders/${orderId}/addProduct/${productId}/${quantity}`,{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        // console.log("Fetched orders: ",JSON.stringify(response?.data))
        if(response?.status === 200){
            console.log("Successfully added Product to order: ")
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