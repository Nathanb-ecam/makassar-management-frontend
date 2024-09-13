import React from 'react'
import { CiSquarePlus } from 'react-icons/ci'

import '../css/sectionTitle.css'


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
              <button className='title-plus-button' onClick={onCreateButtonClicked}>
                {newElementButtonText}
                {/* <CiSquarePlus className='plus-button' /> */}
              </button>
            </div>
    </div>
  )
}

export default SectionTitle