import React, { useState } from 'react'
import { Product } from '../../models/entities';

import '../css/productcard.css'

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { BASE_IMAGES_URL } from '../../../constants';
import { IoMdClose } from 'react-icons/io';
import InfoButtonPopup from '../main/InfoButtonPopup';
import Popup from '../main/Popup';


interface Props{
    product: Product;
    initialQuantity:number;
    // quantity:number;
    updateProductQuantity? : (product : Product, newQuantity : number) => void
    onProductRemoved?: (product : Product) => void;
    bottomVisible?: boolean;
    deleteButtonVisible? : boolean;
    // cardIndex: number;
    // bottomDiv: React.ReactNode
}

const ProductCard = ({product, initialQuantity,updateProductQuantity,  onProductRemoved,bottomVisible = false,deleteButtonVisible = false} : Props) => {

    if(product == null || product == undefined ) return

    const productImagesCount = product?.imageUrls?.length ?? 0

    const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
    const [productQuantity, setProductQuantity] = useState(initialQuantity.toString());

    const prevNextArrowVisible = (productImagesCount > 1)

    // const [productDetailsVisible,setproductDetailsVisible] = useState(false)


    const handlePrevImage = () =>{ 
        if(product.imageUrls){
            setImageCarouselIndex((prev)=> prev === 0 ? product?.imageUrls?.length ?? 1  - 1 : prev - 1)
        }
    }
    const handleNextImage = () =>{ 
        if(product.imageUrls){
            setImageCarouselIndex((prev)=> prev === (product?.imageUrls?.length ?? 0) - 1 ? 0 : prev + 1)
        }
    }

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
    <>

  

    <div 
        className='product-item-card'
        title={product.marketingName??"undefined"}
        key={product.id} 
        // onClick={(e) =>{setproductDetailsVisible(true)}}        
    >        
        <div className="product-details-popup-wrapper">    
            <InfoButtonPopup 
                positionClass='right-pop' 
                customStyle={{
                    height:'calc(var(--productcard-height) - 10px)',width:'var(--productcard-width)',
                    top:'20px'
                }}
                customButtonStyle={{fontSize:'18px'}}
                >
                <div className='marketingName'>{product.marketingName}</div>
                <div className='sku'>{product.sku}</div>        
            </InfoButtonPopup>
        </div>
        { deleteButtonVisible && <IoMdClose className='productcard-delete-btn' onClick={()=>onProductRemoved?.(product)}/>}
        {/* <div className="product-card-title-wrapper">
            <div className='product-card-title'>{product.marketingName}</div>
        </div> */}

        { product.imageUrls && product.imageUrls.length > 0 ?
            <div className={`products-carousel ${prevNextArrowVisible ? '' : 'prev-next-arrow-hidden'}`}>
                <button type="button" className={`prev-image`}
                onClick={handlePrevImage}
                >   
                    <FaAngleLeft />
                </button>
                <div className='sliders'>
                    {product.imageUrls?.map((imgUrl,index)=>(
                    <div className={`slider ${imageCarouselIndex===index ? 'active' : ''}`} key={index} >
                        {(product?.imageUrls?.length ?? 0) >1 && <div className='image-index'>{imageCarouselIndex+1}/{product?.imageUrls?.length}</div>}
                        <img className='product-image' src={`${BASE_IMAGES_URL}/${imgUrl}`} alt={`${imgUrl}-${index}`} />
                        {/* <img className='product-image' src={`${BASE_IMAGES_URL}/${imgUrl}`} alt={`${imgUrl}-${index}`} /> */}
                    </div>
                ))}
                </div>
    
                <button type="button"  className={`next-image`} onClick={handleNextImage}>
                    <FaAngleRight />
                </button>
            </div>
            : <div className="products-carousel">
                <BsHandbag className='noproduct-image'/>
            </div>
        }


        <div className='card-bottom-text'>
            <div className="top">
                    <div className='quantity-text'>x 
                        <input 
                        className='product-quantity-input'
                        type="number" placeholder={initialQuantity.toString()} 
                        onChange={(e)=> {setProductQuantity(e.target.value)}} 
                        value={productQuantity}
                        onBlur={handleQuantityBlur}
                        />
                    </div>
                    
                    <div className='product-price'>{product.retailPrice}€</div>  
            </div>
    
            
            {bottomVisible &&
                <div className="bottom">
                    <div className='sku'>SKU: {product.sku}</div>
                    <div className='delete-product-button' onClick={(e) => {onProductRemoved?.(product)}}>
                        <RiDeleteBin6Line className='delete-icon' />                                        
                    </div>
                </div>
            }
            
        </div>
        

  </div>
    </>
    
  )
}

export default ProductCard