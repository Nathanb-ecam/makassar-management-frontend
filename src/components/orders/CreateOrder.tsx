import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { MdInfoOutline } from 'react-icons/md';
import { Product, Customer, Order, OrderDto, OrderEditableData } from '../../models/entities';


import '../css/create-order.css'

import { getAllCustomers } from '../../api/calls/Customer.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useTopMessage } from '../../hooks/useTopMessagePopup.tsx';
import ProductSelector from '../products/ProductSelector.tsx';


interface Props{
    handleOrderCreated: (order : OrderDto) => void;
}

interface productSeletorRef{
    getSelectionPrice: () => string;
}

const CreateOrder = ({handleOrderCreated} : Props) => {
    
    const {auth}:any = useAuth()
    const [customers, setCustomers] = useState<Customer[]>([]); 
    
    const productSelectorRef = useRef<productSeletorRef | null>(null)

    const {showTopMessage}:any = useTopMessage()

    const [productSelectionVisible,setproductSelectionVisible] = useState(false)
    const [estimatedPrice,setEstimatedPrice] = useState(0)
    const [totalPrice,setTotalPrice] = useState('')
    const [currentOrder,setCurrentOrder] = useState<OrderDto>({
        status: 'Opened',
        customerId:'',
        description:'',
        comments: '',
        createdLocation:'',
        price:{
            finalPrice:'',
            deliveryCost:'',
            discount:'',
            alreadyPaid:''
        },
        products: new Map(),
        plannedDate:'',
    })
    

    useEffect(()=>{
        console.log(currentOrder)
    },[currentOrder])


    useEffect(()=>{
  
        const fetchCustomers = async () => {
          try{
    
            const customers = await getAllCustomers(auth);
            setCustomers(customers)
          }catch(error){
            console.error(error)
          }
        }
        fetchCustomers()
      }
      ,[]);

    useEffect(()=>{

        const result = ((estimatedPrice * (1 - Number(currentOrder.price?.discount)))+ Number(currentOrder.price?.deliveryCost)).toFixed(2)
        
        setTotalPrice(result)
        handleDivChange('price.finalPrice',result)
    },[estimatedPrice,currentOrder.price?.deliveryCost,currentOrder.price?.discount])

    const handleDivChange = (itemKey :string, val :string) =>{
        const keys = itemKey.split('.')
    
        if(keys.length === 1 ){
            setCurrentOrder(prev => prev ? {...prev,[keys[0]]:val} : prev)                                    
            
        }else if(keys.length === 2 ){
            setCurrentOrder(prev => {
                if(!prev) return prev
    
                return {
                    ...prev,
                    [keys[0]]: {...prev[keys[0]], [keys[1]]: val}
                }
            })
        }else{
            console.log("case not handled yet")
            showTopMessage('An error occured',{backgroundColor:'var(--info-red)'})
        }
    }

    const handleElementChange = (e : React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) =>{
        const{name,value} = e.target
    
        var val : any = null
        if(name==='price.discount') val = (Number(value) / 100).toFixed(2)        
        else val = value

        const keys = name.split('.')
        if(keys.length ===1) setCurrentOrder(prev=> prev ? {...prev, [name]: val} : prev)
        else if(keys.length ===2) setCurrentOrder(prev=> prev ? {...prev, [keys[0]]: {...prev[keys[0]],[keys[1]]: val}} : prev)
        else console.log("case not handled in 'handleElementChange'")


    }

    const setproductsOfCurrentOrder = (products: Map<string, { product: Product; quantity: number; }>) => {
        setCurrentOrder(prev=>{
            if(!prev) return prev 
            
            const updated = new Map(prev.products)

            products.forEach(({product,quantity},productId)=>{
                if(quantity == 0){
                    updated.delete(productId)
                }else{
                    updated.set(productId,quantity.toString())
                }
            })
            return {...prev, products: updated}
        })

        if(productSelectorRef.current) {
            const estimated = productSelectorRef.current.getSelectionPrice()
            setEstimatedPrice(Number(estimated))
            
        }

    }

    const hanldeCreateOrder = (e : React.FormEvent<HTMLFormElement>) => {        
        e.preventDefault()
        if(currentOrder?.products?.size === 0){
            showTopMessage('An order needs to contain at least 1 product',{backgroundColor:'var(--info-orange)'})
            return 
        }
        if(currentOrder?.customerId?.length === 0){
            showTopMessage('An order needs to contain one client',{backgroundColor:'var(--info-orange)'})
            return 
        }
        handleOrderCreated(currentOrder)
    }

    return (
        <>
            { customers && customers.length > 0 &&
            <div className="create-order">
                <form onSubmit={hanldeCreateOrder}>

                    <div className="customer-selection create-order-field">
                        <label htmlFor="customer-select-id">Customer: </label>
                        <select 
                            name="customerId" id="customer-select-id"
                            onChange={handleElementChange}                            
                            required                
                        >
                            <option value="">Choose customer</option>
                            {customers instanceof Array && customers.map((customer,index)=>(
                                <option key={index} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                    </div>


                    <div className='create-order-field'>
                        <label htmlFor="">Location:</label>
                        <select                             
                            name="createdLocation" id="createdPlace"
                            onChange={handleElementChange}                                                   
                        >
                            <option value="">Pick location</option>
                            <option value="Salon Paris">Salon Paris</option>
                            <option value="Salon Tokyo">Salon Tokyo</option>
                        </select>
                    </div>
                    

                    <div className='create-order-field'>
                        <label htmlFor="planned-date">Planned date:</label>
                        <input 
                            className='planned-date'
                            id='planned-date'
                            name='plannedDate'
                            onChange={handleElementChange}                
                            placeholder="Ex: Late july"
                            type='text'             
                        />

                        
                    </div>

                    <div className='create-order-field'>
                        <label htmlFor="">Description:</label>
                        <textarea 
                            name="description"
                            id=""
                            onChange={handleElementChange}
                        >

                        </textarea>
                    </div>

                    <div className='create-order-field'>
                        <label htmlFor="">Comments:</label>
                        <textarea                     
                            name="comments"
                            onChange={handleElementChange} 
                            id=""                        
                        >
                        </textarea>
                    </div>

                    

                    


                    <div className='product-selection'>

                        <ProductSelector  
                        ref={productSelectorRef}
                        addProductsToCurrentProducts={setproductsOfCurrentOrder}
                        customProductSelectionWrapperCSS= {{}}
                        customButtonSectionStyle={{justifyContent:'center'}}
                        customSaveButtonStyle={{background:'white',color:'var(--info-green)'}}
                        >

                        </ProductSelector>

                        <div className='product-selection-price'>
                            <div className="product-selection-item base-price">
                                <label htmlFor="">Base price:(€)</label>
                                <div>
                                    {estimatedPrice.toString()}
                                </div>                             
                            </div>
                            <div className="product-selection-item discount">
                                <label htmlFor="">Discount:(%)</label>
                                <input               
                                    className='price-discount'
                                    name='price.discount'
                                    onChange={handleElementChange}   
                                    type='number'             
                                    placeholder="Ex: 12"
                                />
                            </div>
                            <div className="product-selection-item deliveryCosts">
                                <label htmlFor="">Delivery costs(€):</label>
                                <input               
                                    className='price-deliveryCost'
                                    name='price.deliveryCost'
                                    type='number'             
                                    onChange={handleElementChange}                
                                    placeholder="Ex: 35"
                                />
                            </div>
                            <div className='product-selection-item create-order-total-price'>
                                <label htmlFor="">Total price:</label>
                                <div>
                                        {   
                                            totalPrice
                                        }
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='confirm-order-create'>
                        <button type='submit'>
                            Create order
                        </button>
                    </div>
                </form>
            
            
            </div>
            }



        </>

  )
}

export default CreateOrder
