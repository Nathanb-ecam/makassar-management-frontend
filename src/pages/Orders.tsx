import React from 'react';
import { useState,useEffect } from 'react';
import {Bag, Customer, Order, OrderEditableData} from '../models/entities.ts'


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
import { getBagsWithIds } from '../api/calls/Bag.tsx';
import { getAllCustomers, getCustomerById } from '../api/calls/Customer.tsx';

import BagCard from '../components/bags/BagCard.tsx';
import {putOrder, updateBagsForOrderWithId } from '../api/calls/Order.tsx';
import AddBagCard from '../components/bags/AddBagCard.tsx';
import { MdInfoOutline } from 'react-icons/md';
import OrderPrice from '../components/orders/OrderPrice.tsx';

import SectionTitle from '../components/main/SectionTitle.tsx'


const initialOrderEditableData: OrderEditableData = {
  totalPrice: '',         
  deliveryCost: '',       
  status: '',             
  description: '',        
  plannedDate: '',        
  bags: new Map<string, { bag: Bag, quantity: number }>(), 
};

const Orders = () => {

  
  const {auth} = useAuth()
  const { orders,  loading, error , refreshOrderById} = useOrdersContext();

  const [currentOrderHasBeenModified,setCurrentOrderHasBeenModified] = useState(false);
  
  const [rotatedRows, setRotatedRows] = useState<{ [key: number]: boolean }>({});

  
  const [currentOrderEditableData,setCurrentOrderEditableData] = useState<OrderEditableData | undefined>(initialOrderEditableData);
  
  const [customers, setCustomers] = useState<Customer[]>([]); 
  

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

  useEffect(() => {
    console.log('Updated currentOrderEditableData:', currentOrderEditableData);
  }, [currentOrderEditableData]);
  


  const removeBagFromOrder = (bag : Bag) => {
    console.log("received bag to remove", bag);

    setCurrentOrderEditableData(prev => {
      if (!prev) return prev;
      if(bag.id === undefined) return prev

      const updatedBags = new Map(prev.bags);
      updatedBags.delete(bag.id); 

      setCurrentOrderHasBeenModified(true)
      
      return {
        ...prev,
        bags: updatedBags
      };
    });
  }



  const applyOrderModifications = async (orderId) => {
      // use the currentOrderBagsWithQuantity to update the orders content as well as the other fields 
      
      const bagsIdsToQuantity = new Map();
        

      currentOrderEditableData?.bags.forEach(({bag,quantity},bagId)=>{
        bagsIdsToQuantity.set(bagId,quantity.toString())
      })

      const updateStatus = await updateBagsForOrderWithId(auth,orderId,bagsIdsToQuantity);
      refreshOrders(orderId);
      console.log(`succesfully update bags for order ${orderId} ? `,updateStatus)
  }  

  const refreshOrders = (orderId) => {
    refreshOrderById(auth,orderId)
  }


  const handleBagQuantityChange = (bag : Bag, newQuantity : number) => {


    setCurrentOrderEditableData((prev)=>{
      if(!prev) return prev
      if(bag.id === undefined) return prev

      const updatedMap = new Map(prev.bags);
      updatedMap.set(bag.id, {bag,quantity:newQuantity});
      setCurrentOrderHasBeenModified(true)

      return {
        ...prev,
        bags: updatedMap
      }
    })
  }

  const addBagToCurrentBags = (bag : Bag, quantity : number) => {
    if (bag.id === null || bag.id=== undefined) return console.log("bagId is null in 'addBagToCurrentBags'")

      setCurrentOrderEditableData((prev)=>{
      if (!prev) return prev
      if(bag.id === undefined) return prev

      const updated = new Map(prev.bags);
      
      if(updated.has(bag.id!!)){
          const existingBagQuantity = updated.get(bag.id)?.quantity ?? 0
          const newQ = Number(existingBagQuantity) + quantity
          updated.set(bag.id!!, {bag,quantity:newQ})
      }else{
          updated.set(bag.id!!, {bag,quantity})
      }
      setCurrentOrderHasBeenModified(true)
      return {
        ...prev,
        bags:updated
      }

    })
  }

  const addBagSelectionToCurrentBags = (bags: Map<string, {bag: Bag, quantity:number}>)=> {
    console.log('Final selection')
    console.log(bags)
    setCurrentOrderEditableData(prev=>{
      if(!prev) return prev

      const updated = new Map(currentOrderEditableData?.bags)

      bags.forEach(({bag,quantity},bagId)=>{
        if(updated.has(bagId)){
          const existingBagQuantity = updated.get(bagId)?.quantity ?? 0
          const newQ = Number(existingBagQuantity) + quantity
          updated.set(bagId,{bag,quantity:newQ})
        }else{
          updated.set(bagId,{bag,quantity})
        }
      })
      setCurrentOrderHasBeenModified(true)

      return {
        ...prev,
        bags: updated
      }


    }

    )


  }


  const handleClick = async (index: number,ord : Order) => {

    setCurrentOrderHasBeenModified(false)
    setCurrentOrderEditableData(prev => prev ? { ...prev, bags: new Map(), status:'' } : prev);
    

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
        console.log(resp)
        if(Array.isArray(resp.bags) && resp.bags.length!= 0){
          const newCurrentOrderBagsWithQuantity = new Map<string, { bag: Bag; quantity: number }>();
          console.log("not to bad")
          resp.bags.forEach((bag) => {
            const quantity = orderBags[bag.id]; 
            newCurrentOrderBagsWithQuantity.set(bag.id, { bag, quantity });
          });

          console.log(newCurrentOrderBagsWithQuantity)
          setCurrentOrderEditableData(prev => prev ? { ...prev, bags: newCurrentOrderBagsWithQuantity } : prev);
          // setCurrentOrderCopy(prev => prev ? { ...prev, bags: newCurrentOrderBagsWithQuantity } : prev);
          console.log('current', currentOrderEditableData)
        }else{
          console.log("No updated data for bags")
        }
      }else{
        setCurrentOrderEditableData(prev => prev ? { ...prev, bags: new Map() } : prev);
        
      }

    }

  };


  const handleOrderDataChange = async (orderId,key,newValue) => {
    const modifiedData = {[key]:newValue};
    console.log(modifiedData);
    const successfullyModifiedOrder = await putOrder(auth,orderId,modifiedData);
    console.log("successfullyModifiedOrder",successfullyModifiedOrder);
  }



  if (loading) return <p>Loading ...</p>
  if (error) return <p>{error}</p>

 
  const onCreateOrderButtonClicked = () => {

  }
  



  return (
    <div className="page">
        <div className="orders">
          <SectionTitle title='Commandes' onCreateButtonClicked={onCreateOrderButtonClicked}>

          </SectionTitle>

          { orders && orders.length != 0 ?
              
                <div className='orders-list'>
                  <div className='orders-header-row'>
                    <div>Client</div>
                    <div>TVA</div>
                    <div>Création</div>
                    <div>Modification</div>
                    <div>Status</div>
                    <div>Date prévue</div>
                    {/* <div>Description</div> */}

                    <div>Détails</div>

                  </div>
                  
                
                  { orders && Array.isArray(orders) && orders.map((order,index)=>{
                    const customer = customers.find(c => c.id === order.customerId)
                    return customer ? (    
            
                    <div className='customer-row' key={index}>
                      
                      <div className='customer-base-info'>       
                        <div>{customer.name }</div>
                        <div>{customer.tva }</div>
                        <div>{formatTime(order.createdAt)}</div>
                        <div>{formatTime(order.updatedAt)}</div>
                        <div 
                            className='order-status' 
                            contentEditable={true}
                            suppressContentEditableWarning={true} 
                            onBlur={(e) => handleOrderDataChange(order.id,"status", (e.target as HTMLElement).innerText)}
                            >
                            {order.status}
                        </div>
                        <div>{order.plannedDate? order.plannedDate : '/'}</div>
                        {/* <div>{order.description}</div> */}
                        <div onClick={() => handleClick(index,order)}>
                          <FaAngleLeft className='arrow-button'
                                  style={{
                          
                                    transform: rotatedRows[index] ? 'rotate(90deg)' : 'rotate(270deg)',
                                  
                                  }}
                          />
  
                        </div>
                      </div>

                      <div className={`order-details ${rotatedRows[index] ? 'expanded' : 'collapsed'}`}>
                          {customer ? 
                            <div className='customer-infos'>
                              <div className='title'>Coordonnées client</div>
                              <div className='customer-card'>
                                <div className='title'>{customer.name}</div>
                                <div className='phone'>{customer.phone}</div>
                                <div className='mail'>{customer.mail}</div>
                                <div>Adresse de livraison:</div>
                                <div className='shippingAddress'>{customer.shippingAddress?.address}, {customer.shippingAddress?.postalCode} {customer.shippingAddress?.country}</div>
                                <div>Siège social:</div>
                                <div className='professionalAddress'>{customer.professionalAddress?.address}, {customer.professionalAddress?.postalCode} {customer.professionalAddress?.country}</div>
                                
                                
                              </div>
                              {/* <div className='order-description'>{order.description ? <div> Description: {order.description}</div> : null}</div> */}
                            </div>
                            : <p>Customer not found</p>
                          }
  
  

                          <div className='bag-infos'>
                            {/* {JSON.stringify(order.bags)} */}
                            <div className='bags-section-title'>
                              <div className="left-title">
                                <div className='title'>Sacs</div>
                                <AddBagCard addBagsSelectionToCurrentBags={addBagSelectionToCurrentBags}/>
                              </div>
                              <button  
                                className={`button-apply-order-changes ${currentOrderHasBeenModified ? 'active' : ''}`}
                                onClick={() => applyOrderModifications(order.id)}>
                                    Appliquer les changements
                              </button>
                            </div>
                            <div className='bags-list'>   
                              {/* <AddBagCard addBagToCurrentBags={addBagToCurrentBags}/> */}
   
                              {currentOrderEditableData?.bags && currentOrderEditableData?.bags.size!=0 && Array.from(currentOrderEditableData?.bags.values()).map(({bag,quantity},index)=>(
                                                
                                  <BagCard key={index} bag={bag} initialQuantity={quantity} deleteBag={removeBagFromOrder} updateBagQuantity={handleBagQuantityChange} />
                              ))}
                            </div>
                          </div>

                          <div className="order-infos">
                            <div className='order-price-section'>
                                {currentOrderEditableData?.bags && <OrderPrice bags={currentOrderEditableData.bags} order={order} handleOrderDataChange={handleOrderDataChange}/>}                             
                            </div>

                            <div className='order-description'>
                              {order.description ? <div> Description: <br/>{order.description}</div> : null}
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


