import React, { useState } from 'react'

import { CiSquarePlus } from 'react-icons/ci'
import BagSelectorPopup from './BagSelectorPopup';
import { Bag } from '../../models/entities';

import '../css/addbagcard.css'


interface Props {
    // addBagToOrder: (bag:Bag)=> void;
    // orderId: string;
    addBagToCurrentBags?: (bag:Bag,quantity: number) => void;
    addBagsSelectionToCurrentBags: (bags : Map<string,{bag: Bag, quantity: number}>) => void;
}

const AddBagCard = ({addBagsSelectionToCurrentBags} : Props) => {
  
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openBagSelector = () => {
        setIsPopupOpen(true);
    }
  
    const closePopup = ()=>{
        setIsPopupOpen(false);
    }


    return (
        <>
            <div onClick={openBagSelector} className='add-bag-section'>                    
                {/* <div className='add-bag-title'>Ajouter un sac</div> */}
                <CiSquarePlus className='plus-button'/>

            </div>

            {isPopupOpen && <BagSelectorPopup close={closePopup} addBagsToCurrentBags={addBagsSelectionToCurrentBags}/>}
        </>
  )
}

export default AddBagCard