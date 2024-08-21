import React, { useEffect, useState, createContext, useContext } from 'react'
import { useAuth } from './useAuth'
import axios from '../api/axios'
import { Order } from '../models/entities'
import { useLocation } from 'react-router-dom';
import { getOrderById, getOrders } from '../api/calls/Orders';

interface OrdersContextType {
    orders: Order[];
    loading: boolean;
    error: string | null;
    fetchOrderById: (auth,orderId: string) => Promise<void>;
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
            setLoading(true);
            setError(null);
            
            if (!auth?.accessToken){
                setError("Unauthorized : missing accessToken")
                return
            }
                
            try{
                const {ordersArray, err} = await getOrders(auth)
                console.log("DEB",ordersArray)
                if(err===undefined) setOrders(ordersArray)
                else {
                    setError(err)
                    console.log(err)
                }
                
            }catch(err){
                console.error(err)
                setError(err)
                
            }finally{
                setLoading(false);
            }
            
                
            
            
        }
    
        // if (['/dashboard', '/orders', '/clients', '/bags'].includes(location.pathname)) {
        // if (['/orders' ].includes(location.pathname)) {
            fetchOrders()
        // }
    },[auth?.accessToken])
    // },[location.pathname,auth?.accessToken])
    

    const fetchOrderById = async (auth,orderId) => {
        const {order, err} = await getOrderById(auth,orderId)
        if (err=== undefined){
            setOrders(order);
        }else{
            console.log(err);
        }

            
    }



    return (
        <OrdersContext.Provider value={{orders,fetchOrderById,loading,error}}>
            {children}
        </OrdersContext.Provider>
    )
}

export const useOrdersContext = () => {
    const context = useContext(OrdersContext)

    if (context == undefined) throw new Error("useOrdersContext must be used within a OrdersProvider")

    return context
}
