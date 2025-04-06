import React, { CSSProperties } from 'react'
import Popup from './Popup'
import ConfirmAction from './ConfirmAction';


interface Props{
    title: string;
    onConfirmActionPopupClosed: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText: string;
    confirmActionButtonStyles: CSSProperties;
}


const ConfirmActionPopup = ({title,onConfirmActionPopupClosed, onConfirm, onCancel, confirmText, confirmActionButtonStyles} : Props) => {
  return (
    <Popup
    title={title}
    onPopupClose={onConfirmActionPopupClosed} 
    customCSS={{
      // minHeight:'60%',
      width:'60vw',
      maxWidth:'600px',
      // minHeight:'35vh',
      maxHeight:'95vh',
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-between',
      gap:'3rem'

    }}
    >                            

        <ConfirmAction 
          onConfirm={onConfirm} 
          onCancel={onCancel}
          confirmText={confirmText}
          confirmActionButtonStyles={confirmActionButtonStyles}
        />                                
  </Popup>
  )
}

export default ConfirmActionPopup