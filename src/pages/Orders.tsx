import React, { useRef } from 'react';
import { useState,useEffect } from 'react';
import {Bag, BagWithQuantity, Customer, Order, OrderDto, OrderEditableData, OrderFullyDetailed, OrderOverview, Price} from '../models/entities.ts'


import {Table} from 'react-bootstrap'
import axios  from '../api/axios.ts';
import { useAuth } from '../hooks/useAuth.tsx';
import { formatTime } from '../utils/formatTime.tsx';


import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { FaAngleLeft, FaRegFilePdf } from "react-icons/fa6";
import { IconButton } from '@mui/material';
import { CiSquarePlus } from "react-icons/ci";

import "./css/orders.css"
import { useOrdersContext } from '../hooks/useOrders.tsx';
import { getBagsWithIds } from '../api/calls/Bag.tsx';
import { getAllCustomers, getCustomerById } from '../api/calls/Customer.tsx';

import BagCard from '../components/bags/BagCard.tsx';
import {createOrder, deleteOrderById, getOrderById, getOrderByIdWithCustomerDetailed, getOrderFullyDetailedById, putOrder, updateBagsForOrderWithId } from '../api/calls/Order.tsx';
import AddBagCard from '../components/bags/AddBagCard.tsx';
import { MdInfoOutline } from 'react-icons/md';

import SectionTitle from '../components/main/SectionTitle.tsx'
import { useTopMessage } from '../hooks/useTopMessagePopup.tsx';
import Popup from '../components/main/Popup.tsx';
import OrderPrice from '../components/orders/OrderPrice.tsx';
import CreateOrder from '../components/orders/CreateOrder.tsx';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { escape } from 'glob';
import { RiDeleteBin6Line } from 'react-icons/ri';


const initialOrderEditableData: OrderEditableData = {
  price: {finalPrice:'',alreadyPaid:'',deliveryCost:'',discount:''},             
  status: '',             
  createdLocation: '',             
  comments: '',             
  description: '',        
  plannedDate: '',        
  bags: new Map<string, { bag: Bag, quantity: number }>(), 
};


interface ChildPopupRef{
  hidePopup : () => void;
}

interface ChildOrderPriceRef{
  getCurrentPrice : () => Price;
}



