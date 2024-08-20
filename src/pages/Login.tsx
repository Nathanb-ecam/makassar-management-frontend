import React, { useState } from 'react';
import { Button, Form, FormGroup, FormControl} from 'react-bootstrap';

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import './css/login.css'
import  axios  from '../api/axios';





const LoginForm = () => {
  

  const {setAuth} = useAuth()

  const navigate = useNavigate()

  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { mail, password };

    try{
      const response = await axios.post(
        "/login",
        JSON.stringify(user),
        {
          headers: {'Content-type':'application/json'},
          withCredentials: true
        }
      )

      console.log(JSON.stringify(response?.data))
      const accessToken = response?.data?.accessToken
      setAuth({user,accessToken})
      setMail('');
      setPassword('');
      navigate("/dashboard")
    }catch(err){
        if(!err?.response){
          console.log("No server response")
        }else if (err?.response.status === 400){
          console.log("Missing Username or password")
        }
        else if (err?.response.status === 401){
          console.log("Unauthorized")
        }else{
          console.log("Login failed")
        }
    }
    finally{

    }

      
      

    
  };
  
  
  return (
    <div className='login-page'>
      <div className='login-left-section'>
        <h1>La ca serait cool d'avoir <br/>qqch à raconter</h1>
        <img src="/src/assets/f.png" alt="logo makassar" />
      </div>
      <div className='login-right-section'>
        <h1>Rien que ça bosse</h1>
        <form onSubmit={handleSubmit} className='login-form'>
          <div className='username-section'>
            <label>Mail</label>
            <input 
            type="text" placeholder='Enter your email address'
            value={mail}
            onChange={(e) => setMail(e.target.value)}
             />
          </div>
          <div className='password-section'>
            <label >Mot de passe</label>
            <input 
            type="password" placeholder='Enter password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit'>
            Envoyer
          </button>
        </form>
      </div>

    </div>
  );
};

export default LoginForm;


