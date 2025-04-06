import React, { useRef } from 'react';
import { useState,useEffect } from 'react';
import {Product, ProductWithQuantity, Customer, Order, OrderDto, OrderEditableData, OrderFullyDetailed, OrderOverview, Price} from '../models/entities'


import { useAuth } from '../hooks/useAuth';
import { currentDate, formatTime } from '../utils/formatTime';


import { FaAngleLeft, FaRegFilePdf, FaUser } from "react-icons/fa6";


import "./css/orders.css"
import { useOrdersContext } from '../hooks/useOrders';

import ProductCard from '../components/products/ProductCard';
import {createOrder, deleteOrderById, getOrderFullyDetailedById, putOrder} from '../api/calls/Order';
import AddProductCard from '../components/products/AddProductCard';

import SectionTitle from '../components/main/SectionTitle'
import { useTopMessage } from '../hooks/useTopMessagePopup';
import Popup from '../components/main/Popup';
import OrderPrice from '../components/orders/OrderPrice';
import CreateOrder from '../components/orders/CreateOrder';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { handleFieldChange, processFieldChange } from '../utils/stateChange';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import OrderInvoiceTemplate from '../pdf/OrderInvoiceTemplate';
import { CiDeliveryTruck } from 'react-icons/ci';
import OrderCustomerInfos from '../components/orders/OrderCustomerInfos';
import OrderProductItem from '../components/orders/OrderProductItem';
import { MdModeEdit } from 'react-icons/md';
import ConfirmAction from '../components/main/ConfirmAction';
import ConfirmActionPopup from '../components/main/ConfirmActionPopup';


