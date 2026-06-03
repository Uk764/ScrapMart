import React, { useContext, useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react' // Icon components
import axios from 'axios'
import { ScrapContext } from '../Context/ScrapContext'

const EmailVerificationStatus = () => {
    const [verified,setVerified]=useState(true)
    const [email,setEmail]=useState('')
    const {backendUrl, navigate}=useContext(ScrapContext)
    
    useEffect(()=>{
      const params=new URLSearchParams(window.location.search)
      const token=params.get('token')
      const verify=async()=>{
      const response=await axios.get(`${backendUrl}/user/verify?token=${token}`)
      console.log(response.data.data)
      if(!response.data.succes){
        setVerified(false)
      }
      else{
        setVerified(true)
        setEmail(response.data.data)
      }
    }
      verify()
    },[])
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-800 to-blue-400 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        
        {/* Icon */}
        {verified ? (
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        ) : (
          <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {verified ? 'Email Verified!' : 'Verification Failed'}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {verified
            ? 'Your email has been successfully verified. You can now log in to your account.'
            : 'Sorry, we could not verify your email. The link may have expired or is invalid.'}
        </p>

        {/* Button */}
        <button
        onClick={()=>{
          verified ? navigate(`/profile/${email}`): navigate('/Registor')
        }}
          className={`${
            verified ? 'bg-blue-700 hover:bg-blue-800' : 'bg-red-600 hover:bg-red-700'
          } text-white font-medium py-2 px-6 rounded-lg shadow transition duration-300`}
        >
          {verified ? 'Continue' : 'Resend Link'}
        </button>
      </div>
    </div>
  )
}

export default EmailVerificationStatus
