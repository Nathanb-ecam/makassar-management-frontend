import React, { useEffect, useState, createContext, useContext } from 'react'
import { useAuth } from './useAuth'
import axios from '../api/axios'
import { Order } from '../models/entities'
import { useLocation } from 'react-router-dom';

interface OrdersContextType {
    orders: Order[];
    loading: boolean;
    error: string | null;
}


const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({children}) => {
  
    const {auth} = useAuth()
    const [orders,setOrders] = useState<Array<Order>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const location = useLocation()


    useEffect(()=> {
        const fetchOrders = async () => {
            setLoading(false);
            setError(null);
            
            if (auth?.accessToken){
                try{
                    const response = await axios.get('/orders',{
                        headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
                        withCredentials:true }
                    )
                    // setOrders(response.data)
                    if(Array.isArray(response.data)){
                        setOrders(response.data)
                    }else{
                        console.log(response.data)
                    }
                    console.log("Orders",JSON.stringify(response?.data))
                }catch(err){
                    if(!err?.response){
                    console.log("Orders : No server response")
                    setError("Orders : No server response");
                    }else if (err?.response.status === 400){
                    console.log("Orders : Missing Username or password")
                        setError("Orders : Missing Username or password")
                    }
                    else if (err?.response.status === 401){
                    console.log("Orders : Unauthorized")
                    setError("Orders : Unauthorized")
                    }else{
                    console.log("Login failed")
                    setError("Login failed")
                    }
                }finally{
                    setLoading(false);
                }
            }else{
                console.log("useOrders couldn't refresh, missing accessToken")
            }
            
        }
    
        // if (['/dashboard', '/orders', '/clients', '/bags'].includes(location.pathname)) {
        // if (['/orders' ].includes(location.pathname)) {
            fetchOrders()
        // }
    },[auth?.accessToken])
    // },[location.pathname,auth?.accessToken])
    


    return (
        <OrdersContext.Provider value={{orders,loading,error}}>
            {children}
        </OrdersContext.Provider>
    )
}

export const useOrdersContext = () => {
    const context = useContext(OrdersContext)

    if (context == undefined) throw new Error("useOrdersContext must be used within a OrdersProvider")

    return context
}
