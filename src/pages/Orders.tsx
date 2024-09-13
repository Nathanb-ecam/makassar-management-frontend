import React, { useRef } from 'react';
import { useState,useEffect } from 'react';
import {Bag, BagWithQuantity, Customer, Order, OrderDto, OrderEditableData, OrderFullyDetailed, OrderOverview, Price} from '../models/entities.ts'


import { useAuth } from '../hooks/useAuth.tsx';
import { formatTime } from '../utils/formatTime.tsx';


import { FaAngleLeft, FaRegFilePdf } from "react-icons/fa6";


import "./css/orders.css"
import { useOrdersContext } from '../hooks/useOrders.tsx';

import BagCard from '../components/bags/BagCard.tsx';
import {createOrder, deleteOrderById, getOrderFullyDetailedById, putOrder} from '../api/calls/Order.tsx';
import AddBagCard from '../components/bags/AddBagCard.tsx';

import SectionTitle from '../components/main/SectionTitle.tsx'
import { useTopMessage } from '../hooks/useTopMessagePopup.tsx';
import Popup from '../components/main/Popup.tsx';
import OrderPrice from '../components/orders/OrderPrice.tsx';
import CreateOrder from '../components/orders/CreateOrder.tsx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { handleFieldChange, processFieldChange } from '../utils/stateChange.tsx';


const initialOrderEditableData: OrderEditableData = {
  price: {finalPrice:'',alreadyPaid:'',deliveryCost:'',discount:''},             
  status: '',             
  createdLocation: '',             
  comments: '',             
  description: '',        
  plannedDate: '',        
  bags: new Map<string, { bag: Bag, quantity: number }>(), 
};

