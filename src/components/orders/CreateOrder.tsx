import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { MdInfoOutline } from 'react-icons/md';
import { Bag, Customer, Order, OrderDto, OrderEditableData } from '../../models/entities';


import '../css/create-order.css'
import BagSelector from '../bags/BagSelector.tsx';
import { getAllCustomers } from '../../api/calls/Customer.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useTopMessage } from '../../hooks/useTopMessagePopup.tsx';


interface Props{
    handleOrderCreated: (order : OrderDto) => void;
}

interface BagSeletorRef{
    getSelectionPrice: () => string;
}

const CreateOrder = ({handleOrderCreated} : Props) => {
    
    const {auth} = useAuth()
    const [customers, setCustomers] = useState<Customer[]>([]); 
    
    const bagSelectorRef = useRef<BagSeletorRef | null>(null)

    const {showTopMessage} = useTopMessage()

    const [bagSelectionVisible,setBagSelectionVisible] = useState(false)
    const [estimatedPrice,setEstimatedPrice] = useState(0)
    const [totalPrice,setTotalPrice] = useState('')
    const [currentOrder,setCurrentOrder] = useState<OrderDto>({
        status: 'Ouverte',
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
        bags: new Map(),
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
            showTopMessage('Un erreur est survenue',{backgroundColor:'var(--info-red)'})
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

    const setBagsOfCurrentOrder = (bags: Map<string, { bag: Bag; quantity: number; }>) => {
        setCurrentOrder(prev=>{
            if(!prev) return prev 
            
            const updated = new Map(prev.bags)

            bags.forEach(({bag,quantity},bagId)=>{
                if(quantity == 0){
                    updated.delete(bagId)
                }else{
                    updated.set(bagId,quantity.toString())
                }
            })
            return {...prev, bags: updated}
        })

        if(bagSelectorRef.current) {
            const estimated = bagSelectorRef.current.getSelectionPrice()
            setEstimatedPrice(Number(estimated))
            
        }

    }

    const hanldeCreateOrder = (e : React.FormEvent<HTMLFormElement>) => {        
        e.preventDefault()
        if(currentOrder?.bags?.size === 0){
            showTopMessage('Une commande doit contenir au moins 1 sac',{backgroundColor:'var(--info-orange)'})
            return 
        }
        if(currentOrder?.customerId?.length === 0){
            showTopMessage('Une commande doit contenir 1 client',{backgroundColor:'var(--info-orange)'})
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
                        <label htmlFor="customer-select-id">Client: </label>
                        <select 
                            name="customerId" id="customer-select-id"
                            onChange={handleElementChange}                            
                            required                
                        >
                            <option value="">Choisir un client</option>
                            {customers instanceof Array && customers.map((customer,index)=>(
                                <option key={index} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                    </div>


                    <div className='create-order-field'>
                        <label htmlFor="">Lieu:</label>
                        <select                             
                            name="createdLocation" id="createdPlace"
                            onChange={handleElementChange}                                                   
                        >
                            <option value="">Choisir un lieu</option>
                            <option value="Salon Paris">Salon Paris</option>
                            <option value="Salon Tokyo">Salon Tokyo</option>
                        </select>
                    </div>
                    

                    <div className='create-order-field'>
                        <label htmlFor="planned-date">Date prévue:</label>
                        <input 
                            className='planned-date'
                            id='planned-date'
                            name='plannedDate'
                            onChange={handleElementChange}                
                            placeholder="Ex: Fin mars"
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
                        <label htmlFor="">Commentaire:</label>
                        <textarea                     
                            name="comments"
                            onChange={handleElementChange} 
                            id=""                        
                        >
                        </textarea>
                    </div>

                    

                    


                    <div className='bag-selection'>

                        <BagSelector  
                        ref={bagSelectorRef}
                        addBagsToCurrentBags={setBagsOfCurrentOrder}
                        customBagSelectionWrapperCSS= {{}}
                        customButtonSectionStyle={{justifyContent:'center'}}
                        customSaveButtonStyle={{background:'white',color:'var(--info-green)'}}
                        >

                        </BagSelector>

                        <div className='bag-selection-price'>
                            <div className="bag-selection-item base-price">
                                <label htmlFor="">Prix de base:(€)</label>
                                <div>
                                    {estimatedPrice.toString()}
                                </div>                             
                            </div>
                            <div className="bag-selection-item discount">
                                <label htmlFor="">Réduction:(%)</label>
                                <input               
                                    className='price-discount'
                                    name='price.discount'
                                    onChange={handleElementChange}   
                                    type='number'             
                                    placeholder="Ex: 12"
                                />
                            </div>
                            <div className="bag-selection-item deliveryCosts">
                                <label htmlFor="">Coût de livraison(€):</label>
                                <input               
                                    className='price-deliveryCost'
                                    name='price.deliveryCost'
                                    type='number'             
                                    onChange={handleElementChange}                
                                    placeholder="Ex: 35"
                                />
                            </div>
                            <div className='bag-selection-item create-order-total-price'>
                                <label htmlFor="">Prix total:</label>
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
                            Créer la commande
                        </button>
                    </div>
                </form>
            
            
            </div>
            }



        </>

  )
}

export default CreateOrder
