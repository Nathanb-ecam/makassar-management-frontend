import React, { useEffect, useState } from 'react'
import { MdInfoOutline } from 'react-icons/md';
import { Bag, Order } from '../../models/entities';


import '../css/orderPrice.css'
import InfoButtonPopup from '../main/InfoButtonPopup';


interface Props{
    bags : Map<string,{bag:Bag, quantity:number}> | null | undefined;
    order: Order;
    handleOrderDataChange: (orderId: string,key:string, newValue: string) => void;
}


const OrderPrice = ({bags,order, handleOrderDataChange} : Props) => {
    
    const originalDiscount = order.discount ?  parseInt(order.discount,10) : 0
    const [discount,setDiscount] = useState(originalDiscount);
    const [calculatedPrice,setCalculatedPrice] = useState(0);
    const [priceCalculationsVisible,setPriceCalculationsVisible] = useState(false);


    useEffect(()=>{
        
        if (bags === null || bags === undefined) return 

        let totalPrice = 0;
        bags.forEach(({ bag, quantity },index) => {
                totalPrice += Number(bag.retailPrice) * quantity
        });

        setCalculatedPrice(totalPrice)
        console.log("total theoretical price", totalPrice)

    },[bags,order,discount])


    const togglePriceCalculationsVisibility = () =>{
        if(priceCalculationsVisible) setPriceCalculationsVisible(false)
        else setPriceCalculationsVisible(true)
    }


    useEffect(() => {
        if (priceCalculationsVisible) {
            document.body.classList.add('blurred');
        } else {
            document.body.classList.remove('blurred');
        }

    
        return () => document.body.classList.remove('blurred');
    }, [priceCalculationsVisible]);


  
    return (
        <>
            <div className='actual-price'>
                <div className="actual-price-text">Prix actuel:€</div>
                <div 
                    className="editable-price"
                    contentEditable={true}
                    suppressContentEditableWarning={true} 
                    onBlur={(e) => handleOrderDataChange(order.id,"totalPrice", (e.target as HTMLElement).innerText)}
                    >
                    {order.totalPrice} 
                </div>
                <InfoButtonPopup positionClass="left-pop" sizeClass='small-pop' customStyle={{padding:'', maxWidth:'220px',right:'-25px'}}>
                    <div className='price-calculations'>
                        <div className="decompte">
                            {bags && Array.from(bags.values()).map(({ bag, quantity }, index) => (
                                <div key={index}>{bag.retailPrice} x {quantity} =  {Number(bag.retailPrice) * quantity}€</div>
                            ))}
                        </div>
                        <div className="resume">
                            <div className='total-price'>Total: €{calculatedPrice}</div>
                            <div className='discount-container'>
                                <div className='discount-text'>
                                Réduction:
                                </div>
                                <div 
                                    className="discount-value"
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                        const perc = (e.target as HTMLElement).innerText
                                        const dis = parseInt(perc,10) / 100
                                        handleOrderDataChange(order.id,"discount", dis.toString())
                                        setDiscount(dis) 
                                    }}
                                >
                                    {discount*100}
                                </div>  
                                <div className="discount-symbol">
                                    %
                                </div>
                            </div>
                            <div className='final-price'>Prix final : €{calculatedPrice * (1-discount)}</div>
                        </div>
                    </div>
    
                </InfoButtonPopup>
            </div>

        </>
  )
}

export default OrderPrice
