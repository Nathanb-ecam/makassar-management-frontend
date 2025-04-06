import React, { useEffect, useState } from 'react';


import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import './css/login.css'
import  axios  from '../api/axios';




const LoginForm = () => {
  

  const {setAuth}:any = useAuth()

  const navigate = useNavigate()

  // const [mail, setMail] = useState('');
  // const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useState({mail:"",password:""});
  const [signupData, setSignupData] = useState({username:"", mail:"",password:""});
  const [feedbackMsg, setFeedbackMsg] = useState({loginMsg:{text:"",color:"--info-red"}, signupMsg:{text:"",color:"--info-red"}});
  
  const [selectedTab, setSelectedTab] = useState('login');
  
  // useEffect(()=>{
  //   console.log(feedbackMsg)
  // },[feedbackMsg])
  
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
      if(response.status == 200){
        const accessToken = response?.data?.accessToken
        const tenantId = response?.data?.tenantId
        setAuth({user,accessToken, tenantId})
        setLoginData({mail:"", password:""})
        navigate("/dashboard")
        setFeedbackMsg(prev => ({...prev, loginMsg: {text:response.statusText, color:""}}))
      }
        
    

    }catch(err){      
      const apiErrorMessage = err?.response.data        
      if(!err?.response){
          console.log("No server response")
          setFeedbackMsg(prev => ({...prev, loginMsg:{text:"No server response", color:prev.loginMsg.color || ""}}))
        }else if (err?.response.status === 400){
          setFeedbackMsg(prev => ({...prev, loginMsg: {text:apiErrorMessage,color:prev.loginMsg.color || ""}}))
          console.log("Missing Username or password")
        }
        else if (err?.response.status == 401 || err?.response.status == 403){          
          setFeedbackMsg(prev => ({...prev, loginMsg: {text:apiErrorMessage,color:prev.loginMsg.color || ""}}))
          console.log("Unauthorized")
        }else{
          setFeedbackMsg(prev => ({...prev, loginMsg: {text:"Something went wrong :(",color:prev.loginMsg.color || ""}}))
          console.log("Something went wrong :(")
        }
    }
    finally{
      console.log("somehow done")
    }
  };

  const handleSignupForm = async (e)=>{
    e.preventDefault()
    const newAccountData = signupData;

    try{
      const response = await axios.post(
        "/register",
        JSON.stringify(newAccountData),
        {
          headers: {
            'Accept':'application/json',
            'Content-type':'application/json'
          },
          withCredentials: true
        }
      )
      // if (response.status == 200) setFeedbackMsg(prev => ({...prev,signupMsg: response.data }))
      console.log("response test")
      console.log(response)
      setFeedbackMsg(prev => ({...prev,signupMsg: {text:response.data, color:prev.signupMsg.color || ""} }))
    }catch(err){
      setFeedbackMsg(prev => ({...prev,signupMsg: {text:err?.response.data,color:prev.signupMsg.color || ""}}))
      console.log(err)
    }
    
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
                <label style={{color:`var(${feedbackMsg.signupMsg.color})`, fontSize:'.8rem'}}>{feedbackMsg.signupMsg.text}</label>
                <div>
                  <label htmlFor="">Firstname</label>
                  <input required type="text" value={signupData.username} onChange={(e) => setSignupData(prev => ({...prev, username: e.target.value}))}/>
                </div>                
                <div>
                  <label htmlFor="">Mail</label>
                  <input required type="text" value={signupData.mail} onChange={(e) => setSignupData(prev => ({...prev, mail: e.target.value}))}/>
                </div>
                <div>
                  <label htmlFor="">Password</label>
                  <input required type="password" value={signupData.password} onChange={(e) => setSignupData(prev => ({...prev, password: e.target.value}))}/>
                </div>
                <button type='submit'>Sign up</button>
              </form>
          </div>

          <div className='login-section'>            
            <form onSubmit={handleLoginForm} className='login-form'>
              <h3>Login</h3>
              <label style={{color:`var(${feedbackMsg.signupMsg.color})`, fontSize:'.8rem'}}>{feedbackMsg.loginMsg.text}</label>
              <div className='username-section'>
                <label>Mail</label>
                <input 
                required
                type="text" placeholder='Enter your email address'
                value={loginData.mail}
                onChange={(e) => setLoginData(prev => ({...prev, mail: e.target.value}))}
                />
              </div>
              <div className='password-section'>
                <label>Password</label>       
                <input
                required 
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


