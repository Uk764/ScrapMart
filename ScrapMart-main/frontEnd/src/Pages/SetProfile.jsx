import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ScrapContext } from '../Context/ScrapContext'
import axios from 'axios'

const SetProfile = () => {
  const{email}=useParams()
  const [username,setUserName]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('')
  const [phone,setPhone]=useState(null)
  const{backendUrl,userRole,setUserRole,navigate, token, setToken}=useContext(ScrapContext)
  useEffect(()=>{
    console.log(email)
  },[])

  const submitHandler=async()=>{
    try{
      const response=await axios.post(`${backendUrl}/user/setprofile/${email}`,{username,password,role,phone})
      console.log(response.data.loginToken)
      setToken(response.data.loginToken)
      console.log(response.data.role)
      
      
      localStorage.setItem('token',response.data.loginToken)
      setUserRole(response.data.role)
      console.log(userRole)
      
      if(response.data.role ==='dealer'){
        navigate('/allscrap')
      }
      else{
        navigate('/CoustomerDashbord')
      }
      
      
    }
    catch(e){
      toast.error(e.message)
    }
  }
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white flex flex-col gap-6 py-8 px-6 border border-gray-300 rounded-lg shadow-lg'>

        {/* Heading */}
        <h1 className='text-2xl text-center font-poppins font-semibold text-gray-700'>ScrapMart</h1>

        {/* Username Input */}
        <input
        onChange={(e)=>{setUserName(e.target.value)}}
        value={username}
          type='text'
          placeholder='User Name'
          className='w-full h-12 px-4 text-gray-700 font-poppins font-medium border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500'
        />

        {/* Password Input */}
        <input
        onChange={(e)=>{setPassword(e.target.value)}}
        value={password}
          type='password'
          placeholder='Password'
          className='w-full h-12 px-4 text-gray-700 font-poppins font-medium border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500'
        />


    {/* phoneNumber */}

    <input
        onChange={(e)=>{setPhone(e.target.value)}}
        value={phone}
          type='number'
          placeholder='Phone Number'
          className='w-full h-12 px-4 text-gray-700 font-poppins font-medium border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500'
        />


        {/* Dropdown Input */}
        <select
        onChange={(e)=>{setRole(e.target.value)}}
        value={role}
          className='w-full h-12 px-4 text-gray-700 font-poppins font-medium border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white'
        >
          <option value="" disabled selected>Select Account Type</option>
          <option value="dealer">dealer</option>
          <option value="coustomer">coustomer</option>
          
        </select>

        <motion.button
        onClick={()=>{submitHandler()}}
        whileHover={{scale:1.1}}
       
      whileTap={{ scale: 0.95, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
        className='  self-center h-12 w-[40%] bg-slate-500 text-white  rounded-lg shadow-slate-300 shadow-lg   font-poppins font-medium'>SetProfile</motion.button>
      </div>
    </div>
  )
}

export default SetProfile
