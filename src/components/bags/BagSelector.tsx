import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { Bag } from '../../models/entities.ts';
import { getBags } from '../../api/calls/Bag.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';






import '../css/bagselector.css'
import BagCard from './BagCard.tsx';


interface Props {
    addBagsToCurrentBags: (bags : Map<string,{bag: Bag, quantity: number}>) => void;
    customBagSelectionWrapperCSS?: React.CSSProperties;
    customButtonSectionStyle?: React.CSSProperties;
    customSaveButtonStyle?: React.CSSProperties;
}

const BagSelector = React.forwardRef(({ addBagsToCurrentBags,customBagSelectionWrapperCSS,customButtonSectionStyle,customSaveButtonStyle }: Props,ref ) => {

    const {auth} = useAuth();
    const[bags,setBags] = useState<Bag[]>([]);

    const [selectedBags,setSelectedBags] = useState<Map<string,{bag:Bag, quantity : number}>>(new Map());
    const [selectionPrice,setSelectionPrice] = useState(0)
    

    const [error,setError] = useState('');


    useImperativeHandle(ref,()=>({
        getSelectionPrice(){
            return selectionPrice
        }
        
    }))


    useEffect(()=>{
        const fetchBags = async()=> {
            const {bags,err} = await getBags(auth);
            if(err === undefined) setBags(bags)
            else setError(err)
        }

        fetchBags()
    },[])

    useEffect(()=>{

        var totalPrice = 0
        selectedBags.forEach(({bag,quantity})=>{
            totalPrice += (Number(bag.retailPrice) * quantity)
        })
        setSelectionPrice(totalPrice)

    },[selectedBags])

    const getSelectionPrice = () => {
        return selectionPrice
    }


    const handleBagQuantityChange =(bag: Bag, quantity: number) => {
        setSelectedBags(prev => {
            if (!prev || bag.id === undefined) return prev;

            const updatedBags = new Map(prev);
            updatedBags.set(bag.id, { bag, quantity });

             

            return updatedBags;
        });
    }


    const saveBagsSelection = () =>{
        // console.log(selectedBags)
        addBagsToCurrentBags(selectedBags)
    }

  return (
    <>
        {bags instanceof Array && bags.length >= 1 &&
        <div className='bag-selector-container' style={customBagSelectionWrapperCSS}>
                {/* <div className='bag-selector-name'>
                    Sélection des sacs:
                </div> */}

                <div className="bag-selection-list">
                
                {bags ?
                        bags.map((bag,index)=>(
                            // <div 
                            // className={`bag-list-item`} 
                            // key={index} 
                            // // onClick={()=>handleSelectedBag(index,bag)}
                            // >
                                <BagCard key={index} bag={bag} initialQuantity={0} updateBagQuantity={handleBagQuantityChange} bottomVisible={false}>

                                </BagCard>
                            // </div>
                            )
                        )
                        
                        : <p>{error}</p>
                    }
                </div>
                


                <div className='bottom-section' style={customButtonSectionStyle} >
                    <button type="button" style={customSaveButtonStyle} onClick={saveBagsSelection}>Enregistrer la sélection</button>
                </div>

            
        </div>
        }
    </>

  )
})

export default BagSelector



