import React, { ChangeEvent, useEffect, useState } from 'react'
import Popup from '../main/Popup'
import { Bag } from '../../models/entities';

import '../css/bagModifier.css'

interface Props{
    bag : Bag | undefined | null;
    applyBagModifications: (bagId :string, bag : Bag) => void; 
    onPopupClose: () => void;
}


const BagModifier = ({bag, applyBagModifications, onPopupClose} : Props) => {
  
    if (bag === null || bag === undefined) return 

    const [modifications, setModifications] = useState<Bag>({})

    useEffect(()=>{
        console.log(modifications)
    },[modifications])

    // const handleElementChange = (key : string, value : string)=> {
    const handleElementChange = (e : ChangeEvent<HTMLInputElement>)=> {
        const {name, value} = e.target
        setModifications(prev=> prev ? {...prev,[name]: value} : prev)
    }

    const confirmChanges = (e : React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        // verifier que modifications est bien différent du sac original 
        if (modifications === undefined || modifications === null) return                                
        
        applyBagModifications(bag.id, modifications)
    }

    return (
    <>
        <Popup 
            title={`${bag.marketingName}`} 
            customCSS={{maxWidth:"40vw"}}
            onPopupClose={onPopupClose}>
            <div className="bag-modifier">
                <form onSubmit={confirmChanges}>
                    <div className="bag-modifier-fields">
                        <div className='bag-field'>
                            <label htmlFor="marketingName">Modèle: </label>
                            <input id="marketingName" name='marketingName' value={modifications?.marketingName ? modifications.marketingName : bag.marketingName} onChange={handleElementChange}/>
                        </div>
                        <div className='bag-field'>
                            <label htmlFor="retailPrice">Prix: </label>
                            <input id="retailPrice" name='retailPrice' value={modifications?.retailPrice ? modifications?.retailPrice : bag.retailPrice  } onChange={handleElementChange}/>
                        </div>
                        <div className='bag-field'>
                            <label htmlFor="sku">SKU: </label>
                            <input id="sku" name='sku' value={modifications?.sku ? modifications.sku : bag.sku} onChange={handleElementChange}/>
                        </div>
                    </div>


                    
                    <div className="confirm-bag-modifications-wrapper">
                        <button 
                        type='submit'
                        className='confirm-bag-modifications'
                        onClick={confirmChanges}
                        >
                            Confirmer
                        </button>
                    </div>
                </form>

            </div>
        </Popup>
    </>
  )
}

export default BagModifier