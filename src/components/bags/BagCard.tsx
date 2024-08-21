import React, { useState } from 'react'
import { Bag } from '../../models/entities';

import './bagcard.css'

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";

interface Props{
    bag: Bag;
    quantity:number;
    // cardIndex: number;
    // bottomDiv: React.ReactNode
}

const BagCard = ({bag, quantity}) => {

    const [imageCarouselIndex, setImageCarouselIndex] = useState(0);


    const handlePrevImage = () =>{ 
        setImageCarouselIndex((prev)=> prev === 0 ? bag.imageUrls.length  - 1 : prev - 1)
        console.log("imageCarouselIndex",imageCarouselIndex)
    }
    const handleNextImage = () =>{ 
        setImageCarouselIndex((prev)=> prev === bag.imageUrls.length -1 ? 0 : prev + 1)
        console.log("imageCarouselIndex",imageCarouselIndex)

    }

  return (
    <div key={bag.id} className='bag-item-card'>
        <div className="title">{bag.marketingName}</div>
        <div className='bags-carousel'>
            <button className='prev-image' onClick={handlePrevImage}><FaAngleLeft /></button>
            <div className='sliders'>
                {bag.imageUrls?.map((imgUrl,index)=>(
                <div className={`slider ${imageCarouselIndex===index ? 'active' : ''}`} key={index} >
                    <div className='image-index'>{imageCarouselIndex+1}/ {bag.imageUrls.length}</div>
                    <img className='bag-image' src={`http://localhost:8080/uploads/${imgUrl}`} alt={`${imgUrl}-${index}`} />
                </div>
            ))}
            </div>

            <button className='next-image' onClick={handleNextImage}><FaAngleRight /></button>
        </div>

        <div className='card-bottom-text'>
        {/* {bottomDiv} */}
        <div className="left">
            <div>Quantité: {quantity}</div>
            <div>SKU: {bag.sku}</div>
        </div>
        <div className="right">
            <div>{bag.retailPrice}€</div>  
            <RiDeleteBin6Line className='delete-icon' />                                        
        </div>
        </div>
  </div>
  )
}

export default BagCard