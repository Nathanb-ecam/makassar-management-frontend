import React, { useState } from 'react';
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
    professionalAddress: {address:'',country:'',postalCode:''},
    shippingAddress: {address:'',country:'',postalCode:''},
    type: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.') || name.startsWith('professionalAddress.')) {
      console.log("1")
      setCustomerFormData((prev)=>{
        const [parentKey,childKey] = name.split('.')
        console.log(parentKey,childKey)
        return {
          ...prev,
          [parentKey] : {
            ...prev[parentKey],
            [childKey] : value
          },

        }
      })
    }else{
      setCustomerFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
          <label>Adresse pro:</label>
          <div className="address">
            <div className='postal-country'>
              <input
                placeholder=' Pays'
                type="text"
                id="professionalAddress.country"
                name="professionalAddress.country"
                value={customerFormData.professionalAddress?.country}
                onChange={handleInputChange}
              />
              <input
                placeholder='Code postal'
                type="text"
                id="professionalAddress.postalCode"
                name="professionalAddress.postalCode"
                value={customerFormData.professionalAddress?.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <input
              placeholder=' Ex: Av de la bourgogne 23'
              type="text"
              id="professionalAddress.address"
              name="professionalAddress.address"
              value={customerFormData.professionalAddress?.address}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="customer-form-field address-field">
          <label >Adresse de livraison:</label>
        
          <div className="address">
            <div className='postal-country'>
              <input
                placeholder=' Pays'
                type="text"
                id="shippingAddress.country"
                name="shippingAddress.country"
                value={customerFormData.shippingAddress?.country}
                onChange={handleInputChange}
              />
              <input
                placeholder=' Code postal'
                type="text"
                id="shippingAddress.postalCode"
                name="shippingAddress.postalCode"
                value={customerFormData.shippingAddress?.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <input
              placeholder=' Ex: Av de la bourgogne 23'
              type="text"
              id="shippingAddress.address"
              name="shippingAddress.address"
              value={customerFormData.shippingAddress?.address}
              onChange={handleInputChange}
            />
          </div>
        </div>


      </div>

      <input type="submit" value="Créer" />
    </form>
  );
};

export default CustomerForm;
