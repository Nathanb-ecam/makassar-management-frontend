import React, { CSSProperties, useImperativeHandle, useState } from 'react'

import { CiSquarePlus } from 'react-icons/ci'
import { Product } from '../../models/entities.ts';

import '../css/addproductcard.css'
import Popup from '../main/Popup.tsx';
import ProductSelector from './ProductSelector.tsx';


interface Props {
    // addproductToOrder: (product:product)=> void;
    // orderId: string;
    addProductToCurrentProducts?: (product:Product,quantity: number) => void;
    addProductsSelectionToCurrentProducts: (products : Map<string,{product: Product, quantity: number}>) => void;
    customPopupCSS?: CSSProperties
    // applyproductChangeToCurrentOrder: (product : {product: product, quantity: number}) => void;
}



const AddProductCard = React.forwardRef(({addProductsSelectionToCurrentProducts, customPopupCSS} : Props,ref) => {
  
    const [isPopupOpen, setIsPopupOpen] = useState(false);

  
    useImperativeHandle(ref,()=>({
        hidePopup(){
            closePopup()
        }
    }))
  
    const openProductSelector = () => {
        setIsPopupOpen(true);
    }
  
    const closePopup = ()=>{
        setIsPopupOpen(false);
    }


    return (
        <div className='product-selector'>
            <div onClick={openProductSelector} className='add-product-section'>                    
                {/* <div className='add-product-title'>Ajouter un sac</div> */}
                <CiSquarePlus className='plus-button' />                                
            </div>

            {isPopupOpen && 
            <Popup title="Add products " onPopupClose={closePopup} customCSS={customPopupCSS}>
                <ProductSelector 
                    // close={closePopup} 
                    addProductsToCurrentProducts={addProductsSelectionToCurrentProducts}
                    customSaveButtonStyle={{position:'initial'}}
                    />

            </Popup>
            }
        </div>
  )
})

export default AddProductCard