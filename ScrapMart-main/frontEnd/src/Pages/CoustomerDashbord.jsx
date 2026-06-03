import React, { useContext, useEffect, useState } from 'react'
import { ScrapContext } from '../Context/ScrapContext'
import SideBar from '../Component/SideBar'
import { asset } from '../assets/assest'
import {motion, number} from 'framer-motion'
import UserLocationMap from '../Component/LocationMap'
import { form } from 'framer-motion/client'
import axios from 'axios'
import { toast } from 'react-toastify'

const CoustomerDashbord = () => {
const {token,backendUrl,navigate}=useContext(ScrapContext)
const [loading,setLoading]=useState(false)
const [UserLocation, SetUserLocation] = useState({ lat: null, lng: null });
const [image,setImage]=useState('')
const [role,setRole]=useState("Plastic")
const [weight,setWeight]=useState('')
const [des,setDes]=useState('')



useEffect(()=>{
  if(!token){
    return navigate('/Registor')
  }
},[])

const handleLocationChange=(latlng)=>{
  SetUserLocation(latlng)
  // console.log(UserLocation)
}

const onSubmitHandler=async(e)=>{
  try{
   e.preventDefault()
  setLoading(true)
   const formData= new FormData()
  //  formData.append('image',image)
   formData.append('lng',UserLocation.lng)
   formData.append('lat',UserLocation.lat)
   formData.append('image',image)
   formData.append('Type',role)
   formData.append('weight',weight)
   formData.append('des',des)
   const response=await axios.post(`${backendUrl}/scrap/add`,formData,{headers:{token}})
   console.log(response.data)
  setLoading(false)
   console.log(response.data.success)
   if(response.data.success){
    toast.success("scrap Added successFully")
   }}
   catch(e){
    toast.error(e.message)
    setLoading(false)
   }
  //  console.log(token)

}

  return (
    <div className=' flex flex-col sm:items-center   ml-7  min-h-screen relative pb-24 '>
       
        {/* <div > */}
        <form onSubmit={(e)=>{onSubmitHandler(e)}} encType="multipart/form-data" className=' flex gap-2 flex-col'>
        <label htmlFor='image1'>
          <img  src={!image?asset.upload_area:URL.createObjectURL(image) } alt="" className="w-20 ml-10 mt-10" />
          <input required onChange={(e)=>{setImage(e.target.files[0])}}  type="file" className=""  id='image1' hidden />
        </label>

        <h2 className=' mt-5 ml-8 font-poppins font-medium '>Scrap Type</h2>
        <select
        required
        onChange={(e)=>{setRole(e.target.value)}}
        value={role}
          className='ml-3 sm:w-full sm:ml-8  w-52 h-12 px-4 text-gray-700 font-poppins font-medium border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white'
        >
          <option value="Plastic" >Plastic</option>
          <option value="Iron">Iron</option>
          <option value="Steel">Steel</option>
          <option value="Newspapers">Newspapers</option>
          <option value="Books">Books</option>
          
        </select>

        <h2 className=" ml-7 mt-3  font-medium text-gray-700 mb-2 font-poppins">
    Scrap Weight (in KG)
  </h2>
  <input
  required
    type="number"
    id="weight"
    onChange={(e)=>{setWeight(e.target.value)}}
    name="weight"
    value={weight}
    placeholder="Enter weight e.g. 15"
    className="w-52 sm:w-full sm:ml-8 ml-3 h-12 px-4 text-gray-700 font-medium border border-gray-300 rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
               placeholder:text-gray-400 font-poppins transition-all"
  />


<h2 className=" ml-7 mt-3  font-medium text-gray-700 mb-2 font-poppins">
    Scrap Description 
  </h2>
  <textarea
  required
    rows="4"
    onChange={(e)=>{setDes(e.target.value)}}
    placeholder="Enter details like condition, age, brand etc."
    className=" ml-3 w-52 sm:w-full sm:ml-8 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
               placeholder:text-gray-400 font-poppins resize-none transition-all"
  ></textarea>
  <div className="w-full flex justify-center">
  <UserLocationMap onLocationChange={handleLocationChange} />

</div>


<motion.button
  type="submit"
  disabled={loading} // ✅ disable during loading
  whileHover={{ scale: loading ? 1 : 1.1 }}
  whileTap={{ scale: loading ? 1 : 0.95, rotate: loading ? 0 : -2 }}
  transition={{ type: 'spring', stiffness: 300 }}
  className={`mt-5 mb-5 self-center h-12 w-[90%] bg-orange-400 text-white rounded-lg shadow-lg font-poppins font-medium flex items-center justify-center gap-2 ${
    loading ? 'opacity-70 cursor-not-allowed' : ''
  }`}
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Submitting...
    </>
  ) : (
    'Set Profile'
  )}
</motion.button>

      </form>
        {/* </div> */}
        <SideBar/>
        
    </div>
  )
}

export default CoustomerDashbord