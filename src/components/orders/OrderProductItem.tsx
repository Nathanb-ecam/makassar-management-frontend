import React, { useState } from 'react'
import { Product } from '../../models/entities';

import '../css/orderproduct-item.css'

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { BASE_IMAGES_URL } from '../../../constants';
import { IoMdClose } from 'react-icons/io';


interface Props{
    product: Product;
    initialQuantity:number;    
    updateProductQuantity : (product : Product, newQuantity : number) => void
    onProductRemoved: (product : Product) => void;        
}

const OrderProductItem = ({product, initialQuantity,updateProductQuantity,  onProductRemoved} : Props) => {

    if(product == null || product == undefined ) return

    const [productQuantity, setProductQuantity] = useState(initialQuantity.toString());


    const handleQuantityBlur = () => {
        const quantity = parseInt(productQuantity,10);
        if(quantity < 0) return setProductQuantity(initialQuantity.toString())
        if(!isNaN(quantity)){
            updateProductQuantity?.(product,quantity);
        }else{
            setProductQuantity(initialQuantity.toString());
        }

    }

  return (    
        <div 
            className='order-product-item-card'
            title={product.marketingName??"undefined"}
            key={product.id}         
        >        
            <div className="image-section">
                {product?.imageUrls?.length && product.imageUrls.length >= 1 ? 
                    <img className='product-image' src={`${BASE_IMAGES_URL}/${product.imageUrls[0]}`} alt={`image ${product.marketingName}`} />
                    : <BsHandbag className='noproduct-image'/>
                }
            </div>

            <div className="item-details-section">
                    <p>{product.marketingName}</p>
                    <p>sku: {product.sku}</p>
                    <p>{product.retailPrice}</p>
            </div>

            <div className="item-actions">
                <input 
                    className='product-quantity-input'
                    type="number" placeholder={initialQuantity.toString()} 
                    onChange={(e)=> {setProductQuantity(e.target.value)}} 
                    value={productQuantity}
                    onBlur={handleQuantityBlur}
                    />
                <IoMdClose className='delete-product-button' onClick={(e) => {onProductRemoved?.(product)}}/>
            </div>

        

    </div>
        
    
  )
}

export default OrderProductItem