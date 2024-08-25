import React, { useEffect, useState } from 'react'

import SectionTitle from '../components/main/SectionTitle.tsx'

import './css/bags.css'
import Popup from '../components/main/Popup.tsx';
import BagSelectorPopup from '../components/bags/BagSelectorPopup.tsx';
import { Bag } from '../models/entities.ts';

import BagForm from '../components/bags/BagForm.tsx'
import { createBagWithImages, getBags, putBag } from '../api/calls/Bag.tsx';
import { useAuth } from '../hooks/useAuth.tsx';
import axios from '../api/axios.ts';
import GeneralCRUDTable, { TableProps } from '../components/main/GeneralCRUDTable.tsx';
import { BASE_IMAGES_URL } from '../../constants.tsx';
import { CiSquarePlus } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';

const Bags = () => {


  const {auth} = useAuth();

  const[bags,setBags] = useState<Bag[]>([]);
  
  const[modifiedBags, setModifiedBags] = useState<Map<string,Bag>>(new Map());
  
  const [createBagPopupVisible,setCreateBagPopupVisible] = useState(false);
  

  const handleCreateButtonClicked = () => {
    setCreateBagPopupVisible(true)
  }

  const onCreateBagPopupClosed = ()=>{
    setCreateBagPopupVisible(false)
  }

  const handleNewBag = (bag : Bag, quantity :  number) =>{
      console.log("New bafg", bag, quantity)
  }

  const onBagFormSubmit = async (formData: FormData)=>{
      const bagBeenCreated = await createBagWithImages(auth,formData)
      console.log(bagBeenCreated)
      
  }

  useEffect(()=>{
    console.log("modifiedBags",modifiedBags)
  },[modifiedBags])


  useEffect(()=>{
    const fetchBags = async ()=>{
      const result = await getBags(auth);
      if(result.err) return 
      else if(result.bags){
        setBags(result.bags)
      }
    }

    fetchBags()
  },[])


  const handleDivChange = (bagId :string | undefined, key: string, value: string) => {
    
    if (bagId === undefined || bagId === null) return 
    
    setModifiedBags(prev=>{
      if(!prev) return prev

      
      const updatedBags = new Map(prev)
      const bag = updatedBags.get(bagId)

      updatedBags.set(bagId, {...bag,[key]:value})

      return updatedBags
    })
  }

  const applyBagModifications = async (bagId : string) => {
    const bagToApply = modifiedBags.get(bagId)
    if(bagToApply === undefined) return 

    const result = await putBag(auth,bagId,bagToApply)
    if(result) console.log(`successfully updated bag with id ${bagId}`)
    else console.log("shit")

  }


  



  return (
    <div className='page'>
        
        {createBagPopupVisible ?
          <Popup title='Ajouter un nouveau modèle' onPopupClose={onCreateBagPopupClosed}>
              <BagForm onBagFormSubmit={onBagFormSubmit}></BagForm>
          </Popup>
          : null
        }
        
        <SectionTitle title='Sacs' onCreateButtonClicked={handleCreateButtonClicked}/>

        

        {bags && 
          <div className='bags-list'>
            {bags.map((bag,index)=>(
              <div className="bag" key={index}>
                  <div className="bag-header">
                    <div className="bag-title">{bag.marketingName}</div>
                    <IoMdClose className='bag-delete-btn' />
                  </div>


                  {bag.imageUrls && bag.imageUrls.length > 0 &&
                    <div className="bag-images">
                        <div className='bag-images-wrapper'>
                          {bag.imageUrls.map((imageUrl,index)=>(
                            <div className='bag-image-wrapper' key={index}>
                              <IoMdClose className='bag-image-close-btn' />
                              <img className='bag-image' key={index} src={`${BASE_IMAGES_URL}/${imageUrl}`}  alt={`${imageUrl}`}/>
                            </div>
                          ))}
                        </div>
                    </div>
                  }


                  <div className="bag-props">                  
                    
                    <div className='bag-prop'>
                      <div 
                        contentEditable={true}
                        suppressContentEditableWarning={true} 
                        onBlur={(e) => handleDivChange(bag.id,"retailPrice", (e.target as HTMLElement).innerText)}
                        >
                         {bag.retailPrice} 
                      </div>
                    </div>

                    <div className='bag-prop'>
                      <div 
                        contentEditable={true}
                        suppressContentEditableWarning={true} 
                        onBlur={(e) => handleDivChange(bag.id,"sku", (e.target as HTMLElement).innerText)}
                        >
                         {bag.sku} 
                      </div>
                    </div>
                    
                    
                    {/* <div className='bag-prop'>
                      <label htmlFor="sku">Bandouillière: </label>
                      <select name="bag-part" id="bag-part"> 
                          <option value="b1">Bandouillière MAO M</option>
                          <option value="d1">Doublure MAO Verte M</option>
                      </select>
                    </div> */}

                    <div 
                    onClick={()=>applyBagModifications(bag.id)}      
                    className={`apply-bag-modification ${Array.from(modifiedBags.keys()).includes(bag.id) ? 'bag-mod-visible':''}`}
                    >  
                      <button>
                        Appliquer les modifications
                      </button>
                    </div>
                  </div>
              
              </div>
            ))}
          </div>
        }


    </div>
  )
}

export default Bags