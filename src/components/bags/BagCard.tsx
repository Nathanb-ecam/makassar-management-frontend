import React, { useState } from 'react'
import { Bag } from '../../models/entities';

import '../css/bagcard.css'

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { BASE_IMAGES_URL } from '../../../constants';

interface Props{
    bag: Bag;
    quantity:number;
    deleteBag?: (bag: Bag) => void
    updateBagQuantity? : (bag : Bag, newQuantity : number) => void
    bottomVisible: boolean;
    // cardIndex: number;
    // bottomDiv: React.ReactNode
}

const BagCard = ({bag, initialQuantity, deleteBag, updateBagQuantity,bottomVisible = false}) => {


    const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
    const [bagQuantity, setBagQuantity] = useState("");


    const handlePrevImage = () =>{ 
        if(bag.imageUrls){
            setImageCarouselIndex((prev)=> prev === 0 ? bag.imageUrls.length  - 1 : prev - 1)
        }
    }
    const handleNextImage = () =>{ 
        if(bag.imageUrls){
            setImageCarouselIndex((prev)=> prev === bag.imageUrls.length -1 ? 0 : prev + 1)
        }
    }

    const handleQuantityBlur = () => {
        const quantity = parseInt(bagQuantity,10);
        if(!isNaN(quantity)){
            updateBagQuantity(bag,quantity);
        }else{
            setBagQuantity(initialQuantity);
        }

    }

  return (
    <div key={bag.id} className='bag-item-card'>
        <div className="bag-card-title">{bag.marketingName}</div>
        { bag.imageUrls && bag.imageUrls.length > 0 ?
            <div className='bags-carousel'>
                <button className='prev-image' onClick={handlePrevImage}><FaAngleLeft /></button>
                <div className='sliders'>
                    {bag.imageUrls?.map((imgUrl,index)=>(
                    <div className={`slider ${imageCarouselIndex===index ? 'active' : ''}`} key={index} >
                        <div className='image-index'>{imageCarouselIndex+1}/{bag.imageUrls.length}</div>
                        <img className='bag-image' src={`${BASE_IMAGES_URL}/${imgUrl}`} alt={`${imgUrl}-${index}`} />
                        {/* <img className='bag-image' src={`${BASE_IMAGES_URL}/${imgUrl}`} alt={`${imgUrl}-${index}`} /> */}
                    </div>
                ))}
                </div>
    
                <button className='next-image' onClick={handleNextImage}><FaAngleRight /></button>
            </div>
            : <BsHandbag className='nobag-image'/>
        }


        <div className='card-bottom-text'>
            <div className="top">
                    <div className='quantity-text'>x 
                        <input 
                        className='bag-quantity-input'
                        type="number" placeholder={initialQuantity} 
                        onChange={(e)=> setBagQuantity(e.target.value)} 
                        value={bagQuantity}
                        onBlur={handleQuantityBlur}
                        />
                    </div>
                    
                    <div className='bag-price'>{bag.retailPrice}€</div>  
            </div>
    
            
            {bottomVisible ?
                <div className="bottom">
                    <div className='sku'>SKU: {bag.sku}</div>
                    <div className='delete-bag-button' onClick={(e) => deleteBag(bag)}>
                        <RiDeleteBin6Line className='delete-icon' />                                        
                    </div>
                </div>
                : null
            }
            
        </div>
        

  </div>
  )
}

export default BagCard