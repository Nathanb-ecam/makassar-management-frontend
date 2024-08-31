import React, { useState } from 'react'
import { Bag } from '../../models/entities';

import '../css/bagcard.css'

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { BASE_IMAGES_URL } from '../../../constants';
import { IoMdClose } from 'react-icons/io';

interface Props{
    bag: Bag;
    quantity:number;
    updateBagQuantity? : (bag : Bag, newQuantity : number) => void
    bottomVisible: boolean;
    onBagRemoved?: (bag : Bag) => void;
    // cardIndex: number;
    // bottomDiv: React.ReactNode
}

const BagCard = ({bag, initialQuantity, onBagRemoved, updateBagQuantity,bottomVisible = false,deleteButtonVisible = false}) => {


    const bagImagesCount = bag.imageUrls?.length ?? 0

    const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
    const [bagQuantity, setBagQuantity] = useState("");

    const prevNextArrowVisible = (bagImagesCount > 1)


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
        { deleteButtonVisible && <IoMdClose className='bagcard-delete-btn' onClick={()=>onBagRemoved(bag)}/>}
        <div className="bag-card-title">{bag.marketingName}</div>
        { bag.imageUrls && bag.imageUrls.length > 0 ?
            <div className={`bags-carousel ${prevNextArrowVisible ? '' : 'prev-next-arrow-hidden'}`}>
                <button type="button" className={`prev-image`}
                onClick={handlePrevImage}
                >   
                    <FaAngleLeft />
                </button>
                <div className='sliders'>
                    {bag.imageUrls?.map((imgUrl,index)=>(
                    <div className={`slider ${imageCarouselIndex===index ? 'active' : ''}`} key={index} >
                        <div className='image-index'>{imageCarouselIndex+1}/{bag.imageUrls.length}</div>
                        <img className='bag-image' src={`${BASE_IMAGES_URL}/${imgUrl}`} alt={`${imgUrl}-${index}`} />
                        {/* <img className='bag-image' src={`${BASE_IMAGES_URL}/${imgUrl}`} alt={`${imgUrl}-${index}`} /> */}
                    </div>
                ))}
                </div>
    
                <button type="button"  className={`next-image`} onClick={handleNextImage}>
                    <FaAngleRight />
                </button>
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
    
            
            {bottomVisible &&
                <div className="bottom">
                    <div className='sku'>SKU: {bag.sku}</div>
                    <div className='delete-bag-button' onClick={(e) => onBagRemoved(bag)}>
                        <RiDeleteBin6Line className='delete-icon' />                                        
                    </div>
                </div>
            }
            
        </div>
        

  </div>
  )
}

export default BagCard