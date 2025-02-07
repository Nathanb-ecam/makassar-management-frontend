import React, { useState } from 'react'
import axios from '../api/axios'

import { useNavigate } from 'react-router-dom';

interface Props{
    mail : string;
    //login: (mail: string) => void;
}

const ConfirmAccount = ({mail} : Props) => {
  
    const navigate = useNavigate();    

    const [otp,setOtp] = useState("")
    const [errorMsg,setErrorMsg] = useState("")
    
    const confirmOtp = async (e) => {
        const confirmRequest = {"mail": mail, "otp":otp}
        const response = await axios.post(
            "/verify",
            confirmRequest
        )

        if(response.status == 200){
            // user a ref to the parent to call the login method
            //login(mail)
            navigate("/confirmAccount")
        }
        else setErrorMsg(response.statusText);
        
    }

    return (
        <>
        {errorMsg.length == 0 ? 
            <div>
                <div>Confirm you account</div>
                <form onSubmit={confirmOtp}>
                    <input type="number" value={otp} onBlur={(e) => setOtp(e.target.value)}/>
                    <input type="submit" value="Verify" />
                </form>
            </div>
            :
            <div>
                <label htmlFor="">An error has occured:</label>
                <p>{errorMsg}</p>
            </div>
        }


        </>
  )
}

export default ConfirmAccount