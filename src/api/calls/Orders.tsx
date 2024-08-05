import React from 'react'
import axios from '../axios'

// export const fetchOrders = async (auth) => {
    
//     try{
//         const response = await axios.get('/orders',{
//             headers: {'Content-type':'application/json','Authorization': `Bearer ${auth.accessToken}`},
//             withCredentials:true }
//         )
//         // setOrders(response.data)
//         console.log("Fetched orders: ",JSON.stringify(response?.data))
//         if(Array.isArray(response.data)){
//             return response.data
//         }else{
//             return []
//         }
//     }catch(err){
//         if(!err?.response){
//             console.error("Orders : No server response")
//         }else if (err?.response.status === 400){
//             console.error("Orders : Missing Username or password")
//         }
//         else if (err?.response.status === 401){
//             console.error("Orders : Unauthorized")
//         }else{
//             console.error("Login failed")
//         }
//         return []
//     }
// }
