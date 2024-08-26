import React, { CSSProperties } from 'react'
import { IoMdClose } from 'react-icons/io';


import '../css/top-message-popup.css'

interface Props{
    customCSS?: CSSProperties;
    children: React.ReactNode
}

const TopMessagePopup = ({customCSS, children}:Props) => {
  return (
    // style={customCSS}
        <div className="top-message-popup" style={customCSS}>            
            {children}
        </div>
    
    

  )
}

export default TopMessagePopup