const initialOrderEditableData: OrderEditableData = {
  price: {finalPrice:'',alreadyPaid:'',deliveryCost:'',discount:''},             
  status: '',             
  createdLocation: '',             
  comments: '',             
  description: '',        
  plannedDate: '',        
  products: new Map<string, { product: Product, quantity: number }>(), 
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
  products: new Map<string, ProductWithQuantity>(), 
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


const orderStatuses = ["OPENED","IN PROGRESS" , "SHIPPED", "DELIVERED", "CANCELLED"];

const Orders = () => {

  
  const {auth}:any = useAuth()

  const productselectorChildPopup = useRef<ChildPopupRef | null>(null);
  const orderPriceRef = useRef<ChildOrderPriceRef | null>(null);

  
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  const {showTopMessage}:any = useTopMessage()

  const {ordersOverviews,  loading, error , refreshOrdersOverviews,removeOrderFromOrdersState,modifyOrderFromOrdersState,refreshOrderOverviewById} = useOrdersContext();

  const [currentOrderHasBeenModified,setCurrentOrderHasBeenModified] = useState(false);
  
  const [rotatedRows, setRotatedRows] = useState<{ [key: number]: boolean }>({});

  const [orderPriceDetailsExpanded, setOrderPriceDetailsExpanded] = useState(true);

  
  // const [currentOrderModifications,setCurrentOrderModifications] = useState<OrderEditableData | undefined>(initialOrderEditableData);
  // const [currentOrderModifications,setCurrentOrderModifications] = useState({});
  

  const [currentOrder, setCurrentOrder] = useState<OrderFullyDetailed>(currentOrderInitialisation);
  

  const [createOrderVisible,setCreateOrderVisible] = useState(false)
  const [confirmOrderDeletionPopupVisible,setConfirmOrderDeletionPopupVisible] = useState(false)
    
  const [refreshProductItems, setRefreshProductItems] = useState(false);

  useEffect(()=>{
    console.log(ordersOverviews)
  },[ordersOverviews])
  
  const removeProductFromOrder = (Product : Product) => {
    // console.log("received Product to remove", Product);

    setCurrentOrder(prev => {
      if (!prev) return prev;
      if(Product.id === undefined) return prev

      const updatedproducts = new Map(prev.products);
      updatedproducts.delete(Product.id); 

      setCurrentOrderHasBeenModified(true)
      
      return {
        ...prev,
        products: updatedproducts
      };
    });
  }



  const applyOrderModifications = async (orderOverview :  OrderOverview) => {
      const cur = currentOrder
      // console.log("applyModifications Input : ")      
      console.log(cur)      
      const price = recomputeOrderPrice()
      // console.log("recomputed price", price)

      const ProductIdToQmap = new Map<string,string>() 
      if(currentOrder?.products){
        currentOrder?.products.forEach((ProductWithQ,productId)=>{
          ProductIdToQmap.set(ProductWithQ.product.id!!,ProductWithQ.quantity.toString())
        })
      }
      

      // console.log("DEBUG")
      const { customer,id,createdAt,updatedAt, ...rest } = currentOrder;

      const modifiedOrder = {
        ...rest,
        price: price,
        customerId:currentOrder.customer.id,
        products:Object.fromEntries(ProductIdToQmap)
      }

      // console.log("modifiedOrder",modifiedOrder)
      const {err, errMsg} = await putOrder(auth,orderOverview.id,modifiedOrder);
      if(!err){
        showTopMessage(`Modification(s) of the order '${orderOverview.customerName}' saved`, {backgroundColor:'var(--info-green)'})
        setCurrentOrderHasBeenModified(false)
        refreshOrderOverviewById(auth,id!!)        
        orderOverview.price = price;
        // orderOverview.updatedAt = Date.now().toString();
        console.log("DEBYG" + Date.now().toString());
        modifyOrderFromOrdersState(orderOverview)           
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
        showTopMessage(`Error while saving order changes `, {backgroundColor:'var(--info-red)'})  
      }
  }  


  const deleteOrderWithId = async (orderId : string) =>{
    if(orderId === null) return 

    const {id, err} = await deleteOrderById(auth,orderId)
    // console.log(id)
    if(!err){
      showTopMessage(`Order successfuly removed`, {backgroundColor:'var(--info-green)'})
      removeOrderFromOrdersState(orderId)
    }else{
      // console.log("deleteOrderWithId",err)
    }
    setConfirmOrderDeletionPopupVisible(false)
  }
  

  const recomputeOrderPrice = () =>{
      if (orderPriceRef.current){
        const price = orderPriceRef.current.getCurrentPrice()
        return price
      } return null
  }

  const handleProductQuantityChange = (product : Product, newQuantity : number) => {
    if(newQuantity === 0 ) return removeProductFromOrder(product)
    setCurrentOrder((prev)=>{
      if(!prev) return prev
      if(product.id === undefined) return prev

      const updatedMap = new Map(prev.products);
      updatedMap.set(product.id, {product,quantity:newQuantity});
      setCurrentOrderHasBeenModified(true)

      return {
        ...prev,
        products: updatedMap
      }
    })
  }


  const addProductselectionToCurrentproducts = (products: Map<string, ProductWithQuantity>)=> {
    // console.log('Final selection')
    // console.log(products)
    setCurrentOrder(prev=>{
      if(!prev) return prev

      const updated = new Map(prev.products instanceof Map ? prev.products : []);


      products.forEach(({product,quantity},productId)=>{
        if(updated.has(productId)){
          const existingProductQuantity = updated.get(productId)?.quantity ?? 0
          const newQ = Number(existingProductQuantity) + quantity
          updated.set(productId,{product,quantity:newQ})
        }else{
          updated.set(productId,{product,quantity})
        }
      })
      setCurrentOrderHasBeenModified(true)
      showTopMessage(`${products.size} model(s) added to order`, {backgroundColor:'var(--info-green)'})
      if(productselectorChildPopup.current) productselectorChildPopup.current.hidePopup()


      // to refresh orderProductitems
      if(refreshProductItems === true) setRefreshProductItems(false)
      else setRefreshProductItems(false)

      return {
        ...prev,
        products: updated
      }
    })
  }


  const toggleOrderExpanded = async (index: number,ord : OrderOverview) => {

    setCurrentOrderHasBeenModified(false)
    
    // trigger recomposition of orderPrice component 
    if(orderPriceDetailsExpanded) setOrderPriceDetailsExpanded(false);
    else setOrderPriceDetailsExpanded(true);

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
        
            const productsAsMap = order.products instanceof Map
                ? order.products
                : new Map<string, { product: Product; quantity: number }>(
                    Object.entries(order.products!!).map(([key, value]) => [key, value as ProductWithQuantity])
            );
                    
            return {
                ...order,
                products: productsAsMap
            };
          });
        
        }
      
  
      }
    } 

  };


  const handleOrderChangeInRowItems = async (orderId,key : string,value : any) => {    
    const order = ordersOverviews.find(o => o.id === orderId)
    var {data,keys, err} = processFieldChange(order as Object,key,value)
    // const modifiedData = {[key]:newValue};
    // console.log(data,keys,err)
    if(err){
      showTopMessage(`Modifications couldn't be saved`, {backgroundColor:'var(--info-red)'})
      return
    } 

    // console.log(data);
    if(data){
      const successfullyModifiedOrder = await putOrder(auth,orderId,data);
      if(successfullyModifiedOrder) showTopMessage(`Order modified`, {backgroundColor:'var(--info-green)'})
      else showTopMessage(`Modifications could not be saved`, {backgroundColor:'var(--info-red)'})
    }
    // else{
    //   console.log("No changes")
    // }

    // console.log("successfullyModifiedOrder",successfullyModifiedOrder);
  }

  const handleOrderPriceChange = ()=>{
    setCurrentOrderHasBeenModified(true)
    // console.log(currentOrder.price)
  }


  const handleNewOrderCreated = async (order : OrderDto) => {

      const productsObject = order.products ? Object.fromEntries(order.products) : {};
     
      const orderWithproductsObject = {
        ...order,
        products: productsObject,
      };
     
      const {id,err} = await createOrder(auth,orderWithproductsObject)
      
     if(!err){
      showTopMessage(`Order successfuly created`,{backgroundColor:'var(--info-green)'})
      refreshOrdersOverviews(auth)
      setCreateOrderVisible(false)
      
     }
  }

  const generateAndDownloadOrderPdf = async () => {
    try {
      console.log("Generating PDF...");
      const doc = <OrderInvoiceTemplate user={auth.user} detailedOrder={currentOrder} />;
      const asPdf = pdf(); // Create an instance of the pdf function
      asPdf.updateContainer(doc); // Pass your document to the pdf instance

      const blob = await asPdf.toBlob(); // Convert the document to a Blob
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); // Create a URL for the Blob
      link.download = `${currentOrder.customer.name ?? "client"}-${currentOrder.orderNumber ?? 'XX'}.pdf`; // Set the file name
      link.click(); // Trigger the download
      URL.revokeObjectURL(link.href); // Clean up the URL object
      console.log("PDF generated and downloaded.");
    } catch (error) {
      console.error("Error generating PDF: ", error);
    }
  };

  const generateAndDownloadInvoice = async () => {
    // need to generate a pdf and sent it to the backend, by adding the path in a filesUrls
    
    try {
      console.log("Generating PDF...");
      const doc = <OrderInvoiceTemplate user={auth.user} detailedOrder={currentOrder} />;
      const asPdf = pdf(); // Create an instance of the pdf function
      asPdf.updateContainer(doc); // Pass your document to the pdf instance

      const blob = await asPdf.toBlob(); // Convert the document to a Blob
   
      console.log("PDF generated and downloaded.");
    } catch (error) {
      console.error("Error generating PDF: ", error);
    }
  };



 
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



  if (loading) return <p style={{textAlign:'center'}}>Chargement du contenu...</p>
  if (error) return <p style={{textAlign:'center'}}>Erreur:{error}</p>

  return (
    <div className="page">

          {createOrderVisible && 
            <Popup 
              title='Take a new order' 
              onPopupClose={onCreateOrderClosed} 
              customCSS={{
                // minHeight:'60%',
                width:'80vw',
                maxWidth:'1000px',
                maxHeight:'95vh'
              }}
              >
                <CreateOrder handleOrderCreated={handleNewOrderCreated}>

                </CreateOrder>
            </Popup>}


        <div className="orders">
          <SectionTitle 
              title='Orders' 
              newElementButtonText='New order'
              onCreateButtonClicked={onCreateOrderButtonClicked}>

          </SectionTitle>


          { ordersOverviews && ordersOverviews.length != 0 ?
              
                <div className='orders-list'>
                  <div className='orders-header-row'>
                    <div className='small-col'>N°</div>
                    <div className='medium-col'>Customer</div>
                    <div className='medium-col'>Creation</div>
                    <div className='medium-col'>Modification</div>
                    <div className='medium-col'>Planned date</div>
                    <div className='medium-col'>Status</div>
                    <div className='small-col'>Price</div>
                    <div className='small-col'>Details</div>
                    <div className='small-col'>Actions</div>

                  </div>
                  
                
                  { ordersOverviews && Array.isArray(ordersOverviews) && ordersOverviews.map((orderOverview,index)=>(
                  
                       
            
                    <div className='customer-row' key={index}>
                      
                      <div className='customer-base-info'>       
                        <div className='small-col'>{orderOverview.orderNumber }</div>
                        <div className='medium-col customer-name' title={`${orderOverview.customerName}`}>{orderOverview.customerName }</div>
                        <div className='medium-col'>{formatTime(orderOverview.createdAt)}</div>
                        <div className='medium-col'>{formatTime(orderOverview.updatedAt)}</div>
                        <div                        
                        className='medium-col editable-div' 
                        title={`${orderOverview.plannedDate}`}
                        contentEditable={true}
                        suppressContentEditableWarning={true} 
                        onBlur={(e) => handleOrderChangeInRowItems(orderOverview.id,"plannedDate", (e.target as HTMLElement).innerText)}
                        >
                          {orderOverview.plannedDate ? orderOverview.plannedDate : ""}
                        </div>
                        
                        {/* <div 
                            className='order-status medium-col editable-div' 
                            contentEditable={true}
                            suppressContentEditableWarning={true} 
                            onBlur={(e) => handleOrderChangeInRowItems(orderOverview.id,"status", (e.target as HTMLElement).innerText)}
                            >
                            {orderOverview.status}
                        </div> */}
                        <select                           
                          defaultValue={orderOverview.status}                          
                          className={`
                            order-status medium-col
                            ${["DELIVERED","CANCELLED"].includes(orderOverview.status ?? "") ? 'grey-option' :''}`
                          }
                          onChange={(e) => handleOrderChangeInRowItems(orderOverview.id, "status", e.target.value)}                                                    
                        >
                        {orderStatuses.map((status) => (                          
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>                            
                        ))}
                        </select>
                        

  
                        <div
                          className='order-price small-col'                          
                        >
                          {Number(orderOverview.price?.finalPrice).toFixed(2)}
                        </div>
  
                        <div 
                        className='small-col action-arrow'
                        onClick={() => toggleOrderExpanded(index,orderOverview)}
                        >
                            <FaAngleLeft className='arrow-button'
                                  style={{
                          
                                    transform: rotatedRows[index] ? 'rotate(90deg)' : 'rotate(270deg)',
                                  
                                  }}
                            /> 
                        </div>
                        <div className='actions-icons small-col'>
                                {/* <FaRegFilePdf id="generate-pdf" onClick={generateAndDownloadInvoice} /> */}
                                <button 
                                  onClick={()=> setConfirmOrderDeletionPopupVisible(true)}
                                  style={{color:'var(--info-red)',fontWeight:'400'}}
                                >
                                  Delete
                                </button>
                                {/* <RiDeleteBin6Line onClick={()=>deleteOrderWithId(orderOverview.id!!)} style={{color:'var(--info-red)'}}></RiDeleteBin6Line>                                 */}
                        </div>
                      </div>

                      {confirmOrderDeletionPopupVisible && 

                        <ConfirmActionPopup 
                          title='Are you sure you want to delete the order ?'
                          onConfirmActionPopupClosed={()=>setConfirmOrderDeletionPopupVisible(false)} 
                          onConfirm={() => deleteOrderWithId(orderOverview.id!!)} 
                          onCancel={() => setConfirmOrderDeletionPopupVisible(false)}
                          confirmText='Delete order'
                          confirmActionButtonStyles={{background:'var(--info-red)',borderRadius:'5px', color:'white'}}
                        />                        
                      }


                      <div className={`order-details ${rotatedRows[index] ? 'expanded' : 'collapsed'}`}>
                          
                          <OrderCustomerInfos customer={currentOrder.customer}/>    

                          <div className='product-infos'>

                            <div className='products-section-title'>
                              <div className="left-title">                                
                                  <div className='title'>Order items</div>
                                  <AddProductCard 
                                  customPopupCSS={{minWidth:'70vw'}}
                                  addProductsSelectionToCurrentProducts={addProductselectionToCurrentproducts} 
                                  ref={productselectorChildPopup}
                                  />                                
                              </div>
                              <button  
                                className={`button-apply-order-changes ${currentOrderHasBeenModified ? 'active' : ''}`}
                                onClick={() => applyOrderModifications(orderOverview)}>
                                    Apply changes
                              </button>
                            </div>

                            <div className='products-list'>     
                                {currentOrder?.products instanceof Map && Array.from(currentOrder.products.values()).map((ProductWithQuantity, index) => (                                    
                                    <OrderProductItem
                                      key={index} 
                                      product={ProductWithQuantity.product} 
                                      initialQuantity={ProductWithQuantity.quantity} 
                                      onProductRemoved={removeProductFromOrder} 
                                      updateProductQuantity={handleProductQuantityChange}                                       
                                    >

                                    </OrderProductItem>
                                  ))
                                }                                
                            </div>

                          </div>

                          <div className="order-infos">        


                          <div className='sale-invoice-wrapper'>
                              <button className="order-sale-btn" onClick={generateAndDownloadOrderPdf}>
                                  <label className='sale-label' htmlFor="generate-pdf">Sale order</label>                    
                                  <FaRegFilePdf id="generate-pdf" />                    
                              </button>                                                        

                              <button className="order-invoice-btn" onClick={generateAndDownloadInvoice}>
                                  <label className='invoice-label' htmlFor="generate-pdf">Invoice</label>                    
                                  <FaRegFilePdf id="generate-pdf" />                    
                              </button>                                                        
                            </div>

                            <div className='order-price-section'>
                                {currentOrder?.products && <OrderPrice                                           
                                                            key={`${orderOverview.id}-${orderPriceDetailsExpanded}`}
                                                            ref={orderPriceRef} 
                                                            products={currentOrder.products} 
                                                            order={currentOrder}                                                             
                                                            //detailsExpanded={orderPriceDetailsExpanded}
                                                            handleOrderPriceChange={handleOrderPriceChange}/>}                             
                            </div>
                            
                            
                          
                            <div className='order-description'>
                              <div>
                                <label>Description:</label>  
                                <MdModeEdit onClick={()=> focusDiv("description")} />                            
                              </div>
                              <div 
                              className='description-text'                              
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              ref={descriptionRef}
                              onBlur={(e)=> handleFieldChange(
                                              currentOrder,
                                              setCurrentOrder, 
                                              // currentOrder.id!!,
                                              "description", 
                                              (e.target as HTMLElement).innerText,
                                              setCurrentOrderHasBeenModified
                                            )}
                              >
                                {currentOrder.description}
                              </div>
                            </div>
                            
                            
                            
                            
                            <div className='order-comments'>
                              <div>
                                <label>Comments:</label>
                                <MdModeEdit onClick={()=> focusDiv("comments")}/>
                              </div>
                              <div 
                              className='comments-text'
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              ref={commentsRef}
                              onBlur={(e)=> handleFieldChange(
                                currentOrder,
                                setCurrentOrder, 
                                // currentOrder.id!!,
                                "comments", 
                                (e.target as HTMLElement).innerText,
                                setCurrentOrderHasBeenModified
                              )}                                  
                              >
                                {currentOrder.comments}
                              </div>
                            </div>
                            
                            

                          </div>

                      </div>

                    </div>
                    ))
                  }
    
                </div>
              
                : <p>No orders yet</p>
          }

        </div>
        
  </div>
  );
};

export default Orders;


