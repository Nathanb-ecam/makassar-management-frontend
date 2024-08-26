import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter,Routes,Router, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'


import App from './App.tsx'
import {AuthProvider} from './hooks/useAuth.tsx'
import { OrdersProvider } from './hooks/useOrders.tsx'
import { TopMessageProvider } from './hooks/useTopMessagePopup.tsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <TopMessageProvider>  
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </TopMessageProvider>
        </AuthProvider>
      </BrowserRouter> 
  // </React.StrictMode>,
)