const currentOrderInitialisation = {
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
}


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

  
  const descriptionRef = useRef<string | null>(null);
  const commentsRef = useRef<string | null>(null);

  const {showTopMessage} = useTopMessage()

  const { ordersOverviews,  loading, error , refreshOrdersOverviews,removeOrderFromOrdersState,modifyOrderFromOrdersState,refreshOrderOverviewById} = useOrdersContext();

  const [currentOrderHasBeenModified,setCurrentOrderHasBeenModified] = useState(false);
  
  const [rotatedRows, setRotatedRows] = useState<{ [key: number]: boolean }>({});

  
  // const [currentOrderModifications,setCurrentOrderModifications] = useState<OrderEditableData | undefined>(initialOrderEditableData);
  // const [currentOrderModifications,setCurrentOrderModifications] = useState({});
  

  const [currentOrder, setCurrentOrder] = useState<OrderFullyDetailed>(currentOrderInitialisation);
  

  const [createOrderVisible,setCreateOrderVisible] = useState(false)

  
  

  useEffect(()=>{
    // console.log(currentOrder)
  },[currentOrder])

  

  const removeBagFromOrder = (bag : Bag) => {
    // console.log("received bag to remove", bag);

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
      // console.log("applyModifications Input : ")      
      console.log(cur)      
      const price = recomputeOrderPrice()
      // console.log("recomputed price", price)

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

      // console.log("modifiedOrder",modifiedOrder)
      const {err, errMsg} = await putOrder(auth,orderOverview.id,modifiedOrder);
      if(!err){
        showTopMessage(`Modification(s) de la commande de '${orderOverview.customerName}' enregistrée(s) `, {backgroundColor:'var(--info-green)'})
        setCurrentOrderHasBeenModified(false)
        refreshOrderOverviewById(auth,id!!)    
        setCurrentOrder(prev => {
          if (!prev) return prev;
                    
          return {
              ...rest,
              price,              
              customer,
              id,
              createdAt,
              updatedAt,
          };
      });    

        
      }else{
        showTopMessage(`Erreur lors de la sauvegarde des modifications `, {backgroundColor:'var(--info-red)'})  
      }
  }  


  const deleteOrderWithId = async (orderId : string) =>{
    if(orderId === null) return 

    const {id, err} = await deleteOrderById(auth,orderId)
    // console.log(id)
    if(!err){
      showTopMessage(`Commande supprimée`, {backgroundColor:'var(--info-green)'})
      removeOrderFromOrdersState(orderId)
    }else{
      // console.log("deleteOrderWithId",err)
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
    // console.log('Final selection')
    // console.log(bags)
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


  const toggleOrderExpanded = async (index: number,ord : OrderOverview) => {

    setCurrentOrderHasBeenModified(false)
    // setCurrentOrderModifications({});
    setCurrentOrder(currentOrderInitialisation)
    

    setRotatedRows(prevState => ({
      // ...prevState,
      [index]: !prevState[index]
    }));


    if (!rotatedRows[index]){      
      const result = await getOrderFullyDetailedById(auth,ord.id)
      
      
      if(result.err){
        console.log(result.err)
      }
      else{
        if(result.order){
          const order = result.order
          setCurrentOrder(prev => {
            if (!prev) return prev;
        
            const bagsAsMap = order.bags instanceof Map
                ? order.bags
                : new Map<string, { bag: Bag; quantity: number }>(
                    Object.entries(order.bags!!).map(([key, value]) => [key, value as BagWithQuantity])
                );
        
            
            return {
                ...order,
                bags: bagsAsMap
            };
        });
        
        }
      
  
      }
    } 

  };


  const handleOrderChangeInRowItems = async (orderId,key : string,value : any) => {

    var {data,keys, err} = processFieldChange(key,value)
    // const modifiedData = {[key]:newValue};
    if(err){
      showTopMessage(`Les modifications n'ont pas pu être sauvegardées `, {backgroundColor:'var(--info-red)'})
      return
    } 

    // console.log(data);
    const successfullyModifiedOrder = await putOrder(auth,orderId,data);
    if(successfullyModifiedOrder) showTopMessage(`Commande modifiée`, {backgroundColor:'var(--info-green)'})
    else showTopMessage(`Les modifications n'ont pas pu être sauvegardées `, {backgroundColor:'var(--info-red)'})

    // console.log("successfullyModifiedOrder",successfullyModifiedOrder);
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
      refreshOrdersOverviews(auth)
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

  const focusDiv = (divName : string) => {
    var ref : any = null
    if(divName === "description") ref  = descriptionRef
    else if (divName === "comments") ref = commentsRef

    if (ref.current) {
      ref.current.focus();
    }
  };





  return (
    <div className="page">

          {createOrderVisible && 
            <Popup 
              title='Prendre une nouvelle commande' 
              onPopupClose={onCreateOrderClosed} 
              customCSS={{
                // minHeight:'60%',
                
                maxHeight:'90vh'
              }}
              >
                <CreateOrder handleOrderCreated={handleNewOrderCreated}>

                </CreateOrder>
            </Popup>}


        <div className="orders">
          <SectionTitle 
              title='Commandes' 
              newElementButtonText='Nouvelle commande'
              onCreateButtonClicked={onCreateOrderButtonClicked}>

          </SectionTitle>


          { ordersOverviews && ordersOverviews.length != 0 ?
              
                <div className='orders-list'>
                  <div className='orders-header-row'>
                    <div className='small-col'>N°</div>
                    <div className='medium-col'>Client</div>
                    <div className='medium-col'>Création</div>
                    <div className='medium-col'>Modification</div>
                    <div className='medium-col'>Status</div>
                    <div className='medium-col'>Date prévue</div>
                    <div className='small-col'>Prix</div>
                    <div className='small-col'>Détails</div>
                    <div className='small-col'>Actions</div>

                  </div>
                  
                
                  { ordersOverviews && Array.isArray(ordersOverviews) && ordersOverviews.map((orderOverview,index)=>(
                  
                       
            
                    <div className='customer-row' key={index}>
                      
                      <div className='customer-base-info'>       
                        <div className='small-col'>{orderOverview.orderNumber }</div>
                        <div className='medium-col'>{orderOverview.customerName }</div>
                        <div className='medium-col'>{formatTime(orderOverview.createdAt)}</div>
                        <div className='medium-col'>{formatTime(orderOverview.updatedAt)}</div>
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
                        >
                          {Number(orderOverview.price?.finalPrice).toFixed(2)}
                        </div>
  
                        <div 
                        className='small-col'
                        onClick={() => toggleOrderExpanded(index,orderOverview)}
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
                              <div className='title'>Client</div>
                              <div className='customer-card'>
                                <div className='card-title'>{currentOrder.customer.name}</div>
                                {currentOrder.customer.phone && currentOrder.customer.phone?.length>0 && <div className='phone'>{currentOrder.customer.phone}</div>}
                                {currentOrder.customer.mail && currentOrder.customer.mail?.length>0 &&<div className='mail'>{currentOrder.customer.mail}</div>}
                                {currentOrder.customer.tva && currentOrder.customer.tva?.length>0 && <div className='tva'>Tva: {currentOrder.customer.tva}</div>}
                                {currentOrder.customer.shippingAddress &&                             
                                  <>
                                    <div>Adresse de livraison:</div>
                                    <div className='shippingAddress'>{currentOrder.customer.shippingAddress}</div>
                                  </>
                                }
                                {currentOrder.customer.professionalAddress &&
                                  <>
                                    <div>Adresse pro:</div>
                                    <div className='professionalAddress'>{currentOrder.customer.professionalAddress ?? "Non renseignée"}</div>
                                  </>
                                }
                                {currentOrder.plannedDate ? 
                                <div>Délai prévu:{currentOrder.plannedDate}</div>
                                : null
                                }
                                
                                
                              </div>
                            </div>
                            : <p>Customer not found</p>
                          }
  
  

                          <div className='bag-infos'>
                            <div className='bags-section-title'>
                              <div className="left-title">
                                <div className='title'>Produits</div>
                                <AddBagCard addBagsSelectionToCurrentBags={addBagSelectionToCurrentBags} ref={bagSelectorChildPopup}/>
                              </div>
                              <button  
                                className={`button-apply-order-changes ${currentOrderHasBeenModified ? 'active' : ''}`}
                                onClick={() => applyOrderModifications(orderOverview)}>
                                    Appliquer les changements
                              </button>
                            </div>
                            <div className='bags-list'>   
   
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
                                {currentOrder?.bags && <OrderPrice 
                                                            ref={orderPriceRef} 
                                                            bags={currentOrder.bags} 
                                                            order={currentOrder} 
                                                            handleOrderPriceChange={handleOrderPriceChange}/>}                             
                            </div>

                            
                            
                            <div className='order-description'>
                              <label onClick={()=> focusDiv("description")}>Description:</label>
                              <div 
                              className='description-text'
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              ref={descriptionRef}
                              onBlur={(e)=> handleFieldChange(
                                              currentOrder,
                                              setCurrentOrder, 
                                              currentOrder.id!!,
                                              "description", 
                                              (e.target as HTMLElement).innerText,
                                              setCurrentOrderHasBeenModified
                                            )}
                              >
                                {currentOrder?.description}
                              </div>
                            </div>
                            
                            
                            <div className='order-comments'>
                              <label onClick={()=> focusDiv("comments")}>Commentaires:</label>
                              <div 
                              className='comments-text'
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              ref={commentsRef}
                              onBlur={(e)=> handleFieldChange(
                                currentOrder,
                                setCurrentOrder, 
                                currentOrder.id!!,
                                "comments", 
                                (e.target as HTMLElement).innerText,
                                setCurrentOrderHasBeenModified
                              )}                                  
                              >
                                {currentOrder?.comments}
                              </div>
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


