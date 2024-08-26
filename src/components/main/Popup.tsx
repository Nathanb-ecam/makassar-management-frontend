import React, { CSSProperties } from 'react'
import { IoMdClose } from 'react-icons/io';


import '../css/popup.css'

interface Props{
    title : string;
    onPopupClose : ()=> void;
    popupVisible?: boolean;
    customCSS?: CSSProperties;
    children: React.ReactNode
}

const Popup = ({title,onPopupClose, popupVisible = true, customCSS, children}:Props) => {
  return (
    <>
    {popupVisible && (
          <div className="popup" style={customCSS}>
            <div className="popup-header">
                <div className="pop-title">{title}</div>
                <IoMdClose className='popup-close-btn' onClick={onPopupClose}/>
                
            </div>
            <div className="popup-content-wrapper">
                {children}
            </div>
         </div>
    )}
    </>

  )
}

export default Popup