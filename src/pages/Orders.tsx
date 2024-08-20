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
import { getCustomerById } from '../api/calls/Customer.tsx';


const Orders = () => {
  
  const {auth} = useAuth()
  const { orders,  loading, error } = useOrdersContext();
  
  const [rotatedRows, setRotatedRows] = useState<{ [key: number]: boolean }>({});

  // const [bags, setBags] = useState<Bag[]>([]); 
  const [bagsWithQuantity, setBagsWithQuantity] = useState<Map<string, { bag: Bag; quantity: number }>>(new Map());

  const [customer, setCustomer] = useState<Customer>({}); 


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


      const customerId = currentOrder?.customerId
      console.log("customerId",customerId)
      if(customerId != customer.id){
        const resp = await getCustomerById(auth,customerId)
        setCustomer(resp)
      }

      

    }

  };

  if (loading) return <p>Loading ...</p>
  if (error) return <p>{error}</p>

  
  return (
    <div className="page">
        {/* {orders && JSON.stringify(orders, null, 2)} */}
        { orders && orders.length != 0 ?
             
              <div className='orders-list'>
                <div className='title-row'>
                  {/* <div>ClientId</div> */}
                  <div>Date de création</div>
                  <div>Dernière modification</div>
                  <div>Prix total</div>
                  <div>Date prévue</div>
                  <div>Description</div>

                  <div>Détails</div>

                </div>
                
              
                {orders.map((order,index)=>(    
                  <div className='customer-row' key={index}>
                    
                    <div className='customer-base-info'>       
                      {/* <div>{order.customerId}</div> */}
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
                        <div className='customer-infos'>
                          {customer 
                          ? <div className='customer-card'>
                              <h4>{customer.name} ({customer.shippingCountry})</h4>
                              <p>{customer.phone}</p>
                              <p>{customer.mail}</p>
                              <p>{customer.shippingAddress}</p>
                              <p>{customer.shippingPostalCode}</p>
                            </div>
                          : <div>Customer not found</div>
                          }
                        </div>

                        <div className='bag-infos'>
                          {/* {JSON.stringify(order.bags)} */}
                          {bagsWithQuantity && bagsWithQuantity.size!=0 && Array.from(bagsWithQuantity.values()).map(({bag,quantity},index)=>(
                          <div key={index} className='bag-item-card'>
                            <div>Modèle: {bag.marketingName}</div>
                            {bag.imageUrls?.map((imgUrl,index)=>(
                              <img className='bag-image' key={index} src={`http://localhost:8080/uploads/${imgUrl}`} alt={`${imgUrl}-${index}`} />
                            ))}
                            <div>Quantité: {quantity}</div>
                            <div>SKU: {bag.sku}</div>
                          </div>
                          ))}
                        </div>
        
                    </div>

                  </div>
                ))
                }
  
              </div>
            
              : <p>Pas de commandes</p>
        }


  </div>
  );
};

export default Orders;


