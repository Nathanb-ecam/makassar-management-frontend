import React, { useEffect, useState } from 'react'
import { Bag } from '../../models/entities';
import { getBags } from '../../api/calls/Bags';
import { useAuth } from '../../hooks/useAuth';

import './css/bagselector-popup.css'

import { IoMdClose } from "react-icons/io";
import { addBagToOrder } from '../../api/calls/Orders';

interface Props {
    close : ()=> void;
    // addBagToOrder: (bag:Bag | undefined)=> void;
    orderId: string;
}

const BagSelectorPopup = ({ close,orderId }: Props) => {

    const {auth} = useAuth();
    const[bags,setBags] = useState<Bag[]>([]);
    const [selectedBag,setSelectedBag] = useState<Bag>();
    const [selectedQuantity,setSelectedQuantity] = useState("1");
    const [selectedBagIndex,setSelectedBagIndex] = useState(0);
    
    const [error,setError] = useState('');

    useEffect(()=>{
        const fetchBags = async()=> {
            const {bags,err} = await getBags(auth);
            if(err === undefined) setBags(bags)
            else setError(err)
        }

        fetchBags()
    },[])


    const handleSelectedBag = (index:number,bag:Bag)=>{
        setSelectedBag(bag);
        setSelectedBagIndex(index);
    }


    const handleAddBagToOrder = async (bag:Bag | undefined,quantity:string)=>{
        close()
        if(bag === undefined) return
        try{
            const bagAmount = parseInt(quantity,10);
            // need to create a addBag to order route in the backend
            const succesfullyAddedBagToOrder = await addBagToOrder(auth,orderId,bag.id,bagAmount);
            console.log("can go to bed",succesfullyAddedBagToOrder)

        }catch(err){console.log(err)}

    }

  return (
    <div className='bag-popup-container'>
        {/* <div className='popup-relative-layout'> */}
            <div className="popup-header">
                <div className="popup-title">Sélection d'un sac</div>
                <IoMdClose className='popup-close-btn' onClick={close}/>
                
            </div>
            <div className="bag-selection-list">
            
            {bags ?
                    bags.map((bag,index)=>(
                        <div 
                        className={`bag-list-item ${index === selectedBagIndex ? 'active' : ''}`} 
                        key={index} onClick={()=>handleSelectedBag(index,bag)}
                        >
                            {bag.imageUrls ? 
                                <div className='bag-image-container'>
                                    <img className='bag-image' src={`http://localhost:8080/uploads/${bag.imageUrls[0]}`} alt="" />
                                </div>
                                : <div className='bag-image'></div>
                            }
                            <div className="image-subsection">
                                <div className="bag-name">{bag.marketingName}</div>
                                <div className="bag-price">{bag.retailPrice}€</div>
                            </div>
                        </div>
                        )
                    )
                    
                    : <p>{error}</p>
                }
            </div>
            <div className="bag-select-quantity">
                <div>Quantité: 
                    <input 
                        className='bag-quantity-input' type="number" 
                        value={selectedQuantity}
                        onChange={(e)=>setSelectedQuantity(e.target.value)}
                    />
                </div>
            </div>
            <div className='bottom-section'>
                <button onClick={()=> handleAddBagToOrder(selectedBag,selectedQuantity)}>Enregistrer</button>
            </div>
        {/* </div> */}

        
    </div>

  )
}

export default BagSelectorPopup

