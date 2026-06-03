import React from 'react'
import Registor from './Pages/Registor'
import Home from './Pages/Home'
import { Route,Routes } from 'react-router-dom'
import EmailVerified from './Pages/EmailVerified'
import SetProfile from './Pages/SetProfile'
import { ToastContainer } from 'react-toastify'
import CoustomerDashbord from './Pages/CoustomerDashbord'
import AllScrap from './Pages/AllScrap'

const App = () => {
  return (
   <div className=''>
   
   <ToastContainer/>
<Routes>

  <Route path='/' element={<Home/>}/>
  <Route path='/Registor' element={<Registor/>}/>
  <Route path='/verified' element={<EmailVerified/>}/>
  <Route path='/profile/:email' element={<SetProfile/>}/>
  <Route path='/CoustomerDashbord' element={<CoustomerDashbord/>}/>
  <Route path='/allscrap'  element={<AllScrap/>}/>
</Routes>

   </div>
  )
}

export default App