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
import { BsHandbag } from 'react-icons/bs';
import BagModifier from '../components/bags/BagModifier.tsx';

const Bags = () => {


  const {auth} = useAuth();
  const {showTopMessage} = useTopMessage();

  const[bags,setBags] = useState<Bag[]>([]);
  
  const[modifiedBags, setModifiedBags] = useState<Map<string,Bag>>(new Map());
  
  const [createBagPopupVisible,setCreateBagPopupVisible] = useState(false);
  
  const[currentBagToModify, setCurrentBagToModify] = useState<Bag | undefined>(undefined);
  const [bagModifierVisible,setBagModifierVisible] = useState(false);
  

  const handleCreateButtonClicked = () => {
    setCreateBagPopupVisible(true)
  }

  const onCreateBagPopupClosed = ()=>{
    setCreateBagPopupVisible(false)
  }


  const onBagFormSubmit = async (formData: FormData)=>{
      const createdBag = await createBagWithImages(auth,formData)
      // console.log("createdBag",createdBag)
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
    // console.log("value",value)
    if (bagId === undefined || bagId === null) return 
    
    setModifiedBags(prev=>{
      if(!prev) return prev

      
      const updatedBags = new Map(prev)
      const bag = updatedBags.get(bagId)

      updatedBags.set(bagId, {...bag,[key]:value})

      return updatedBags
    })
  }

  const applyBagModifications = async (bagId : string, bagModifications : Bag) => {
    

    if(bagModifications === undefined) return 

    const result = await putBag(auth,bagId,bagModifications)
    if(result){      
      setBags(prev => {
        if (!prev) return prev;
  
        const updatedBags = prev.map(existingBag => {
          if(existingBag.id === bagId){
            const msg = `Modification de ${existingBag.marketingName} enregistrée`
            console.log(msg)
            showTopMessage(
              msg,
              {backgroundColor:'var(--info-green)'}
            )
            return {
              ...existingBag,
              ...bagModifications,
              imageUrls: existingBag.imageUrls
            }
          }else return existingBag
        });
  
        return updatedBags;
      });
    } 
    else {
      // console.log("shit")
      showTopMessage(
        `Une erreur s'est produite`, 
        {backgroundColor:'var(--info-red)'},
      )
    }

    setBagModifierVisible(false)
  
  }

  const removeBag = async (bag :Bag)=>{
      // console.log("bag to remove",bag)
      
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
        // console.log('Failed to delete bag')
      }
  }


  const showBagPopup = (bag : Bag) =>{
      // const bag = bags.find(b => b.id === bagId)
      // console.log("clicked bag",bag)
      setCurrentBagToModify(bag)
      setBagModifierVisible(true)
  }


  



  return (
    <div className='page'>
        
        <SectionTitle 
          title='Sacs' 
          newElementButtonText='Nouveau sac'
          onCreateButtonClicked={handleCreateButtonClicked}/>

        

        {bags &&  
          <div className="bags-list-wrapper">
            <div className='bags-list'>
              {bags.map((bag,index)=>(
                <div className="bag" key={index} onClick={() =>showBagPopup(bag)}>
  

                    {bag.imageUrls && 
                      <div className="bag-images">
                          <div className='bag-images-wrapper'>
                            {bag.imageUrls.length > 0 
                                  ?
                                    // bag.imageUrls.map((imageUrl,index)=>(
                                    //   <div className='bag-image-wrapper' key={index}>
                                    //     {/* <IoMdClose className='bag-image-close-btn' /> */}
                                    //     <img className='bag-image' key={index} src={`${BASE_IMAGES_URL}/${imageUrl}`}  alt={`${imageUrl}`}/>
                                    //   </div>
                                    // ))
                                    
                                      <div className='bag-image-wrapper' key={index}>
                                        {/* <IoMdClose className='bag-image-close-btn' /> */}
                                        <img className='bag-image' key={index} src={`${BASE_IMAGES_URL}/${bag.imageUrls[0]}`}  alt={`${bag.imageUrls[0]}`}/>
                                      </div>
                                    
                                  :<BsHandbag className='nobag-image'/>
                            } 
                          </div>
                      </div>
                    }
                    <div className="bag-info">              
                      <div className="bag-title">{bag.marketingName}</div>
                      <IoMdClose className='bag-delete-btn' onClick={(e)=>{e.stopPropagation(); removeBag(bag);}} />
                    </div>
                
                </div>
              ))}
            </div>
          </div>

          
 
        }




        {createBagPopupVisible ?
          <Popup 
              title='Ajouter un nouveau modèle' 
              onPopupClose={onCreateBagPopupClosed} 
              popupVisible={createBagPopupVisible}
              // customCSS={{height:"400px",minWidth:'45%',maxWidth:'45%'}}
              // customCSSPopupContent={{margin:'25px'}}
              >
              <BagForm onBagFormSubmit={onBagFormSubmit}></BagForm>
          </Popup>
          : null
        }

        {bagModifierVisible && <BagModifier 
                                  bag={currentBagToModify}  
                                  applyBagModifications={applyBagModifications}
                                  onPopupClose={()=>setBagModifierVisible(false)} 
                                  />
        }


    </div>
  )
}

export default Bags