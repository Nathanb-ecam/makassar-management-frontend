import React, { useEffect, useState } from 'react'
import { Bag } from '../../models/entities';
import { getBags } from '../../api/calls/Bag';
import { useAuth } from '../../hooks/useAuth';


import { IoMdClose } from "react-icons/io";
import { addBagToOrder } from '../../api/calls/Order';
import { BsHandbag } from 'react-icons/bs';





import '../css/bagselector-popup.css'
import BagCard from './BagCard.tsx';
import InfoButtonPopup from '../main/InfoButtonPopup.tsx';


interface Props {
    close : ()=> void;
    // addBagToOrder: (bag:Bag | undefined)=> void;
    // orderId: string;
    // addBagToCurrentBags: (bag:Bag,quantity: number)=> void;
    addBagsToCurrentBags: (bags : Map<string,{bag: Bag, quantity: number}>) => void;
}

const BagSelectorPopup = ({ close, addBagsToCurrentBags }: Props) => {

    const {auth} = useAuth();
    const[bags,setBags] = useState<Bag[]>([]);

    const [selectedBags,setSelectedBags] = useState<Map<string,{bag:Bag, quantity : number}>>(new Map());
    
    
    const [error,setError] = useState('');

    useEffect(()=>{
        const fetchBags = async()=> {
            const {bags,err} = await getBags(auth);
            if(err === undefined) setBags(bags)
            else setError(err)
        }

        fetchBags()
    },[])




    const handleBagQuantityChange  = (bag : Bag, quantity : number)=>{
        setSelectedBags(prev=>{
            if(!prev) return prev
            if(bag.id === undefined) return 
            
            const updatedBags = new Map(prev);

            updatedBags.set(bag.id, {bag,quantity})
            return updatedBags
        })
    }


    const saveBagsSelection = () =>{
        addBagsToCurrentBags(selectedBags)
        close()
    }

  return (
    <div className='bag-popup-container'>
        {/* <div className='popup-relative-layout'> */}
            <div className="bag-popup-header">
                <div className='title-wrapper'>
                    <div className="title">
                        Ajouter des sacs à la commande 
                    </div>
                    <InfoButtonPopup positionClass="middle-pop" sizeClass='medium-pop' customStyle={{top:'25px'}}>
                        <div className='info-text'>
                            1. Choisir le nombre de sacs par modèle<br/>
                            2. Valider pour ajouter la sélection à la commande actuelle
                        </div>
                    </InfoButtonPopup>

                </div>
                <IoMdClose className='popup-close-btn' onClick={close}/>
                
            </div>
            <div className="bag-selection-list">
            
            {bags ?
                    bags.map((bag,index)=>(
                        <div 
                        className={`bag-list-item`} 
                        // key={index} onClick={()=>handleSelectedBag(index,bag)}
                        >
                            <BagCard bag={bag} initialQuantity={0} updateBagQuantity={handleBagQuantityChange} bottomVisible={false}>

                            </BagCard>
                        </div>
                        )
                    )
                    
                    : <p>{error}</p>
                }
            </div>
            
   
            {/* <div className="bag-select-quantity">
                    <div>Quantité: 
                        <input 
                            className='bag-quantity-input' type="number" 
                            name={}
                            value={selectedQuantity}
                            onChange={setSelectedQuantity}
                        />
                    </div>
                </div> */}



            <div className='bottom-section'>
                <button onClick={saveBagsSelection}>Enregistrer la sélection</button>
            </div>

        
    </div>

  )
}

export default BagSelectorPopup



