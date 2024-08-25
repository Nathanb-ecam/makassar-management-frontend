import React from 'react'
import axios from '../axios'
import { Customer } from '../../models/entities'
import { processHttpError } from '../../utils/httpErros'

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
            console.error("Customer getCustomerById : No server response")
        }else if (err?.response.status === 400){
            console.error("Customer getCustomerById : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Customer getCustomerById : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return []
    }
}


export const  getAllCustomers = async (auth) => {
    
    try{
        const response = await axios.get<Customer[]>(`/customers`,
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
            console.error("Customers getAllCustomers : No server response")
        }else if (err?.response.status === 400){
            console.error("Customers getAllCustomers : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Customers getAllCustomers : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return []
    }
}


export const createCustomer = async (auth,customer)=>{
    try{
        const response = await axios.post(`/customers`,
        customer,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        }
        )
    
        if(response?.status === 201){
            console.log("Successfully created customer: ")
            return true
        }else{
            return false
        }
        
    }catch(err){
        var errMsg = processHttpError('createCustomer',err)
        console.log(errMsg)
        return false
    }
}


export const deleteCustomerWithId = async (auth,id) => {
    try{
        const response = await axios.delete(`/customers/${id}`,
        {
            headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
            withCredentials:true 
        },
        )
        if(response?.status === 200) return true
        else return false
        
        
    }catch(err){
        if(!err?.response){
            console.error("Customers deleteCustomerWithId : No server response")
        }else if (err?.response.status === 400){
            console.error("Customers deleteCustomerWithId : Missing Username or password")
        }
        else if (err?.response.status === 401){
            console.error("Customers deleteCustomerWithId : Unauthorized")
        }else{
            console.error("Login failed")
        }
        return false
    }
}
