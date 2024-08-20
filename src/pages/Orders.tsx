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

import "./css/orders.css"
import { useOrdersContext } from '../hooks/useOrders.tsx';
import { getBagsWithIds } from '../api/calls/Bags.tsx';
import { getAllCustomers, getCustomerById } from '../api/calls/Customer.tsx';


const Orders = () => {
  
  const {auth} = useAuth()
  const { orders,  loading, error } = useOrdersContext();
  
  const [rotatedRows, setRotatedRows] = useState<{ [key: number]: boolean }>({});

  // const [bags, setBags] = useState<Bag[]>([]); 
  const [bagsWithQuantity, setBagsWithQuantity] = useState<Map<string, { bag: Bag; quantity: number }>>(new Map());

  // const [customer, setCustomer] = useState<Customer>({}); 
  const [customers, setCustomers] = useState<Customer[]>([]); 
  // const [customers, setCustomers] = useState<Map<string,{customer: Customer}>>(new Map()); 

  useEffect(()=>{

    const fetchCustomers = async () => {
      try{

        const customers = await getAllCustomers(auth);
        // const newCustomersIdMapped = new Map<string, {customer: Customer}>()
  
        // customers.forEach((cust) => {
        //   newCustomersIdMapped.set(cust.id,cust)
        // });
        // setCustomers(newCustomersIdMapped)
        setCustomers(customers)
        // console.log("deb", customers)
      }catch(error){
        console.error("deb",)
      }
    }
    fetchCustomers()
  }
  ,[]);



  const handleClick = async (index: number,ord : Order) => {
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
          const newBagsWithQuantity = new Map<string, { bag: Bag; quantity: number }>();

          resp.forEach((bag) => {
            const quantity = orderBags[bag.id]; // Assuming `orderBags` has bag IDs as keys and quantities as values
            newBagsWithQuantity.set(bag.id, { bag, quantity });
          });

          setBagsWithQuantity(newBagsWithQuantity);
        }else{
          console.log("No updated data for bags")
        }
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
            <h1 className="main-title">Mes commandes</h1>
            <button className='create-order-button'>Nouvelle commande</button>
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
                          {/* <IconButton
                            onClick={() => handleClick(index,order)}
                            style={{
                              transform: rotatedRows[index] ? 'rotate(90deg)' : 'rotate(180deg)',
                              transition: 'transform 0.5s',
                            }}
                          >
                            <ArrowRightIcon />
                          </IconButton> */}
                        </div>
                      </div>

                      <div className='order-details' style={{
                        display: rotatedRows[index] ? 'flex' : 'none',
                        }}>
                          {customer ? 
                            <div className='customer-infos'>
                              <h4 className='title'>Coordonnées client</h4>
                              <div className='customer-card'>
                                {/* <h4 className='title'>{customer.name  } ({customer.shippingCountry})</h4> */}
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
                            <h4 className='title'>Sacs</h4>
                            <div className='bags-list'>   
                              {bagsWithQuantity && bagsWithQuantity.size!=0 && Array.from(bagsWithQuantity.values()).map(({bag,quantity},index)=>(
                                                
                                  <div key={index} className='bag-item-card'>
                                    <div className="title">{bag.marketingName}</div>
                                    <div className='bags-carousel'>
                                      {bag.imageUrls?.map((imgUrl,index)=>(
                                        <img className='bag-image' key={index} src={`http://localhost:8080/uploads/${imgUrl}`} alt={`${imgUrl}-${index}`} />
                                      ))}
                                    </div>
                                    <div className='card-bottom-text'>
                                      <div className="left">
                                        <div>Quantité: {quantity}</div>
                                        <div>SKU: {bag.sku}</div>
                                      </div>
                                      <div className="right">
                                        <div>{bag.retailPrice}€</div>
                                      </div>
                                    </div>
                                  </div>
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


