import React, { useContext, useState } from 'react';
import { asset } from '../assets/assest';
import { ScrapContext } from '../Context/ScrapContext';

const SideBar = () => {
  const {navigate, token, setToken,userRole}=useContext(ScrapContext) 
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 
    flex justify-around items-center 
    w-[90vw] sm:w-[40vw] h-16 
  bg-neutral-100 rounded-full shadow-md shadow-slate-300 z-50">
      
        

        {/* Add Scrap */}
        { userRole==='coustomer'&&(
        <div className="  h-6 w-6 flex items-center gap-2 ml-1 mt-4 sm:h-8 sm:w-10 cursor-pointer transition"
        onClick={()=>{navigate('/CoustomerDashbord')}}
        >
          <img className="w-7 transform transition-all duration-300 hover:scale-125 hover:z-10 hover:shadow-lg" src={asset.add_icon} alt="Add Icon" />
        
        </div>)}

        {/* All Scrap */}
        <div className="  h-6 w-6 flex items-center gap-2 ml-5 mt-4 sm:h-6 sm:w-6 cursor-pointer transition"
        onClick={()=>{navigate('/allscrap')}}
        >
          
          <img className="w-7 transform transition-all duration-300 hover:scale-125 hover:z-10 hover:shadow-lg" src={asset.order_icon} alt="Add Icon" />
        
        </div>
        
     

      {/* Logout Button */}

      <div className="  h-6 w-6 flex items-center gap-2 ml-5 mt-4 sm:h-8 sm:w-8 cursor-pointer transition"
      onClick={()=>{
        setToken('')
        localStorage.setItem('token','')
        navigate('/Registor')
      }}>
          <img className="w-7 transform transition-all duration-300 hover:scale-125 hover:z-10 hover:shadow-lg" src={asset.logout_icon} alt="Add Icon" />
        
        </div>
      
     
    </div>
  );
};

export default SideBar;
