import React, { useContext } from 'react'
import { asset } from '../assets/assest'
import Navbar from './Navbar'
import { motion } from 'framer-motion'
import { ScrapContext } from '../Context/ScrapContext'
const HeroSection = () => {
    const {navigate}=useContext(ScrapContext)
  return (
    <div className="relative w-full h-screen overflow-hidden">
    {/* Background Video */}
    <video
      className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      src={asset.heroSection}
      autoPlay
      loop
      muted
      playsInline
    />

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

    {/* Navbar */}
    <Navbar />

    {/* Hero content */}
    <motion.div
     initial={{ opacity: 0, y: 0 }}
     animate={{ opacity: 1, y: 10 }}
     transition={{ duration: 2, ease: "easeOut" }}
    className="relative mt-24 sm:mt-28 font-poppins font-medium  mt z-10 flex flex-col items-center  h-full text-center  text-gray-300 px-4">
      <motion.h 
      itial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 10 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className=" font-poppins mt-0 text-4xl md:text-5xl font-medium ">Sell Your Scrap. Save the Planet</motion.h>
      <p className="mt-4 text-lg md:text-2xl max-w-xl">
      Instant doorstep scrap pickup & best price guarantee. Join the recycling revolution with ScrapMart.
      </p>
      <button onClick={() => {
            console.log('hii');
            navigate('/Registor'); // if you're using context-based navigate
          }} className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition">
        Get Started
      </button>
    </motion.div>
  </div>
  )
}

export default HeroSection
