import React from 'react'

import '../css/sectionTitle.css'
import { FaPlus } from 'react-icons/fa6';


interface Props{
  title : string;
  newElementButtonText : string;
  onCreateButtonClicked : () => void;
  children?: React.ReactNode
}

const SectionTitle = ({title,newElementButtonText, onCreateButtonClicked,  children} : Props) => {
  return (
    <div className='section-title'>
            <h1 className="main-title">{title}</h1>

            <div className='button-container'>
              <div className="classic-button-wrapper">
                {children}
              </div>
              <div className='title-plus-button' onClick={onCreateButtonClicked}>              
                <FaPlus className='plus-button' />
                <button>
                  {newElementButtonText}
                </button>
              </div>
            </div>
    </div>
  )
}

export default SectionTitle