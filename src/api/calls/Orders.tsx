import React from 'react'
import axios from '../axios'
import { Bag } from '../../models/entities'

export const fetchOrders = async (auth) => {
    
    try{
        const response = await axios.get('/orders',{
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true }
        )
        // setOrders(response.data)
        console.log("Fetched orders: ",JSON.stringify(response?.data))
        if(Array.isArray(response.data)){
            return response.data
        }else{
            return []
        }
    }catch(err){
        if(!err?.response){
            console.error("Orders : No server response")
        }else if (err?.response.status === 400){
            console.error("Orders : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Orders : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return []
    }
}


export const updateBagsForOrderWithId = async (auth,orderId,bagIdsToQuantity: Map<string,string>) => {
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
        
        console.log(`Update bags for order: `,JSON.stringify(response?.data))
        
    }catch(err){
        if(!err?.response){
            console.error("Orders update bags : No server response")
        }else if (err?.response.status === 400){
            console.error("Orders update bags : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Orders update bags : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return []
    }

}