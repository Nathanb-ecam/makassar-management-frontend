import React, { useImperativeHandle, useState } from 'react'

import { CiSquarePlus } from 'react-icons/ci'
import { Bag } from '../../models/entities';

import '../css/addbagcard.css'
import Popup from '../main/Popup';
import BagSelector from './BagSelector.tsx';


interface Props {
    // addBagToOrder: (bag:Bag)=> void;
    // orderId: string;
    addBagToCurrentBags?: (bag:Bag,quantity: number) => void;
    addBagsSelectionToCurrentBags: (bags : Map<string,{bag: Bag, quantity: number}>) => void;
    // applyBagChangeToCurrentOrder: (bag : {bag: Bag, quantity: number}) => void;
}



const AddBagCard = React.forwardRef(({addBagsSelectionToCurrentBags} : Props,ref) => {
  
    const [isPopupOpen, setIsPopupOpen] = useState(false);

  
    useImperativeHandle(ref,()=>({
        hidePopup(){
            closePopup()
        }
    }))
  
    const openBagSelector = () => {
        setIsPopupOpen(true);
    }
  
    const closePopup = ()=>{
        setIsPopupOpen(false);
    }


    return (
        <div className='bag-selector'>
            <div onClick={openBagSelector} className='add-bag-section'>                    
                {/* <div className='add-bag-title'>Ajouter un sac</div> */}
                <CiSquarePlus className='plus-button'/>

            </div>

            {isPopupOpen && 
            <Popup title="Ajouter des sacs " onPopupClose={closePopup} customCSS={{}}>
                <BagSelector 
                    close={closePopup} 
                    addBagsToCurrentBags={addBagsSelectionToCurrentBags}
                    customSaveButtonStyle={{position:'initial'}}
                    />

            </Popup>
            }
        </div>
  )
})

export default AddBagCard