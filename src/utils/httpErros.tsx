import React from 'react'
import useRefreshToken from '../hooks/useRefreshToken';



export const processHttpError = (functionName,err) => {
  var errMsg = ""    
  if(err?.response){
     
    if (err?.response.status === 400){    
          errMsg = `${functionName} : Missing Username or password`
    }  
    else if (err?.response.status === 401){        
        errMsg = `${functionName} : Unauthorized`
    }
    else if (err?.response.status === 500){
      errMsg =  `${functionName} : Internal server error`
    }
    else{
      errMsg = `${functionName} : Login failed`
    }
  }else{
    errMsg = "No response from server"
  }
    console.error(errMsg)
    return errMsg
  };

