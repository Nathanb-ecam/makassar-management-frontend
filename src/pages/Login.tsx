import React, { useState } from 'react';
import { Button, Form, FormGroup, FormControl} from 'react-bootstrap';

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import './css/login.css'
import  axios  from '../api/axios';





const LoginForm = () => {
  

  const {setAuth} = useAuth()

  const navigate = useNavigate()

  // const [mail, setMail] = useState('');
  // const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useState({mail:"",password:""});
  const [signup, setSignup] = useState({});
  
  const [selectedTab, setSelectedTab] = useState('login');
  const handleTabChange = (tabName:string) =>{
    setSelectedTab(tabName)
  }

  const handleLoginForm = async (e) => {
    e.preventDefault();
    const user = loginData;

    try{
      const response = await axios.post(
        "/login",
        JSON.stringify(user),
        {
          headers: {
            'Accept':'application/json',
            'Content-type':'application/json'
          },
          withCredentials: true
        }
      )

      console.log(JSON.stringify(response?.data))
      const accessToken = response?.data?.accessToken
      const tenantId = response?.data?.tenantId
      setAuth({user,accessToken, tenantId})
      setLoginData({mail:"", password:""})
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
      console.log("somehow done")
    }
  };

  const handleSignupForm = ()=>{
      const newAccountData = signup;
  }
  
  
  return (
    <div className='login-page'>
      <div className="card">

        <div className="login-sliders">

          <div className={`hider ${selectedTab == 'login' ? 'left' : 'right'}`}>
            {
            selectedTab == 'login' ? 
                <div className='signup-link-wrapper'>
                  <h4>Welcome to login</h4>
                  <p>Don't have an account ? </p>
                  <button onClick={() => handleTabChange("signup")}>Create one</button>                  
                </div>
                :
                <div className='login-link-wrapper'>
                  <h4>Already have an account ?</h4>
                  <button onClick={() => handleTabChange("login")}>Log back in</button>
                </div> 
                
            }
          </div>

          <div className='signin-section'>
              <form className='signin-form' onSubmit={handleSignupForm}>                
                <h3>Create an account</h3>
                <div><label htmlFor="">Firstname</label><input type="text" /></div>
                <div><label htmlFor="">Lastname</label><input type="text" /></div>
                <div><label htmlFor="">Mail</label><input type="text" /></div>
                <div><label htmlFor="">Password</label><input type="password" /></div>
                <button type='submit'>Sign up</button>
              </form>
          </div>

          <div className='login-section'>            
            <form onSubmit={handleLoginForm} className='login-form'>
              <h3>Login</h3>
              <div className='username-section'>
                <label>Mail</label>
                <input 
                type="text" placeholder='Enter your email address'
                value={loginData.mail}
                onChange={(e) => setLoginData(prev => ({...prev, mail: e.target.value}))}
                />
              </div>
              <div className='password-section'>
                <label>Password</label>
                <input 
                type="password" placeholder='Enter password' 
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
                />
                <button className='forgot-password'>Forgot password?</button>
              </div>
              <button type='submit'>
                Enter
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginForm;


