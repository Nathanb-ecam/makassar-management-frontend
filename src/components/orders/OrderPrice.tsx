import React, { Dispatch, SetStateAction, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { MdInfoOutline } from 'react-icons/md';
import { Bag, Order, OrderFullyDetailed, Price } from '../../models/entities';


import '../css/orderPrice.css'
import InfoButtonPopup from '../main/InfoButtonPopup';



interface Props{
    bags : Map<string,{bag:Bag, quantity:number}> | null | undefined;
    order: OrderFullyDetailed;
    // handleOrderDataChange: (orderId: string,key:string, newValue: string) => void;
    handleOrderPriceChange: () => void;
}


const OrderPrice = React.forwardRef(({bags,order, handleOrderPriceChange} : Props,ref) => {
    
    if(order == null || order === undefined) return 

    const initialDiscount = order?.price?.discount ?? "0"
    const initialDeliveryCosts = order?.price?.deliveryCost ??  "0"
    
    const [bagsTotalPrice,setBagsTotalPrice] = useState(0);
    const [calculatedPrice,setCalculatedPrice] = useState(0);
    const [priceCalculationsVisible,setPriceCalculationsVisible] = useState(false);

    const [currentPriceHasBeenModified, setCurrentPriceHasBeenModified] = useState(false)


    useImperativeHandle(ref,()=>({
        getCurrentPrice(){
            return modifiedData
        },        
    }))


    const [modifiedData,setModifiedData] = useState<Price>({
        discount: "0",
        finalPrice: order?.price?.finalPrice?.toString(),
        deliveryCost: "0",
        alreadyPaid: "0"
    });

    useEffect(()=>{
        setModifiedData(prev => prev ? {...prev, discount:initialDiscount, deliveryCost: initialDeliveryCosts} : prev)
    },[bags])

    useEffect(()=>{
        
        if (bags === null || bags === undefined) return 


        const discount = Number(modifiedData.discount)
        const deliveryCosts = Number(modifiedData.deliveryCost)

        calculateDisplayedPrice(discount,deliveryCosts)
        
    },[bags,order,modifiedData.discount,modifiedData.deliveryCost])



    const calculateDisplayedPrice = (discount : number, deliveryCost : number)=>{
        if (bags === null || bags === undefined) return 
        
        let bagsTotalPrice = 0;
        bags.forEach(( {bag, quantity} ,index) => {
            bagsTotalPrice += Number(bag.retailPrice) * quantity
        });

        setBagsTotalPrice(bagsTotalPrice)


        var totalPrice = bagsTotalPrice;
        totalPrice *=  (1-discount)
        totalPrice += deliveryCost

        setCalculatedPrice(totalPrice)
        setModifiedData(prev => prev ? {...prev, finalPrice:totalPrice.toString()} : prev)

        

    }



    return (
        <>
            <div className='actual-price-wrapper'>
                <div className="actual-price-text">Prix actuel: </div>
                <div 
                    className="actual-price"
                    >
                    {Number(order?.price?.finalPrice).toFixed(2)}
                </div>
                

                
                <InfoButtonPopup 
                positionClass="left-pop" sizeClass='small-pop' customStyle={{maxWidth:'220px',right:'-25px',top:'25px'}}
                >
                    <div className='price-calculations'>
                        <div className="decompte">
                            {bags instanceof Map && Array.from(bags.values()).map((bagWithQ ,index) => (
                                <div key={index}>{bagWithQ.bag.retailPrice} x {bagWithQ.quantity} =  {(Number(bagWithQ.bag.retailPrice) * bagWithQ.quantity).toFixed(2)}€</div>
                            ))}
                        </div>
                        <div className="resume">
                            <div className='total-price'>{bagsTotalPrice}€</div>
                            <div className='discount-container'>
                                <div className='discount-text'>
                                Réduction:
                                </div>
        
                                <div 
                                    className="discount-value"
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                        const discount = (e.target as HTMLElement).innerText
                                        const formattedDiscount = (Number(discount) / 100)
                                        setCurrentPriceHasBeenModified(true)
                                        setModifiedData(prev => prev ? {...prev,discount:formattedDiscount.toString()} : prev)
                                        handleOrderPriceChange()


                                    }}
                                >
                                    {Number(modifiedData.discount)*100}
                                </div>

                                <div className="discount-symbol">
                                    %
                                </div>
                            </div>
                            <div className='delivery-costs-container'>
                                <div className="delivery-costs-text">
                                    Frais livraison:
                                </div>
                                <div 
                                className="delivery-costs-value"
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e)=>{
                                    const deliveryCosts = Number((e.target as HTMLElement).innerText)
                                    setCurrentPriceHasBeenModified(true)
                                    setModifiedData(prev => prev ? {...prev,deliveryCost:deliveryCosts.toString()} : prev) 
                                    handleOrderPriceChange()

                                   
                                }}
                                
                                >
                                    {order.price?.deliveryCost ? order.price.deliveryCost : 0 }
                                </div>
                                <div className="delivery-costs-symbol">
                                    €
                                </div>
                            </div>
                            <div className='final-price'>
                                Prix final : {calculatedPrice.toFixed(2)}€
                            </div>
                            {/* <div
                            className={`confirm-price ${currentPriceHasBeenModified ? '' : ''} `}
                            onClick={()=>{
                                if(childInfoPopupRef.current) childInfoPopupRef.current.hideInfoPopup()
                                handleOrderPriceChange(modifiedData)
                            }
                            }
                            >
                                <button>
                                    Confirmer
                                </button>
                            </div> */}
                        </div>
                    </div>
    
                </InfoButtonPopup>

                
            </div>

        </>
  )
})

export default OrderPrice
