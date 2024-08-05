import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter,Routes,Router, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'


import App from './App.tsx'
import {AuthProvider} from './hooks/useAuth.tsx'
import { OrdersProvider } from './hooks/useOrders.tsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
        <OrdersProvider>
          <App />
        </OrdersProvider>
        </AuthProvider>
      </BrowserRouter> 
  // </React.StrictMode>,
)


