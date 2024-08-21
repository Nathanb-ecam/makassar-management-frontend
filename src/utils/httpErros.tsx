import React from 'react'

export const processHttpError = (functionName,err) => {
  var errMsg = ""    
  if(!err?.response){
        errMsg = `${functionName} : No server response`
        if (err?.response.status === 400){
        
          errMsg = `${functionName} : Missing Username or password`
      }  
      else if (err?.response.status === 401){
        
        errMsg = `${functionName} : Unauthorized`
    }else{
      errMsg = `${functionName} : Login failed`
    }
  }else{
    errMsg = "No response from server"
  }
    console.error(errMsg)
    return errMsg
  };