const Orders = () => {

  
  const {auth} = useAuth()

  const bagSelectorChildPopup = useRef<ChildPopupRef | null>(null);
  const orderPriceRef = useRef<ChildOrderPriceRef | null>(null);

  const {showTopMessage} = useTopMessage()

  const { ordersOverviews,  loading, error , refreshOrders,removeOrderFromOrdersState,modifyOrderFromOrdersState,refreshOrderById} = useOrdersContext();

  const [currentOrderHasBeenModified,setCurrentOrderHasBeenModified] = useState(false);
  
  const [rotatedRows, setRotatedRows] = useState<{ [key: number]: boolean }>({});

  
  // const [currentOrderModifications,setCurrentOrderModifications] = useState<OrderEditableData | undefined>(initialOrderEditableData);
  const [currentOrderModifications,setCurrentOrderModifications] = useState({});
  

  const [currentOrder, setCurrentOrder] = useState<OrderFullyDetailed>({
    id: null,
    customer: {} as Customer, 
    orderNumber: null,
    createdLocation: null,
    status: null,
    description: null,
    comments: null,
    price: null,
    bags: new Map<string, BagWithQuantity>(), 
    plannedDate: null,
    createdAt: null,
    updatedAt: null,
  });
  

  const [createOrderVisible,setCreateOrderVisible] = useState(false)
  



  

  const removeBagFromOrder = (bag : Bag) => {
    console.log("received bag to remove", bag);

    setCurrentOrder(prev => {
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



  const applyOrderModifications = async (orderOverview :  OrderOverview) => {
      const cur = currentOrder
      console.log("applyModifications Input : ")      
      console.log(cur)      
      const price = recomputeOrderPrice()
      console.log("recomputed price", price)

      const bagIdToQmap = new Map<string,string>() 
      if(currentOrder?.bags){
        currentOrder?.bags.forEach((bagWithQ,bagId)=>{
          bagIdToQmap.set(bagWithQ.bag.id!!,bagWithQ.quantity.toString())
        })
      }
      

      // console.log("DEBUG")
      const { customer,id,createdAt,updatedAt, ...rest } = currentOrder;

      const modifiedOrder = {
        ...rest,
        price: price,
        customerId:currentOrder.customer.id,
        bags:Object.fromEntries(bagIdToQmap)
      }

      console.log("modifiedOrder",modifiedOrder)
      const updateStatus = await putOrder(auth,orderOverview.id,modifiedOrder);
      if(updateStatus){
        showTopMessage(`Modification(s) de la commande de '${orderOverview.customerName}' enregistrée(s) `, {backgroundColor:'var(--info-green)'})
        setCurrentOrderHasBeenModified(false)
        // modifyOrderFromOrdersState(modifiedOrder)
        refreshOrderById(auth,orderOverview.id!!)
        
      }else{
        showTopMessage(`Erreur lors de la sauvegarde des modifications `, {backgroundColor:'var(--info-red)'})  
      }
  }  


  const deleteOrderWithId = async (orderId : string) =>{
    if(orderId === null) return 

    const {id, err} = await deleteOrderById(auth,orderId)
    console.log(id)
    if(!err){
      showTopMessage(`Commande supprimée`, {backgroundColor:'var(--info-green)'})
      removeOrderFromOrdersState(orderId)
    }else{
      console.log("deleteOrderWithId",err)
    }

  }

  

  const recomputeOrderPrice = () =>{
      if (orderPriceRef.current){
        const price = orderPriceRef.current.getCurrentPrice()
        return price
      } return null
  }

  const handleBagQuantityChange = (bag : Bag, newQuantity : number) => {
    if(newQuantity === 0 ) return removeBagFromOrder(bag)
    setCurrentOrder((prev)=>{
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


  const addBagSelectionToCurrentBags = (bags: Map<string, BagWithQuantity>)=> {
    console.log('Final selection')
    console.log(bags)
    setCurrentOrder(prev=>{
      if(!prev) return prev

      const updated = new Map(prev.bags instanceof Map ? prev.bags : []);


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
      showTopMessage(`${bags.size} modèle(s) ajouté à la commande `, {backgroundColor:'var(--info-green)'})
      if(bagSelectorChildPopup.current) bagSelectorChildPopup.current.hidePopup()


      return {
        ...prev,
        bags: updated
      }
    })
  }


  const handleClick = async (index: number,ord : OrderOverview) => {

    setCurrentOrderHasBeenModified(false)
    setCurrentOrderModifications({});
    

    setRotatedRows(prevState => ({
      // ...prevState,
      [index]: !prevState[index]
    }));


    if (!rotatedRows[index]){
      // TODO : get the full order to be displayed in the dropdown section
      
      const result = await getOrderFullyDetailedById(auth,ord.id)
      
      
      if(result.err){
        console.log(result.err)
      }
      else{
        if(result.order){
          const order = result.order
          setCurrentOrder(prev => {
            if (!prev) return prev;
        
            // Convert the object to a Map if necessary
            const bagsAsMap = order.bags instanceof Map
                ? order.bags
                : new Map<string, { bag: Bag; quantity: number }>(
                    Object.entries(order.bags!!).map(([key, value]) => [key, value as BagWithQuantity])
                );
        
            // Use the updated `bagsAsMap` from the `result.order`
            console.log("WORKS FINE ?")
            return {
                ...order,
                bags: bagsAsMap
            };
        });
        
        }
      
  
      }
    } 

  };


  const handleOrderChangeInRowItems = async (orderId,key : string,newValue : any) => {
    const keys = key.split('.')
    var modifiedData: any = null
    if(keys.length === 1){
      modifiedData = {[key]:newValue};  
    }else if(keys.length === 2){
      modifiedData = {[keys[0]]:{[keys[1]]:newValue}};  
    }else{
      console.log("not handled")
    }

    // const modifiedData = {[key]:newValue};
    console.log(modifiedData);
    const successfullyModifiedOrder = await putOrder(auth,orderId,modifiedData);
    if(successfullyModifiedOrder) showTopMessage(`Commande modifiée`, {backgroundColor:'var(--info-green)'})
    else showTopMessage(`Les modifications n'ont pas pu être sauvegardées `, {backgroundColor:'var(--info-red)'})

    console.log("successfullyModifiedOrder",successfullyModifiedOrder);
  }

  const handleOrderPriceChange = ()=>{
    setCurrentOrderHasBeenModified(true)
    // console.log(currentOrder.price)
  }


  const handleNewOrderCreated = async (order : OrderDto) => {

      const bagsObject = Object.fromEntries(order.bags)
     
      const orderWithBagsObject = {
        ...order,
        bags: bagsObject,
      };
     
      const {id,err} = await createOrder(auth,orderWithBagsObject)
      
     if(!err){
      showTopMessage(`La commande a bien été crée`,{backgroundColor:'var(--info-green)'})
      refreshOrders(auth)
      setCreateOrderVisible(false)
      
     }
  }

  const generateOrderInvoice = (orderId : string)=>{
      console.log("generating pdf ... ")
  }

  if (loading) return <p>Loading ...</p>
  if (error) return <p>{error}</p>

 
  const onCreateOrderButtonClicked = () => {
      setCreateOrderVisible(true)
  }
  
  const onCreateOrderClosed = ()=>{
    setCreateOrderVisible(false)
  }




  return (
    <div className="page">

          {createOrderVisible && 
            <Popup 
              title='Prendre une nouvelle commande' 
              onPopupClose={onCreateOrderClosed} 
              customCSS={{
                // minHeight:'60%',
                
                maxHeight:'90%'
              }}
              >
                <CreateOrder handleOrderCreated={handleNewOrderCreated}>

                </CreateOrder>
            </Popup>}


        <div className="orders">
          <SectionTitle title='Commandes' onCreateButtonClicked={onCreateOrderButtonClicked}>

          </SectionTitle>


          { ordersOverviews && ordersOverviews.length != 0 ?
              
                <div className='orders-list'>
                  <div className='orders-header-row'>
                    <div className='small-col'>N°</div>
                    <div className='medium-col'>Client</div>
                    <div className='small-col'>Création</div>
                    <div className='small-col'>Modification</div>
                    <div className='medium-col'>Status</div>
                    <div className='medium-col'>Date prévue</div>
                    <div className='small-col'>Prix</div>
                    {/* <div>Description</div> */}

                    <div className='small-col'>Détails</div>
                    <div className='small-col'>Actions</div>

                  </div>
                  
                
                  { ordersOverviews && Array.isArray(ordersOverviews) && ordersOverviews.map((orderOverview,index)=>(
                  
                       
            
                    <div className='customer-row' key={index}>
                      
                      <div className='customer-base-info'>       
                        <div className='small-col'>{orderOverview.orderNumber }</div>
                        <div className='medium-col'>{orderOverview.customerName }</div>
                        <div className='small-col'>{formatTime(orderOverview.createdAt)}</div>
                        <div className='small-col'>{formatTime(orderOverview.updatedAt)}</div>
                        <div 
                            className='order-status medium-col' 
                            contentEditable={true}
                            suppressContentEditableWarning={true} 
                            onBlur={(e) => handleOrderChangeInRowItems(orderOverview.id,"status", (e.target as HTMLElement).innerText)}
                            >
                            {orderOverview.status}
                        </div>
                        <div                        
                        className='order-status medium-col' 
                        contentEditable={true}
                        suppressContentEditableWarning={true} 
                        onBlur={(e) => handleOrderChangeInRowItems(orderOverview.id,"plannedDate", (e.target as HTMLElement).innerText)}
                        >
                          {orderOverview.plannedDate ? orderOverview.plannedDate : ""}
                        </div>
                        <div
                          className='order-price small-col'
                          // contentEditable={true}
                          // suppressContentEditableWarning={true} 
                          // onBlur={(e) => handleOrderChangeInRowItems(orderOverview.id,"price.finalPrice", (e.target as HTMLElement).innerText)}
                        >
                          {Number(orderOverview.price?.finalPrice).toFixed(2)}
                        </div>
  
                        <div 
                        className='small-col'
                        onClick={() => handleClick(index,orderOverview)}
                        >
                            <FaAngleLeft className='arrow-button'
                                  style={{
                          
                                    transform: rotatedRows[index] ? 'rotate(90deg)' : 'rotate(270deg)',
                                  
                                  }}
                            /> 
                        </div>
                        <div className='actions-icons small-col'>
                                <RiDeleteBin6Line onClick={()=>deleteOrderWithId(orderOverview.id!!)}></RiDeleteBin6Line>
                                <FaRegFilePdf onClick={()=>generateOrderInvoice(orderOverview.id!!)} />
                        </div>
                      </div>

                      <div className={`order-details ${rotatedRows[index] ? 'expanded' : 'collapsed'}`}>
                          {currentOrder?.customer ? 
                            <div className='customer-infos'>
                              <div className='title'>Coordonnées client</div>
                              <div className='customer-card'>
                                <div className='title'>{currentOrder.customer.name}</div>
                                <div className='phone'>{currentOrder.customer.phone}</div>
                                <div className='mail'>{currentOrder.customer.mail}</div>
                                <div className='tva'>{currentOrder.customer.tva}</div>
                                <div>Adresse de livraison:</div>
                                <div className='shippingAddress'>{currentOrder.customer.shippingAddress?.address}, {currentOrder.customer.shippingAddress?.postalCode} {currentOrder.customer.shippingAddress?.country}</div>
                                <div>Délai prévu:</div>
                                <div>{currentOrder.plannedDate}</div>
                                {/* <div>
                                    <input 
                                    type="datetime-local" 
                                    name="plannedDate.best" id="best-delay"
                                    placeholder={currentOrder.plannedDate}  
                                    onChange={(e)=>handleChangeInOrderDetails(e)}
                                    />

                                    <input 
                                        type="datetime-local" 
                                        name="plannedDate.worst" id="worst-delay"
                                        placeholder={order?.plannedDate?.worst} 
                                        onChange={(e)=>handleChangeInOrderDetails(e)}
                                    />
                                </div> */}
                                <div>Siège social:</div>
                                <div className='professionalAddress'>{currentOrder.customer.professionalAddress?.address}, {currentOrder.customer.professionalAddress?.postalCode} {currentOrder.customer.professionalAddress?.country}</div>
                                
                                
                              </div>
                            </div>
                            : <p>Customer not found</p>
                          }
  
  

                          <div className='bag-infos'>
                            <div className='bags-section-title'>
                              <div className="left-title">
                                <div className='title'>Sacs</div>
                                <AddBagCard addBagsSelectionToCurrentBags={addBagSelectionToCurrentBags} ref={bagSelectorChildPopup}/>
                              </div>
                              <button  
                                className={`button-apply-order-changes ${currentOrderHasBeenModified ? 'active' : ''}`}
                                onClick={() => applyOrderModifications(orderOverview)}>
                                    Appliquer les changements
                              </button>
                            </div>
                            <div className='bags-list'>   
   
                                {/* {currentOrder?.bags instanceof Map && Array.from(currentOrder.bags.values()).map((bagWithQuantity, index) => ( */}
                                {currentOrder?.bags instanceof Map && Array.from(currentOrder.bags.values()).map((bagWithQuantity, index) => (
                                    <BagCard 
                                      key={index} 
                                      bag={bagWithQuantity.bag} 
                                      initialQuantity={bagWithQuantity.quantity} 
                                      onBagRemoved={removeBagFromOrder} 
                                      updateBagQuantity={handleBagQuantityChange} 
                                      deleteButtonVisible={true}
                                    />
                                  ))
                                }


                            </div>
                          </div>

                          <div className="order-infos">
                            <div className='order-price-section'>
                                {currentOrder?.bags && <OrderPrice ref={orderPriceRef} bags={currentOrder.bags} order={currentOrder} handleOrderPriceChange={handleOrderPriceChange}/>}                             
                            </div>

                            <div className='order-description'>
                              {currentOrder?.description ? <div> Description: <br/>{currentOrder?.description}</div> : null}
                            </div>
                          </div>

                      </div>

                    </div>
                    ))
                  }
    
                </div>
              
                : <p>Pas de commandes</p>
          }

        </div>
        
  </div>
  );
};

export default Orders;


