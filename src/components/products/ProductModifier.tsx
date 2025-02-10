import React, { ChangeEvent, useEffect, useState } from 'react'
import Popup from '../main/Popup'
import { Product } from '../../models/entities';

import '../css/productModifier.css'

interface Props{
    product : Product | undefined | null;
    applyProductModifications: (productId :string, product : Product) => void; 
    onPopupClose: () => void;
}


const productModifier = ({product, applyProductModifications, onPopupClose} : Props) => {
  
    if (product === null || product === undefined) return 

    const [modifications, setModifications] = useState<Product>({})

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
        
        applyProductModifications(product.id!!, modifications)
    }

    return (
    <>
        <Popup 
            title={`${product.marketingName}`} 
            customCSS={{maxWidth:"40vw"}}
            onPopupClose={onPopupClose}>
            <div className="product-modifier">
                <form onSubmit={confirmChanges}>
                    <div className="product-modifier-fields">
                        <div className='product-field'>
                            <label htmlFor="marketingName">Modèle: </label>
                            <input id="marketingName" name='marketingName' value={modifications?.marketingName ? modifications.marketingName : product.marketingName!!} onChange={handleElementChange}/>
                        </div>
                        <div className='product-field'>
                            <label htmlFor="retailPrice">Prix: </label>
                            <input id="retailPrice" name='retailPrice' value={modifications?.retailPrice ? modifications?.retailPrice : product.retailPrice!!  } onChange={handleElementChange}/>
                        </div>
                        <div className='product-field'>
                            <label htmlFor="sku">SKU: </label>
                            <input id="sku" name='sku' value={modifications?.sku ? modifications.sku : product.sku!!} onChange={handleElementChange}/>
                        </div>
                    </div>


                    
                    <div className="confirm-product-modifications-wrapper">
                        <button 
                        type='submit'
                        className='confirm-product-modifications'
                        onClick={(e)=>confirmChanges}
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

export default productModifier