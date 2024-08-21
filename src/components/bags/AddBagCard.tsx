import React, { useState } from 'react'

import './css/addbagcard.css'
import { CiSquarePlus } from 'react-icons/ci'
import BagSelectorPopup from './BagSelectorPopup';
import { Bag } from '../../models/entities';

interface Props {
    // addBagToOrder: (bag:Bag)=> void;
    orderId: string;
}

const AddBagCard = ({orderId} : Props) => {
  
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
                <div className='add-bag-title'>Ajouter un sac</div>
                <CiSquarePlus className='plus-button'/>

            </div>

            {isPopupOpen && <BagSelectorPopup close={closePopup} orderId={orderId}/>}
        </>
  )
}

export default AddBagCard