import React, { useEffect, useState } from 'react';
import '../css/customer-form.css';

import {Customer} from '../../models/entities'


interface Props {
  onFormSubmit: (e : React.FormEvent<HTMLFormElement>,formData: Customer) => void;
}

const CustomerForm = ({ onFormSubmit }: Props) => {
  const [customerFormData, setCustomerFormData] = useState<Customer>({
    name: '',
    mail: '',
    phone: '',
    tva: '',
    professionalAddress:'',
    shippingAddress: '',
    // professionalAddress: {address:'',country:'',postalCode:''},
    // shippingAddress: {address:'',country:'',postalCode:''},
    type: '',
  });

  // useEffect(()=>{
  //   console.log(customerFormData)
  // },[customerFormData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // if (name.startsWith('shippingAddress.') || name.startsWith('professionalAddress.')) {
    //   console.log("1")
    //   setCustomerFormData((prev)=>{
    //     const [parentKey,childKey] = name.split('.')
    //     console.log(parentKey,childKey)
    //     return {
    //       ...prev,
    //       [parentKey] : {
    //         ...prev[parentKey],
    //         [childKey] : value
    //       },

    //     }
    //   })
    // }else{
    //   setCustomerFormData((prev) => ({
    //     ...prev,
    //     [name]: value,
    //   }));
    // }

    setCustomerFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <form className="create-customer-form" onSubmit={(e)=>onFormSubmit(e,customerFormData)}>
      <div className='form-fields-wrapper'>
        <div className="customer-form-field">
          <label htmlFor="name">Nom:</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            value={customerFormData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="customer-form-field">
          <label htmlFor="mail">Mail:</label>
          <input
            type="text"
            id="mail"
            name="mail"
            value={customerFormData.mail}
            onChange={handleInputChange}
          />
        </div>

        <div className="customer-form-field">
          <label htmlFor="tva">Tva:</label>
          <input
            type="text"
            id="tva"
            name="tva"
            value={customerFormData.tva}
            onChange={handleInputChange}
          />
        </div>

        <div className="customer-form-field">
          <label htmlFor="phone">Téléphone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={customerFormData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="customer-form-field">
          <label htmlFor="type">Type:</label>
          <select 
              name="type" id="type"
              value={customerFormData.type}
              onChange={handleInputChange}

              >
            <option value="Professionel">Professionnel</option>
            <option value="Indépendant">Particulier</option>
          </select>
        </div>

        <div className="customer-form-field address-field">
            <div className="address-pro">
              <label>Adresse pro:</label>
              <input
                placeholder='Ex: Av de la bourgogne 23, 1640 Rhode'
                type="text"
                id="professionalAddress"
                name="professionalAddress"
                value={customerFormData.professionalAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="address-delivery">
              <label >Adresse de livraison:</label>        
              <input
                placeholder='Ex: Av de la bourgogne 23, 1640 Rhode'
                type="text"
                id="shippingAddress"
                name="shippingAddress"
                value={customerFormData.shippingAddress}
                onChange={handleInputChange}
              />
            </div>
        
        
        </div>
    
        <div className='submit-btn-wrapper'>

          <input className='customer-form-submit' type="submit" value="Créer" />
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
