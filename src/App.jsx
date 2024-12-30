
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Layout from './components/pages/Dashboard/layout'
import Seminar from './components/pages/Seminar/Seminar'
import Users from './components/pages/users/users'
import Login from './components/pages/login/login'
// import { useEffect, useState } from 'react'
import { useUserContext } from './components/pages/ContextApi/userContext';
import NotFound from './components/pages/not found/NotFound';
import Students from './components/pages/students/Students'

function App() {

  return (
  <>
  <Routes>
  <Route path='*' element={<NotFound/>} />
    <Route path='' element={<Login/>}/>
    <Route path='Dashboard' element={<Layout/>}>
    <Route path='Users' element={<Users/>} />
    <Route path='Seminar' element={<Seminar/>} />
    <Route path='students' element={<Students/>} />
  </Route>
  </Routes>
  </>

  )
}

export default App
