import React, { useEffect, useState } from 'react';
import { CiSquarePlus } from 'react-icons/ci';
import SectionTitle from '../components/main/SectionTitle';
import GeneralCRUDTable, { CRUDHandlers, DataItem, TableProps } from '../components/main/GeneralCRUDTable';
import { createCustomer, deleteCustomerWithId, getAllCustomers, modifyCustomerWithid } from '../api/calls/Customer';
import { useAuth } from '../hooks/useAuth';
import Popup from '../components/main/Popup';
import { Customer } from '../models/entities';
import CustomerForm from '../components/customers/CustomerForm.tsx';
import { useTopMessage } from '../hooks/useTopMessagePopup.tsx';
import { getTimeStamp } from '../utils/formatTime.tsx';
import useRefreshToken from '../hooks/useRefreshToken.tsx';


const Customers = () => {
  
  const {auth} = useAuth();

  const refresh = useRefreshToken()

  const {showTopMessage} = useTopMessage()

  const headers = [
    // {key : 'id', label:'Id'},
    {key : 'name', label:'Nom'},
    {key : 'phone', label:'Téléphone'}, 
    {key : 'mail', label:'Mail'},
    {key : 'tva', label:'Tva'},
    {key : 'professionalAddress', label:'Adr. profesionnelle'},
    {key : 'shippingAddress', label:'Adr. de livraison'},
    {key : 'type', label:'Type'},
    {key : 'createdAt', label:'Création'},
    {key : 'updatedAt', label:'Der. modification'},
  ]

  const largeColumns = ['professionalAddress','shippingAddress','createdAt','updatedAt']
  const importantColumns = ['name','phone','mail','tva','shippingAddress','type']
  
  // const [customers, setCustomers] = useState<Customer[]>([]);
  const [tableProps, setTableProps] = useState<TableProps>({
    headers,
    data: [],
    largeColumns,
    importantColumns
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
    const {id, err} = await createCustomer(auth,customer);
    if(err) {
      console.log(err)
      return
    }
    const customerWithid = {
      ...customer,
      id: id
    }
  
    setTableProps(prev=>{
      if(!prev) return prev
      const updatedData = prev.data
      updatedData.push(customerWithid)

      return {
        ...prev,
        data: updatedData
      }
    })
    setCreateCustomerPopupVisible(false)
  }

  const onModifiedRow = async (customerId: string, key : string, value : any)=>{


    const customers = tableProps.data
    console.log("customerId,key,value")
    console.log(customerId,key,value)

    const keys = key.split('.')
    var originalFieldValue : any= null
    var modifiedData : any= null

    if(keys.length === 1){
      originalFieldValue = customers.find(c=>c.id === customerId)?.[key]
      modifiedData = {[key] : value}

    }else if(keys.length === 2){      
      const customer =  customers.find(c=>c.id === customerId)
      const oldProperties = customer?.[keys[0]]
      console.log("oldProperties")
      console.log(oldProperties)
      originalFieldValue = customer?.[keys[0]]?.[keys[1]]
      modifiedData = {        
        [keys[0]] : {
          ...oldProperties,
          [keys[1]]:value
        }
      }
    }
    
    
    if(originalFieldValue === value) return 
  
  
    const {id, err, errMsg} = await modifyCustomerWithid(auth,customerId,modifiedData)
  
    console.log(modifiedData)
    if(!err){
      showTopMessage("Client modifié", {backgroundColor:'var(--info-green)'})

      setTableProps(prev => {
        const customerIndex = prev.data.findIndex(d => d.id === id);

        if (customerIndex === -1) return prev; 
  
        
        const updatedCustomer = {
          ...prev.data[customerIndex],
          ...modifiedData, 
        }
        const updatedData = [
          ...prev.data.slice(0, customerIndex),
          updatedCustomer,
          ...prev.data.slice(customerIndex + 1)
        ];
  
        
        return {
          ...prev,
          data: updatedData
        };


      })
    }else{
      console.log("modifyCutomer: ", errMsg)
      if(err?.response.status === 401){
        console.log("refresh")
        await refresh()
      }
      console.log("Sent payload: ", modifiedData)
      showTopMessage("Erreur lors de la modification du client", {backgroundColor:'var(--info-red)'})
    }
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
        <SectionTitle title='Clients' onCreateButtonClicked={onCreateCustomerButtonClicked}>
    
        </SectionTitle>

        <GeneralCRUDTable tableProps={tableProps} handlers={handlers}/>
    </div>
  );
};

export default Customers;
