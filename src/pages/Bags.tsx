import React, { useEffect, useState } from 'react'

import SectionTitle from '../components/main/SectionTitle.tsx'

import './css/bags.css'
import Popup from '../components/main/Popup.tsx';
import BagSelectorPopup from '../components/bags/BagSelector.tsx';
import { Bag } from '../models/entities.ts';

import BagForm from '../components/bags/BagForm.tsx'
import { createBagWithImages, deleteBag, getBags, putBag } from '../api/calls/Bag.tsx';
import { useAuth } from '../hooks/useAuth.tsx';
import axios from '../api/axios.ts';
import GeneralCRUDTable, { TableProps } from '../components/main/GeneralCRUDTable.tsx';
import { BASE_IMAGES_URL } from '../../constants.tsx';
import { CiSquarePlus } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import TopMessagePopup from '../components/main/TopMessagePopup.tsx';
import { useTopMessage } from '../hooks/useTopMessagePopup.tsx';

const Bags = () => {


  const {auth} = useAuth();
  const {showTopMessage} = useTopMessage();

  const[bags,setBags] = useState<Bag[]>([]);
  
  const[modifiedBags, setModifiedBags] = useState<Map<string,Bag>>(new Map());
  
  const [createBagPopupVisible,setCreateBagPopupVisible] = useState(false);

  

  const handleCreateButtonClicked = () => {
    setCreateBagPopupVisible(true)
  }

  const onCreateBagPopupClosed = ()=>{
    setCreateBagPopupVisible(false)
  }


  const onBagFormSubmit = async (formData: FormData)=>{
      const createdBag = await createBagWithImages(auth,formData)
      console.log("createdBag",createdBag)
      setCreateBagPopupVisible(false)      
      if(createdBag){
        showTopMessage(
            `Nouveau sac : ${createdBag.marketingName}`, 
            {backgroundColor:'var(--info-green)'},
        )
        setBags(prev=> {
          if(!prev) return prev

          const updated = Array.from(prev)
          updated.push(createdBag)
          return updated
        
        })
      }
      
  }


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
    console.log("value",value)
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
    if(result){
      const msg = `successfully updated bag with id ${bagId}`
      console.log(msg)
      showTopMessage(
        `Modification enregistrée`, 
        {backgroundColor:'var(--info-green)'}
      )
      setModifiedBags(prev=>{
        if(!prev) return prev
        const updated = new Map(prev)
        updated.delete(bagId)
        return updated
      })
    } 
    else {
      console.log("shit")
      showTopMessage(
        `Une erreur s'est produite`, 
        {backgroundColor:'var(--info-red)'},
      )
    }
    

  }

  const removeBag = async (bag :Bag)=>{
      console.log("bag to remove",bag)
      
      if (bag.id === undefined) return 

      const imageUrls = bag?.imageUrls ?? []

      const result = await deleteBag(auth,bag.id,imageUrls)
      if(result) {
        setBags(prev=>{
          if(!prev) return prev
          
          const updated  = prev.filter(currBag => currBag.id != bag.id)
          return updated
        }) 

        showTopMessage(
          `Sac supprimé : ${bag.marketingName}`, 
          {backgroundColor:'var(--info-green)'},
        )

      }else{
        console.log('Failed to delete bag')
      }
  }


  



  return (
    <div className='page'>

        
        {createBagPopupVisible ?
          <Popup 
              title='Ajouter un nouveau modèle' 
              onPopupClose={onCreateBagPopupClosed} 
              popupVisible={createBagPopupVisible}
              customCSS={{height:"400px"}}
              >
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
                    <IoMdClose className='bag-delete-btn' onClick={()=>removeBag(bag)} />
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
                      <label htmlFor="marketingName" className='bag-prop-text'>Modèle: </label>
                      <div className='bag-prop-item-wrapper'>
                        <div 
                          id="marketingName"
                          contentEditable={true}
                          suppressContentEditableWarning={true} 
                          onInput={(e) => handleDivChange(bag.id,"marketingName", (e.target as HTMLElement).innerText)}
                          >
                          {bag.marketingName} 
                        </div>
                      </div>
                    </div>

                    <div className='bag-prop'>
                      <label htmlFor="retailPrice" className='bag-prop-text'>Prix: </label>
                      <div className='bag-prop-item-wrapper'>
                        <div 
                          id='retailPrice'
                          contentEditable={true}
                          suppressContentEditableWarning={true} 
                          onInput={(e) => handleDivChange(bag.id,"retailPrice", (e.target as HTMLElement).innerText)}
                          >
                          {bag.retailPrice} 
                        </div>
                        <label>€</label>
                      </div>
                    </div>

                    <div className='bag-prop'>
                      <label htmlFor="sku" className='bag-prop-text'>SKU: </label>
                      <div className='bag-prop-item-wrapper'>
                        <div 
                          id="sku"
                          contentEditable={true}
                          suppressContentEditableWarning={true} 
                          onInput={(e) => handleDivChange(bag.id,"sku", (e.target as HTMLElement).innerText)}
                          >
                          {bag.sku} 
                        </div>
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
                       
                    className={`apply-bag-modification ${Array.from(modifiedBags.keys()).includes(bag.id) ? 'bag-mod-visible':''}`}
                    >  
                      <button onClick={()=>applyBagModifications(bag.id)}   >
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