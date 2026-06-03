import React, { useState, useRef, useEffect, useContext } from 'react'
import { ScrapContext } from '../Context/ScrapContext'
import gsap from 'gsap'
import axios from 'axios'
import { toast } from 'react-toastify'

const Registor = () => {
  const [loginState,setLoginState]=useState('login')
  const cardRef = useRef(null)
  const [email, setEmail]=useState('')
  const [loading, setLoading]=useState(false)
  const [password,SetPassword]=useState('')
  const [otp, setOtp] = useState('')
  const [showOtpField, setShowOtpField] = useState(false)
  const {backendUrl,navigate,token,setToken, setUserRole}=useContext(ScrapContext)
  
  const submitHandler=async(event)=>{
      event.preventDefault()
      if(loginState === 'signUp'){
        if (!showOtpField) {
          // Step 1: Send OTP to email
          console.log("Sending OTP to:", email)
          setLoading(true)
          try {
            const response=await axios.post(`${backendUrl}/user/Registor`,{email})
            console.log(response.data)
            setLoading(false)
            if(response.data.success){
              toast.success("OTP sent to your email. Please check your inbox.")
              setShowOtpField(true)
            }
            else{
              toast.error(response.data.msg || "Failed to send OTP")
            }
          } catch (error) {
            setLoading(false)
            console.error("SignUp OTP request error:", error)
            toast.error(error.response?.data?.msg || error.message || "Failed to request OTP")
          }
        } else {
          // Step 2: Verify OTP
          console.log("Verifying OTP:", otp, "for email:", email)
          setLoading(true)
          try {
            const response=await axios.post(`${backendUrl}/user/verify`,{email,otp})
            console.log(response.data)
            setLoading(false)
            if(response.data.success){
              toast.success("Email verified successfully! Now complete your profile.")
              navigate(`/profile/${email}`)
            }
            else{
              toast.error(response.data.msg || "Verification failed")
            }
          } catch (error) {
            setLoading(false)
            console.error("SignUp OTP verification error:", error)
            toast.error(error.response?.data?.msg || error.message || "Failed to verify OTP")
          }
        }
      }
      if(loginState === 'login'){
        setLoading(true)
        try {
          const response=await axios.post(`${backendUrl}/user/login`,{email,password})
          console.log(response.data)
          if(response.data.success){
            setLoading(false)
            setToken(response.data.loginToken)
            setUserRole(response.data.role)
            console.log(response.data.role)
            localStorage.setItem('token',response.data.loginToken)
            if(  response.data.role ==='dealer'){
              navigate('/allscrap')
            }
            else{
              navigate('/CoustomerDashbord')
            }
          }
          else{
            setLoading(false)
            toast.error(response.data.msg || "Login failed")
          }
        } catch (error) {
          setLoading(false)
          console.error("Login error:", error)
          toast.error(error.response?.data?.msg || error.message || "Failed to connect to backend")
        }
      }
  }

  useEffect(() => {
    // Slide animation when loginState changes
    gsap.fromTo(
      cardRef.current,
      {
        x: loginState === 'login' ? -200 : 200,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }
    )
  }, [loginState])

  return (
    <div>
      <div className=' w-full h-screen bg-blue-600 flex  justify-center'>
          <div
          ref={cardRef}
          className={`flex flex-col  items-center mt-24 w-80 ${loginState ==='login'?'h-[60vh]':(showOtpField ? 'h-[60vh]' : 'h-[50vh]')} bg-white rounded-lg`}>
            <h2 className=' text-2xl mt-10  font-poppins  font-bold'>scrapMart</h2>
            <div className=' flex flex-row mt-5 h-11 w-[80%] border border-gray-400 rounded-md'>

              <div onClick={()=>{setLoginState('login'); setShowOtpField(false);}} className={` flex  h-11 w-[50%] justify-center items-center ${loginState ==='login'? 'bg-blue-700 text-gray-200' : ' bg-transparent text-gray-600'  }   cursor-pointer rounded-lg`}><h1 className='  text-base font-poppins font-medium'>Login </h1></div>

              <div onClick={()=>{setLoginState('signUp'); setShowOtpField(false);}} className={` flex  h-11 w-[50%] justify-center items-center ${loginState ==='signUp' ? 'bg-blue-700 text-gray-200':'  bg-transparent text-gray-600' }  cursor-pointer text-gray-700  rounded-lg`}><h1 className='  text-base font-poppins font-medium'>Sign Up </h1></div>

            </div>

            <form onSubmit={(event)=>{submitHandler(event)}}>
              <input required disabled={loginState==='signUp' && showOtpField} onChange={(e)=>{setEmail(e.target.value)}} type='email' value={email} placeholder='Email Address' className={`mt-9 ml-7 pl-3 w-[81%] h-12 outline-none text-gray-600 font-poppins font-medium border border-gray-300 rounded-lg shadow-gray-300 shadow-lg ${loginState==='signUp' && showOtpField ? 'bg-gray-100 cursor-not-allowed': ''}`}/>
              {loginState==='login'&&
              <input required onChange={(e)=>{SetPassword(e.target.value)}} type='password' value={password} placeholder='Password' className='  mt-6 ml-7 pl-3 w-[81%] h-12 outline-none  text-gray-600  font-poppins font-medium border border-gray-300 rounded-lg shadow-gray-300 shadow-lg '/>
              }
              {loginState==='signUp' && showOtpField &&
              <input required onChange={(e)=>{setOtp(e.target.value)}} type='text' value={otp} placeholder='Enter 6-digit OTP' className='  mt-6 ml-7 pl-3 w-[81%] h-12 outline-none  text-gray-600  font-poppins font-medium border border-gray-300 rounded-lg shadow-gray-300 shadow-lg '/>
              }
              {
                loading ?(
                  <button className=' mt-6 ml-5 pl-3 w-[81%] h-12 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]  text-white  font-poppins font-medium  border rounded-md shadow-gray-200 shadow-lg '>Loading....</button>
                ):(
                  <button className=' mt-6 ml-5 pl-3 w-[81%] h-12 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]  text-white  font-poppins font-medium  border rounded-md shadow-gray-200 shadow-lg'>{loginState ==='login'?'Login':(showOtpField ? 'Verify OTP' : 'GetOtp')}</button>
                )
              }
           
            </form>

           
          </div>
      </div>
    </div>
  )
}

export default Registor