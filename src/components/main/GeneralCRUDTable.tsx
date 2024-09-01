import React, { useState } from 'react'

import '../css/generalCRUDtable.css'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { formatTime } from '../../utils/formatTime';

type Header = {
    key: string;
    label: string;
}

export type DataItem = {
    [key : string]: any;
}

export interface TableProps{
    headers : Header[];
    data : DataItem[];
    largeColumns: string[];
    importantColumns: string[];
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


    // console.log(tableProps.data)

    // tableProps.data.map((dataItem,index)=>{
    //     console.log(dataItem)
    // })

    const renderDataItem = (itemId: string, item: any, fieldName : string)=>{
        
        if(item === undefined || item === null){ 
            return <div
                    key={`${fieldName}`}
                    contentEditable={true}
                    suppressContentEditableWarning={true}                        
                    onBlur={(e)=>handlers.onModifiedRow(itemId, fieldName, (e.target as HTMLElement).innerText)}
                    >
                        /
                    </div>
        }
        // console.log(`type at ${fieldName}`,typeof(item))

        if(fieldName === 'createdAt' || fieldName === 'updatedAt') return formatTime(item)
        
        if (typeof(item) === 'object') {
        
            return (
                <div className='object-col'>
                    {Object.keys(item).map((key,index) => (
                        <div 
                        key={`${fieldName}.${key}`}
                        contentEditable={true}
                        suppressContentEditableWarning={true}                        
                        onBlur={(e)=>handlers.onModifiedRow(itemId, `${fieldName}.${key}`, (e.target as HTMLElement).innerText)}
                        >
                            {item[key]}
                        </div>
                    ))}
                </div>
            );
        }

        else if(typeof(item)==='string'){
            if(item.length === 0) return <div>Wut</div>
            else return <div
                        key={`${fieldName}`}
                        contentEditable={true}
                        suppressContentEditableWarning={true}                        
                        onBlur={(e)=>handlers.onModifiedRow(itemId, fieldName, (e.target as HTMLElement).innerText)}
                        >
                    {item?.toString()}
                </div>;
        }

    }


  return (
    <div className='general-crud-wrapper'>
    
        <div className='general-crud-table'>
            <div className='header-row'>
                {tableProps.headers && tableProps.headers.map(({key,label},index)=>(
                    <div 
                    className={`row-field 
                        ${tableProps.largeColumns.includes(key) ? 'large' :''}
                        ${tableProps.importantColumns.includes(key) ? '' :'hidden'}
                        `
                    } 
                    key={index}>
                        {label}
                    </div>
                ))}
                <div className="row-field actions-col">
                    
                </div>
            </div>

            
            {tableProps.data && tableProps.data.map((dataItem,rowIndex)=>(
                <div className='content-row' key={rowIndex}>
                    {tableProps.headers && tableProps.headers.map(({ key }) => {
                         if(typeof dataItem[key] && typeof dataItem[key] === 'object'){
                            return <div                                                     
                            className={`row-item 
                                ${tableProps.largeColumns.includes(key) ? 'large':''}
                                ${tableProps.importantColumns.includes(key) ? '':'hidden'}
                                `
                            } 
                            key={`${rowIndex}-${key}`}>
                                {
                                    dataItem && dataItem[key] !== undefined ? 
                                        renderDataItem(dataItem.id,dataItem[key],key)
                                        : 'N/A'

                                }
                            </div>
                         }else{
                            if(key==='createdAt' || key==='updatedAt'){
                                return <div                                                         
                                        key={`${rowIndex}-${key}`}                                
                                        className={`row-item 
                                            ${tableProps.largeColumns.includes(key) ? 'large':''}
                                            ${tableProps.importantColumns.includes(key) ? '':'hidden'}
                                            `
                                         } 
                                        >
                                            
                                                {dataItem && dataItem[key] !== undefined ? renderDataItem(dataItem.id,dataItem[key],key): 'N/A'}
                                        </div>
                            }

                            return <div                         
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}                        
                                    key={`${rowIndex}-${key}`}
                                    onBlur={(e)=>handlers.onModifiedRow(dataItem.id, key, (e.target as HTMLElement).innerText)}
                                    className={`row-item 
                                        ${tableProps.largeColumns.includes(key) ? 'large':''}
                                        ${tableProps.importantColumns.includes(key) ? '':'hidden'}
                                        `
                                    } 
                                    >
                                        {dataItem && dataItem[key] !== undefined ? renderDataItem(dataItem.id,dataItem[key],key): 'N/A'}
                                    </div>
                         }

                        
                        
                    })}
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