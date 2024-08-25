import React, { useEffect, useState } from 'react';
import { CiSquarePlus } from 'react-icons/ci';
import SectionTitle from '../components/main/SectionTitle';
import GeneralCRUDTable, { CRUDHandlers, DataItem, TableProps } from '../components/main/GeneralCRUDTable';
import { createCustomer, deleteCustomerWithId, getAllCustomers } from '../api/calls/Customer';
import { useAuth } from '../hooks/useAuth';
import CustomerForm, { CustomerFormData } from '../components/customers/CustomerForm';
import Popup from '../components/main/Popup';
import { Customer } from '../models/entities';


const Customers = () => {
  
  const {auth} = useAuth();

  const headers = [
    // {key : 'id', label:'Id'},
    {key : 'name', label:'Nom'},
    {key : 'phone', label:'Téléphone'}, 
    {key : 'mail', label:'Mail'},
    {key : 'tva', label:'Tva'},
    {key : 'professionalAddress', label:'Adr. profesionnelle'},
    {key : 'shippingAddress', label:'Adr. de livraison'},
    {key : 'type', label:'Type'},
    {key : 'createdAt', label:'Prem. modification'},
    {key : 'updatedAt', label:'Der. modification'},
  ]

  const largeColumns = ['professionalAddress','shippingAddress','createdAt','updatedAt']
  
  // const [customers, setCustomers] = useState<Customer[]>([]);
  const [tableProps, setTableProps] = useState<TableProps>({
    headers,
    data: [],
    largeColumns
  });


  const [createCustomerPopupVisible,setCreateCustomerPopupVisible] = useState(false);


  useEffect(()=>{


    const fetchCustomers = async ()=>{
      const customers = await getAllCustomers(auth);
      // setCustomers(customers)
      setTableProps(prev =>{
        if(!prev) return prev
        return {
          ...prev,
          data:customers
        }
      })
    } 
    fetchCustomers()

  },[])

  const onCreateCustomerButtonClicked = () =>{
    setCreateCustomerPopupVisible(true)
  }

  const onPopupClose = ()=>{
    setCreateCustomerPopupVisible(false)
  }


  const handleCreateCustomer = async (e : React.FormEvent<HTMLFormElement> , customer : Customer)=>{
    e.preventDefault()
    console.log("received customer", customer)
    const successfullyCreated = await createCustomer(auth,customer);
    console.log("successfullyCreated",successfullyCreated)
    setTableProps(prev=>{
      if(!prev) return prev
      const updatedData = prev.data
      updatedData.push(customer)

      return {
        ...prev,
        data: updatedData
      }
    })
    setCreateCustomerPopupVisible(false)
  }

  const onModifiedRow = (id: string)=>{


  }
  const onDeleteRow = async (id : string)=>{
    console.log(`Customer to delete : ${id}`)
    const customerDeleted = await deleteCustomerWithId(auth,id) 
    
    if(customerDeleted){
      setTableProps(prev=>{
        if(!prev) return prev

        const filteredData = prev.data.filter((item : DataItem) => item.id !== id)
        return {
          ...prev,
          data: filteredData
        }
      }) 
    }
  
  }


  const handlers: CRUDHandlers = {
    // onCreateRow,
    onModifiedRow,
    onDeleteRow
  };


  return (
    <div className="page">
        {createCustomerPopupVisible ? 
          <Popup title='Créer un nouveau client' onPopupClose={onPopupClose} >
            <CustomerForm onFormSubmit={handleCreateCustomer} />
          </Popup>
        : null
        }
        <SectionTitle title='Customers' onCreateButtonClicked={onCreateCustomerButtonClicked}>
    
        </SectionTitle>

        <GeneralCRUDTable tableProps={tableProps} handlers={handlers}/>
    </div>
  );
};

export default Customers;
