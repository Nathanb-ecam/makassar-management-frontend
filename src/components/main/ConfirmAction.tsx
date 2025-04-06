import React, { CSSProperties } from 'react'

import '../css/confirmaction.css'

interface Props{
    onCancel: () => void;
    onConfirm: () => void;
    confirmText : string;
    confirmActionButtonStyles: CSSProperties;
}

const ConfirmAction = ({onConfirm, onCancel, confirmText, confirmActionButtonStyles} : Props) => {
  return (
    <div className='actions-cancel-confirm'>  
        <button className='cancel-action' onClick={onCancel}>Cancel</button>
        <button className='confirm-action' onClick={onConfirm} style={confirmActionButtonStyles}>{confirmText}</button>
    </div>
  )
}

export default ConfirmAction