import { OrderOverview } from "../models/entities"

export const handleFieldChange = (initialState,setStateFunction, key:string, value:string, setSuccessfull) =>{
    //first check that the new data is different from the previous one 
    // var originalFieldValue : any = null
    
    // process change to obtain the payload to be stored
    var {data,keys,err} = processFieldChange(initialState,key,value)
    
    // if(initialState?.[key] === data?.[key]){
    //   console.log("No changes performed on this field")
    //   return 
    // }
    
    // update state with the payload
    if(!err && keys){
      setStateFunction(prev =>{
        if(!prev) return prev 

        if(keys.length === 1) {
            setSuccessfull(true)
            console.log("set successfull true")
            return {...prev,...data}
        }
        if(keys.length === 2){
            setSuccessfull(true)
            return {...prev,...prev[keys[0]], data}
        } 
        else {        
            console.log("handleFieldChange error", err)
        }
      })
    }
  }

  export const processFieldChange= (obj : Object, key:string, value : string) =>{
      
    const keys = key.split('.')   
    const amountOfKeys = keys.length 

    var modifiedData: any = null
    var originalFieldValue : any = null

    if(amountOfKeys === 1){
      modifiedData = {"data":{[key]:value}};  
      originalFieldValue = obj?.[key]
    }else if(amountOfKeys === 2){
      modifiedData = {"data":{[keys[0]]:{[keys[1]]:value}}};  
      originalFieldValue = obj?.[keys[0]]?.[keys[1]]
    }else{
      modifiedData = {"err":`case not handled (${amountOfKeys} keys)`}
      // console.log(`case not handled (${amountOfKeys} keys)`)
    }

    if(originalFieldValue === value){
      return {}
    }

    return {...modifiedData,"keys":keys}
  }
