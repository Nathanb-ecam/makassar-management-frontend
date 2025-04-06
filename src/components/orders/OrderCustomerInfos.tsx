import React from 'react'
import { Customer } from '../../models/entities'
import { FaUser } from 'react-icons/fa'
import { CiDeliveryTruck, CiMail } from 'react-icons/ci'

import '../css/order-customer-infos.css'
import { FaPhone } from 'react-icons/fa6'



const OrderCustomerInfos = ({customer} : Customer) => {
    
    if (customer == null) return <p>Customer not found</p>


    return (    
    <div className='customer-infos'>
      <div className='customer-card'>        
          <div className='card-title'>
            <FaUser />
            <label htmlFor="">{customer.name}</label>
          </div>
          <div className="card-content">

            <div className="customer-section">
                <h3 className='subsection-titles'>Contacts</h3>
                <div className='mail-phone'>
                    {customer.mail && customer.mail?.length>0 &&
                        <div className='mail'>
                            <CiMail />
                            <label>{customer.mail}</label>
                        </div>
                    }
                    
                    {customer.phone && customer.phone?.length>0 && 
                        <div className='phone'>
                            <FaPhone></FaPhone>
                            <label>{customer.phone}</label>
                        </div>
                    }
                </div>
            </div>

            <div className="customer-section">
                <h3 className='subsection-titles'>Company</h3>    
                <div className='company-data'>
                {customer.societyName && customer.societyName?.length>0 && <div className='societyName'>{customer.societyName}</div>}
                {customer.tva && customer.tva?.length>0 && <div className='tva'>VAT: {customer.tva}</div>}
                {customer.professionalAddress && <div className='professionalAddress'>{customer.professionalAddress ?? "Non renseignée"}</div>}        
                </div>
                
            </div>

            <div className="others-section">
                
                    {customer.shippingAddress && 
                    <>
                        <h3 className='subsection-titles'>Additional infos</h3>        
                        <div className="additional-infos">
                            <div className='shippingAddress'>
                                <CiDeliveryTruck />
                                <div>{customer.shippingAddress}</div>
                            </div>
                        </div>
                    </>
                    }
            </div>

            

          </div>                                                    
          
      </div>
    </div>    
  )
}

export default OrderCustomerInfos