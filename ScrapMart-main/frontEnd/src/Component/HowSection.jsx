import React from 'react'
import { motion } from 'framer-motion'
import { asset } from '../assets/assest'

const HowSection = () => {
  return (
    <div className='bg-slate-200'>
      <h1 className="pt-10 ml-28 text-4xl md:text-5xl font-extrabold font-poppins text-gray-800 tracking-wide relative inline-block after:content-[''] after:block after:w-16 after:h-1 after:bg-blue-600 after:mt-2">
        How It Works
      </h1>

      <motion.div
        className='h-[95vh] w-full flex flex-col sm:flex-row gap-10'
      >
        {/* Left Image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='h-[15vh] sm:h-[40vw]'
        >
          <img
            src={asset.work}
            className='mt-8 mb-4 ml-7 sm:ml-24 w-[40vh] sm:w-[45vw] rounded-md'
            alt="How it works"
          />
        </motion.div>

        {/* Right Steps */}
        <motion.div
          className='h-[80vh] flex-col'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >

          {/* Step 1 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className='mt-32 ml-6 flex-col h-28 w-[40vh] sm:h-36 sm:w-[25vw] bg-slate-50 sm:mt-8 rounded-md'
          >
            <h3 className='mt-4 ml-4 sm:ml-8 sm:mt-2 sm:pt-5 text-lg sm:text-xl font-semibold font-poppins'>
              Step 1: Book a pickup
            </h3>
            <p className='text-sm font-mono ml-5 sm:ml-8 mt-2 text-gray-600'>
              Just enter your location and select a time slot that suits you.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className='mt-3 ml-6 flex-col h-28 w-[40vh] sm:h-36 sm:w-[25vw] bg-slate-50 sm:mt-8 rounded-md'
          >
            <h3 className='mt-4 ml-4 sm:ml-8 sm:mt-2 sm:pt-5 text-lg sm:text-xl font-semibold font-poppins'>
              Step 2: Weigh & Quote
            </h3>
            <p className='text-sm font-mono ml-5 sm:ml-8 mt-2 text-gray-600'>
              Our agent weighs the scrap using a digital machine and provides the best market rate.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className='mt-3 ml-6 flex-col h-28 w-[40vh] sm:h-28 sm:w-[25vw] bg-slate-50 sm:mt-8 rounded-md'
          >
            <h3 className='mt-4 ml-4 sm:ml-8 sm:mt-2 sm:pt-5 text-lg sm:text-xl font-semibold font-poppins'>
              Step 3: Get Paid Instantly
            </h3>
            <p className='text-sm font-mono ml-5 sm:ml-8 mt-2 text-gray-600'>
              You receive payment immediately via UPI, bank transfer, or cash.
            </p>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  )
}

export default HowSection
