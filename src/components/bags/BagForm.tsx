import React, { useEffect, useState } from 'react'
import { Bag } from '../../models/entities'

import '../css/bagform.css'

interface Props{
    onBagFormSubmit :(formData: FormData) => void;
}

const BagForm = ({onBagFormSubmit} : Props) => {
  
    const [bag,setBag] = useState<Bag>({
        marketingName:'',
        retailPrice:'',
        sku:'',

    })
    const [images,setImages] = useState<File[]>();
    const [fileSelection,setFileSelection] = useState<string[]>([]);

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setBag(prev=> prev ? {...prev, [name]:value} : prev)
    }
   
    const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        if (e.target.files) {
            // setImages(prev=> prev ? [...prev,...Array.from(e.target.files)] : prev); 
            const files = Array.from(e.target.files)
            const fileNames = files.map(file=> file.name)
            setFileSelection(prev=> prev ? fileNames : prev)
            setImages(files); 
        }else{
            console.log("No files received by selection")
        }
    }

    const handleBagSubmit = (e : React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        const formData = new FormData();
        formData.append("data",JSON.stringify(bag))

        images?.forEach((image : File)=>{
            formData.append("image",image)
            // console.log(image)
        })
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        onBagFormSubmit(formData)
        
    }


    return (
    <form onSubmit={handleBagSubmit} className='create-bag-form'>
        <div className='form-field-wrapper'>
            <label htmlFor="marketingName">Nom du sac:</label>
            <input 
                required
                type="text" 
                id='marketingName'
                name='marketingName'
                value={bag.marketingName}
                onChange={handleInputChange}
            />
        </div>

        <div className='form-field-wrapper'>
            <label htmlFor="retailPrice">Prix:</label>
            <input 
                required
                type="number" 
                id='retailPrice'
                name='retailPrice'
                value={bag.retailPrice}
                onChange={handleInputChange}
            />
        </div>

        <div className='form-field-wrapper'>
            <label htmlFor="sku">SKU:</label>
            <input 
                type="number" 
                id='sku'
                name='sku'
                value={bag.sku}
                onChange={handleInputChange}
            />
        </div>

        <div className='image-form-field-wrapper'>
            <label htmlFor="">Ajouter des images:</label>
            <input 
                id='fileInput'
                style={{display:'none'}}
                className='file-select-input'
                type="file" 
                multiple
                accept=".jpeg, .jpg, .png, image/jpeg, image/jpg, image/png"
                onChange={handleImageChange}
            />
            <label htmlFor="fileInput" className='custom-file-upload'>Sélectionner</label>
            {fileSelection && fileSelection.length > 0 &&
                <div className='custom-file-message'>
                    {fileSelection.map((fileName,index)=>(
                        <label className='filename' key={index}>{fileName}</label>
                    ))}
                </div>
            }
        </div>

        <input className='bag-form-submit' type="submit" value="Confirmer" />



    </form>
  )
}

export default BagForm