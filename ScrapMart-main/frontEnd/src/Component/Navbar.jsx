import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { asset } from '../assets/assest';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrapContext } from '../Context/ScrapContext';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { navigate } = useContext(ScrapContext);

  return (
    <div className="relative z-50">
      {/* Top Navbar */}
      <div className="z-50 font-poppins px-4 h-16 w-full max-w-screen flex items-center justify-between font-medium bg-transparent text-gray-700">
        <h3 className="font-poppins text-3xl">ScrapMart</h3>

        {/* Desktop NavLinks */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          <NavLink to="/"><p>Home</p></NavLink>
          <NavLink to="/about"><p>About</p></NavLink>
          <NavLink to="/help"><p>Help</p></NavLink>
          <NavLink to="/postscrap"><p>PostScrap</p></NavLink>
        </div>

        {/* Sign Button */}
        <button
          onClick={() => {
            console.log('hii');
            navigate('/Registor'); // if you're using context-based navigate
          }}
          className="ml-2 h-10 w-28 rounded-xl border border-green-500 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          Sign
        </button>

        {/* Burger Icon for Mobile */}
        <div
          className="z-50 relative sm:hidden cursor-pointer"
          onClick={() => setShow(!show)}
        >
          <img
            src={show ? asset.cross_icon : asset.menu_icon}
            className="w-6"
            alt="menu"
          />
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-cyan-200 z-40 sm:hidden rounded-r-xl shadow-lg font-poppins pt-20 pl-6 text-xl"
          >
            <NavLink to="/" onClick={() => setShow(false)}>
              <p className="py-4">Home</p>
            </NavLink>
            <NavLink to="/about" onClick={() => setShow(false)}>
              <p className="py-4">About</p>
            </NavLink>
            <NavLink to="/help" onClick={() => setShow(false)}>
              <p className="py-4">Help</p>
            </NavLink>
            <NavLink to="/postscrap" onClick={() => setShow(false)}>
              <p className="py-4">PostScrap</p>
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
