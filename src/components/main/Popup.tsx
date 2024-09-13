import React, { CSSProperties, useEffect, useRef } from 'react'
import { IoMdClose } from 'react-icons/io';


import '../css/popup.css'

interface Props{
    title : string;
    onPopupClose : ()=> void;
    popupVisible?: boolean;
    customCSS?: CSSProperties;
    customCSSPopupContent?: CSSProperties;
    children: React.ReactNode
}

const Popup = ({title,onPopupClose, popupVisible = true, customCSS,customCSSPopupContent, children}:Props) => {
  
  
  return (
    <>
    {popupVisible && (
        <>
        <div className="popup-overlay"></div>
          <div className="popup" style={customCSS}>
            <div className="popup-header">
                <div className="pop-title">{title}</div>
                
                <IoMdClose className='popup-close-btn' onClick={onPopupClose}/>
                
            </div>
            <div className="popup-content-wrapper" style={customCSSPopupContent}>
                {children}
            </div>
         </div>
        </>
    )}
    </>

  )
}

export default Popup