import React, { useEffect, useState, createContext, useContext } from 'react'
import { useAuth } from './useAuth'
import axios from '../api/axios'
import { Order, OrderOverview } from '../models/entities'
import { useLocation } from 'react-router-dom';
import { getOrderById, getOrders, getOverviewsOfOrders } from '../api/calls/Order';

interface OrdersContextType {
    ordersOverviews: OrderOverview[];
    loading: boolean;
    error: string | null;
    refreshOrders: (auth) => Promise<void>;
    refreshOrderById: (auth,orderId: string) => Promise<void>;
    removeOrderFromOrdersState: (orderId: string) =>void;
    modifyOrderFromOrdersState: (order: OrderOverview) =>void;
}


const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({children}) => {
  
    const {auth} = useAuth()
    const [ordersOverviews,setOrdersOverviews] = useState<Array<OrderOverview>>([]);
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
                const {ordersArray, err} = await getOverviewsOfOrders(auth)
                // console.log("DEB",ordersArray)
                if(err===undefined) setOrdersOverviews(ordersArray)
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
        if (['/orders' ].includes(location.pathname)) {
            fetchOrders()
        }
    },[auth?.accessToken,location ])
    // },[location.pathname,auth?.accessToken])
    

    const refreshOrderById = async (auth,orderId) => {
        const {order, err} = await getOrderById(auth,orderId)
        if (err=== undefined){
            setOrdersOverviews(prevOrders=>{
                const updatedOrders = prevOrders.map(o => 
                    o.id === orderId ? order : o
                )
                return updatedOrders
            }
                
            );
        }else{
            console.log(err);
        }       
    }

    const refreshOrders = async (auth) => {
        const {ordersArray, err} = await getOverviewsOfOrders(auth)
        if (err=== undefined){
            setOrdersOverviews(ordersArray);
        }else{
            console.log(err);
        }       
    }

    const removeOrderFromOrdersState = (orderId : string)=>{
        setOrdersOverviews(prev => {
            const updated = prev.filter(o => o.id !== orderId)
            return updated
            
        })
    }

    const modifyOrderFromOrdersState = (updatedOrder : OrderOverview) =>{
        setOrdersOverviews(prev => {
            // Map over the previous orders
            const updated = prev.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            );
            
            // Return the updated list of orders
            return updated;
          });
    }



    return (
        <OrdersContext.Provider value={{ordersOverviews,refreshOrders,removeOrderFromOrdersState,modifyOrderFromOrdersState, refreshOrderById,loading,error}}>
            {children}
        </OrdersContext.Provider>
    )
}

export const useOrdersContext = () => {
    const context = useContext(OrdersContext)

    if (context == undefined) throw new Error("useOrdersContext must be used within a OrdersProvider")

    return context
}
