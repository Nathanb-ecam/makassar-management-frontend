import React from 'react'
import axios from '../axios'

export const getCustomerById = async (auth,customerId) => {
    
    try{
        const response = await axios.get(`/customers/${customerId}`,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )
        // setCustomer(response.data)
        console.log("Fetched customer: ",JSON.stringify(response?.data))
        return response.data
        
    }catch(err){
        if(!err?.response){
            console.error("Customer : No server response")
        }else if (err?.response.status === 400){
            console.error("Customer : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Customer : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return []
    }
}


export const getAllCustomers = async (auth) => {
    
    try{
        const response = await axios.get(`/customers`,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )
        // setCustomer(response.data)
        console.log("Fetched customers: ",JSON.stringify(response?.data))
        return response.data
        
    }catch(err){
        if(!err?.response){
            console.error("Customers : No server response")
        }else if (err?.response.status === 400){
            console.error("Customers : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Customers : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return []
    }
}




