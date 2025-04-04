import React from 'react'
import { Customer } from '../../models/entities'
import { FaUser } from 'react-icons/fa'
import { CiDeliveryTruck } from 'react-icons/ci'



const OrderCustomerInfos = ({customer} : Customer) => {
    
    if (customer == null) return <p>Customer not found</p>


    return (    
    <div className='customer-infos'>
      <div className='customer-card'>        
          <div className="title-row">
            <FaUser />
            {customer.name}
          </div>
          {customer.mail && customer.mail?.length>0 &&<div className='mail'>{customer.mail}</div>}
          {customer.phone && customer.phone?.length>0 && <div className='phone'>{customer.phone}</div>}
          {customer.tva && customer.tva?.length>0 && <div className='tva'>(VAT: {customer.tva})</div>}
          {customer.shippingAddress && <div className='shippingAddress'>
            <CiDeliveryTruck />
            {customer.shippingAddress}
          </div>}
          {customer.professionalAddress && <div className='professionalAddress'>Adresse pro:{customer.professionalAddress ?? "Non renseignée"}</div>}        
      </div>
    </div>    
  )
}

export default OrderCustomerInfos