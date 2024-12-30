import React from 'react'
import ReactDOM from 'react-dom/client'
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {BrowserRouter} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import './index.css'
import { UserContextProvider } from './components/pages/ContextApi/userContext.jsx';
const QuerClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer/>
  <BrowserRouter>
  <QueryClientProvider client={QuerClient}> 
  <UserContextProvider>
    <App />
  </UserContextProvider>
</QueryClientProvider>
  </BrowserRouter>
  </React.StrictMode>,
)
