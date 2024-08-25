import React from 'react'
import { IoMdClose } from 'react-icons/io';


import '../css/popup.css'

interface Props{
    title : string;
    onPopupClose : ()=> void;
    children: React.ReactNode
}

const Popup = ({title,onPopupClose, children}:Props) => {
  return (
    <div className="popup">
            <div className="popup-header">
                <div className="pop-title">{title}</div>
                <IoMdClose className='popup-close-btn' onClick={onPopupClose}/>
                
            </div>
        <div className="popup-content-wrapper">
            {children}
        </div>
    </div>
  )
}

export default Popup