import React, { useState } from 'react'

import '../css/generalCRUDtable.css'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { formatTime } from '../../utils/formatTime';
import { useTopMessage } from '../../hooks/useTopMessagePopup';

type Header = {
    key: string;
    label: string;
    size: HeaderSizeClass;
}

export enum HeaderSizeClass{
    SMALL="small",
    MEDIUM="medium",
    LARGE="large",
}

export type DataItem = {
    [key : string]: any;
}

export interface TableProps{
    headers : Header[];
    data : DataItem[];
}

export interface CRUDHandlers{
    // onCreateRow: ()=>void;
    onModifiedRow: (id : string, key : string, value : any)=>void;
    onDeleteRow: (id : string)=>void;
}

interface Props{
    tableProps : TableProps;
    handlers: CRUDHandlers;
}

const GeneralCRUDTable = ({tableProps,handlers} : Props) => {

    const [actualTableData, setActualTableData] = useState();

    const {showTopMessage} = useTopMessage()
    

    // console.log(tableProps.data)

    // tableProps.data.map((dataItem,index)=>{
    //     console.log(dataItem)
    // })

    const renderDataItem = (itemId: string,  fieldName : string, fieldValue: any , itemSizeClass : string)=>{

        const editable = !(fieldName === 'createdAt' || fieldName === 'updatedAt')


        return <div                
                contentEditable={editable}
                suppressContentEditableWarning={editable}
                className={`row-field ${itemSizeClass}`}  
                // content={`${item === null ? 'remplacable' : null }`}               
                onBlur={(e)=>editable ? handlers.onModifiedRow(itemId, fieldName, (e.target as HTMLElement).innerText) : null}
                >

                    {editable ? fieldValue : formatTime(fieldValue)}
            
                </div>




    }


  return (
    <div className='general-crud-wrapper'>
    
        <div className='general-crud-table'>
            <div className='header-row'>
                {tableProps.headers && tableProps.headers.map(({key,label,size},index)=>{
 
                    return <div key={index} className={`row-item ${size}`}>
                                {label}
                           </div>
                })}
                <div className="row-field actions-col">
                    
                </div>
            </div>

            
            {tableProps.data instanceof Array && tableProps.data.map((dataItem,rowIndex)=>(
                <div className='content-row' key={rowIndex}>
                    {tableProps.headers && tableProps.headers.map(({ key, label, size }) => (

                            <React.Fragment key={`row-${rowIndex}-${key}`}>
                                {dataItem && dataItem[key] !== undefined ? 
                                                                            renderDataItem(
                                                                                dataItem.id,
                                                                                key,
                                                                                dataItem[key],
                                                                                size
                                                                                )
                                                                            : <div className={`row-field ${size}`}></div>}
                            </React.Fragment>                                        
                        
                    ))}
                    <div className="row-item actions-col">
                        <RiDeleteBin6Line onClick={() => handlers.onDeleteRow(dataItem.id)} />
                    </div>
                </div> 
            ))}
            
        </div>
    </div>
  )
}

export default GeneralCRUDTable