// import React, { useContext, useEffect, useState } from 'react';
// import { Form, FormGroup, FormControl} from 'react-bootstrap';

// import Login from './Login.tsx';
// import App from '../App.tsx';
// import MainNavbar from '../components/MainNavbar.tsx';
// import { useNavigate } from 'react-router-dom';

// import './css/login.css'
// import { AuthProvider, useAuth } from '../contexts/AuthContext.tsx';

  


// const HandleLogin = ({setLoggedIn}) => {

//   // const {isAuthenticated, login, logout } = useAuth()
//   const [isAuthenticated,setIsAuthenticated] = useState(false)
//   const navigate = useNavigate()

//   // useEffect(() => {
//   //   if (isAuthenticated) {
//   //     setLoggedIn(true)
//   //     navigate('/dashboard');
      
    
//   //   }
//   // }, [isAuthenticated]);

//   const onLoginSuccessful = () =>{
//     // setIsAuthenticated(true)
//     setLoggedIn(true)
//     navigate('/dashboard');
//   }

  
//   return (
//     <>
      
//       { 
//       isAuthenticated ? 
      
//       <div className='app'>
//         <MainNavbar />
//       </div>
//       :  
//       // <Login />
//       <Login setLoggedIn={setLoggedIn} />
//       }
//     </>
//   );
// };

// export default HandleLogin;


