import React, { useRef,forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { MdInfoOutline } from 'react-icons/md'

import '../css/info-button-popup.css'

interface Props{
    positionClass?: string;  
    sizeClass?: string;
    children? : React.ReactNode;
    customButtonStyle?: React.CSSProperties;
    customStyle?: React.CSSProperties;
}

const InfoButtonPopup = forwardRef(({
    positionClass='middle-pop',
    sizeClass='medium-pop',
    customButtonStyle={}, 
    customStyle={}, 
    children} : Props,
    ref) => {

    useImperativeHandle(ref,()=>({
        showPopup(){
            setPopupVisible(true)
        },
        hidePopup(){
            setPopupVisible(false)            
        }
    }))
  
    const [popupVisible, setPopupVisible] = useState(false)
  
   const togglePopupVisibility = () => {
        if(popupVisible) setPopupVisible(false)
        else setPopupVisible(true)
   }

    return (
    <div className='info-popup'>
        
        <MdInfoOutline onClick={togglePopupVisibility} style={customButtonStyle}/>
        
        {popupVisible && 
            <div className={`info-popup-content ${positionClass} ${sizeClass}`} style={customStyle}>
                {children}
            </div>
            
            }
    </div>
  )
})

export default InfoButtonPopup