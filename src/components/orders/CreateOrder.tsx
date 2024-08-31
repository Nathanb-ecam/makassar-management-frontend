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
    

    // useEffect(()=>{
    //     console.log(currentOrder)
    // },[currentOrder])


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
        
        setCurrentOrder(prev=>{
            if(!prev) return prev 

            return {...prev, [name]: value}
        })
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
        // setEstimatedPrice(prev => prev ? selectionPrice : prev)

        if(bagSelectorRef.current) {
            const estimated = bagSelectorRef.current.getSelectionPrice()
            setEstimatedPrice(Number(estimated))
            handleDivChange('price.finalPrice',estimated)
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
                            {customers.map((customer,index)=>(
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
                        <label htmlFor="">Fourchette de livraison:</label>
                        <div 
                            // className='planned-date-pickers'
                            className='planned-date'
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onChange={(e)=>handleDivChange("plannedDate",(e.target as HTMLElement).innerText)}
                        >
                            Ex: Fin mars

                        </div>
                    </div>

                    <div className='create-order-field'>
                        <label htmlFor="">Description:</label>
                        <textarea 
                        name="description"
                        id=""
                        onChange={handleElementChange}
                        ></textarea>
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
                        customButtonSectionStyle={{justifyContent:'start'}}
                        customSaveButtonStyle={{background:'white',color:'var(--info-green)', border:'1px solid var(--info-green)'}}
                        >

                        </BagSelector>

                        <div className='bag-selection-price'>
                            <div className="bag-selection-item base-price">
                                <label htmlFor="">Prix de base:(€)</label>
                                <div>
                                    {estimatedPrice}
                                </div>
                            </div>
                            <div className="bag-selection-item discount">
                                <label htmlFor="">Réduction:(%)</label>
                                <div
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e)=>{
                                    const q = (Number((e.target as HTMLElement).innerText) / 100).toFixed(2)
                                    handleDivChange("price.discount",q.toString())
                                }
                                }
                                >
                                    Ex: 30
                                </div>
                            </div>
                            <div className="bag-selection-item deliveryCosts">
                                <label htmlFor="">Coût de livraison(€):</label>
                                <div
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e)=>handleDivChange("price.deliveryCost",(e.target as HTMLElement).innerText)}
                                >
                                    Ex: 120
                                </div>
                            </div>
                        </div>
                    </div>


                    <div
                    className='confirm-order-create'
                    // onClick={(e)=> handleOrderCreated(currentOrder)}
                    >
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
