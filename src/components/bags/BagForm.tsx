import React, { useEffect, useState } from 'react'
import { Bag } from '../../models/entities'

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

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setBag(prev=> prev ? {...prev, [name]:value} : prev)
    }
   
    const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        if (e.target.files) {
            // setImages(prev=> prev ? [...prev,...Array.from(e.target.files)] : prev); 
            setImages(Array.from(e.target.files)); 
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
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        onBagFormSubmit(formData)
    }


    return (
    <form onSubmit={handleBagSubmit} className='create-bag-form'>
        <div className='form-field-wrapper'>
            <label htmlFor="">Nom du sac:</label>
            <input 
                required
                type="text" 
                name='marketingName'
                value={bag.marketingName}
                onChange={handleInputChange}
            />
        </div>

        <div className='form-field-wrapper'>
            <label htmlFor="">Prix:</label>
            <input 
                required
                type="text" 
                name='retailPrice'
                value={bag.retailPrice}
                onChange={handleInputChange}
            />
        </div>

        <div className='form-field-wrapper'>
            <label htmlFor="">SKU:</label>
            <input 
                type="text" 
                name='sku'
                value={bag.sku}
                onChange={handleInputChange}
            />
        </div>

        <div className='form-field-wrapper'>
            <label htmlFor="">Images:</label>
            <input 
                // name='sku'
                // value={formData.sku}
                type="file" 
                multiple
                accept=".jpeg, .jpg, .png, image/jpeg, image/jpg, image/png"
                onChange={handleImageChange}
            />
        </div>

        <input type="submit" value="Créer" />



    </form>
  )
}

export default BagForm