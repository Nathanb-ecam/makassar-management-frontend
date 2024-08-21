import React from 'react';
import { useState,useEffect } from 'react';
import {Bag, Customer, Order} from '../models/entities.ts'


import {Table} from 'react-bootstrap'
import axios  from '../api/axios.ts';
import { useAuth } from '../hooks/useAuth.tsx';
import { formatTime } from '../utils/formatTime.tsx';


import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { FaAngleLeft } from "react-icons/fa6";
import { IconButton } from '@mui/material';
import { CiSquarePlus } from "react-icons/ci";

import "./css/orders.css"
import { useOrdersContext } from '../hooks/useOrders.tsx';
import { getBagsWithIds } from '../api/calls/Bags.tsx';
import { getAllCustomers, getCustomerById } from '../api/calls/Customer.tsx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import BagCard from '../components/bags/BagCard.tsx';
import {updateBagsForOrderWithId } from '../api/calls/Orders.tsx';
import AddBagCard from '../components/bags/AddBagCard.tsx';


const Orders = () => {
  
  const {auth} = useAuth()
  const { orders,  loading, error , fetchOrderById} = useOrdersContext();

  const [currentOrderHasBeenModified,setCurrentOrderHasBeenModified] = useState(false);
  
  const [rotatedRows, setRotatedRows] = useState<{ [key: number]: boolean }>({});

  // const [bags, setBags] = useState<Bag[]>([]); 
  const [currentBagsWithQuantity, setCurrentBagsWithQuantity] = useState<Map<string, { bag: Bag; quantity: number }>>(new Map());

  // const [customer, setCustomer] = useState<Customer>({}); 
  const [customers, setCustomers] = useState<Customer[]>([]); 
  // const [customers, setCustomers] = useState<Map<string,{customer: Customer}>>(new Map()); 

  useEffect(()=>{

    const fetchCustomers = async () => {
      try{

        const customers = await getAllCustomers(auth);
        setCustomers(customers)
      }catch(error){
        console.error("deb",)
      }
    }
    fetchCustomers()
  }
  ,[]);


  const removeBagFromOrder = (bag : Bag) => {
    console.log("received bag", bag);
    setCurrentBagsWithQuantity((prev)=>{
        const updatedMap = new Map(prev);
        updatedMap.delete(bag.id!!);
        setCurrentOrderHasBeenModified(true)
        return updatedMap
      }
    )
  }



  const applyOrderModifications = async (orderId) => {
      // use the currentBagsWithQuantity to update the orders content 
      
      const bagsIdsToQuantity = new Map();
        
      currentBagsWithQuantity.forEach(({bag,quantity},bagId)=>{
        bagsIdsToQuantity.set(bagId,quantity.toString())
        }
      )
      const updateStatus = await updateBagsForOrderWithId(auth,orderId,bagsIdsToQuantity);
      refreshOrders(orderId);
      console.log(`succesfully update bags for order ${orderId} ? `,updateStatus)
  }  

  const refreshOrders = (orderId) => {
    fetchOrderById(auth,orderId)
  }


  const handleBagQuantityChange = (bag : Bag, newQuantity : number) => {
      setCurrentBagsWithQuantity((prev)=>{
        // console.log("bag original quantity", prev)
        const updatedMap = new Map(prev);
        updatedMap.set(bag.id!!,{bag, "quantity": newQuantity});
        setCurrentOrderHasBeenModified(true)
        // console.log("bag quantity modified", updatedMap)
        return updatedMap
      }
    )
  }


  const handleClick = async (index: number,ord : Order) => {
    setCurrentOrderHasBeenModified(false)
    setCurrentBagsWithQuantity(new Map())
    
    setRotatedRows(prevState => ({
      // ...prevState,
      [index]: !prevState[index]
    }));

    if (!rotatedRows[index]){
      const currentOrder = orders?.find(o => o.id == ord.id)
      const orderBags = currentOrder?.bags

      console.log("orderbags",orderBags)
      const bagIds = orderBags ? Object.keys(orderBags) : [];
  
      
      if(bagIds.length > 0){
        console.log("New bags",bagIds)
        const resp = await getBagsWithIds(auth,bagIds)
        if(Array.isArray(resp) && resp.length!= 0){
          const newCurrentBagsWithQuantity = new Map<string, { bag: Bag; quantity: number }>();

          resp.forEach((bag) => {
            const quantity = orderBags[bag.id]; 
            newCurrentBagsWithQuantity.set(bag.id, { bag, quantity });
          });

          setCurrentBagsWithQuantity(newCurrentBagsWithQuantity);
        }else{
          console.log("No updated data for bags")
        }
      }else{
        setCurrentBagsWithQuantity(new Map())
      }

    }

  };

  if (loading) return <p>Loading ...</p>
  if (error) return <p>{error}</p>

 
  



  return (
    <div className="page">
        {/* {orders && JSON.stringify(orders, null, 2)} */}
        <div className="orders">
          <div className='title-section'>
            <h1 className="main-title">Commandes</h1>
            <button className='create-order-button'>
              {/* Nouvelle commande  */}
              <CiSquarePlus className='order-plus-button'/>
            </button>
          </div>
          { orders && orders.length != 0 ?
              
                <div className='orders-list'>
                  <div className='title-row'>
                    <div>Client</div>
                    <div>Date de création</div>
                    <div>Dernière modification</div>
                    <div>Prix total</div>
                    <div>Date prévue</div>
                    <div>Description</div>

                    <div>Détails</div>

                  </div>
                  
                
                  {orders.map((order,index)=>{
                    const customer = customers.find(c => c.id === order.customerId)
                    return customer ? (    
            
                    <div className='customer-row' key={index}>
                      
                      <div className='customer-base-info'>       
                        <div>{ customer.name }</div>
                        <div>{formatTime(order.createdAt)}</div>
                        <div>{formatTime(order.updatedAt)}</div>
                        <div>{order.totalPrice} €</div>
                        <div>{order.plannedDate? order.plannedDate : '/'}</div>
                        <div>{order.description}</div>
                        <div>
                          <FaAngleLeft className='arrow-button'
                                  onClick={() => handleClick(index,order)}
                                  style={{
                          
                                    transform: rotatedRows[index] ? 'rotate(90deg)' : 'rotate(270deg)',
                                  
                                  }}
                          />
  
                        </div>
                      </div>

                      <div className={`order-details ${rotatedRows[index] ? 'expanded' : 'collapsed'}`}>
                          {customer ? 
                            <div className='customer-infos'>
                              <h4 className='title'>Coordonnées client</h4>
                              <div className='customer-card'>
                                <div className='title'>{customer.name}</div>
                                <div className='phone'>{customer.phone}</div>
                                <div className='mail'>{customer.mail}</div>
                                <div className='shippingAddress'>{customer.shippingAddress}, {customer.shippingPostalCode} {customer.shippingCountry}</div>
                                
                              </div>
                              <div className='order-description'>{order.description ? <div> Description: {order.description}</div> : null}</div>
                            </div>
                            : <p>Customer not found</p>
                          }
  
  

                          <div className='bag-infos'>
                            {/* {JSON.stringify(order.bags)} */}
                            <div className='bags-section-title'>
                              <h4 className='title'>Sacs</h4>
                              <button 
                                className={`button-apply-order-changes ${currentOrderHasBeenModified ? 'active' : ''}`}
                                onClick={() => applyOrderModifications(order.id)}>
                                    Appliquer les changements
                              </button>
                            </div>
                            <div className='bags-list'>   
                              <AddBagCard orderId={order.id}/>
   
                              {currentBagsWithQuantity && currentBagsWithQuantity.size!=0 && Array.from(currentBagsWithQuantity.values()).map(({bag,quantity},index)=>(
                                                
                                  <BagCard key={index} bag={bag} initialQuantity={quantity} deleteBag={removeBagFromOrder} updateBagQuantity={handleBagQuantityChange} />
                              ))}
                            </div>
                          </div>
          
                      </div>

                    </div>
                    ) : null})
                  }
    
                </div>
              
                : <p>Pas de commandes</p>
          }

        </div>
        
  </div>
  );
};

export default Orders;


