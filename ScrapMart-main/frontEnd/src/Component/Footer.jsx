import React from 'react';

const Footer = () => {
  return (
    <div className="w-full bg-slate-500">
      {/* Main Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm text-gray-200">
        
        {/* Left Column */}
        <div>
          <h1 className="text-2xl font-bold text-white font-poppins mb-4">ScrapMart</h1>
          <p className="md:w-2/3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, voluptatem assumenda! Soluta minima numquam veritatis!
          </p>
        </div>

        {/* Center Column */}
        <div>
          <p className="text-xl font-semibold mb-4">COMPANY</p>
          <ul className="space-y-2">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">About Us</li>
            <li className="hover:text-white transition cursor-pointer">Delivery</li>
            <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Right Column */}
        <div>
          <p className="text-xl font-semibold mb-4">GET IN TOUCH</p>
          <ul className="space-y-2">
            <li className="hover:text-white transition">+91-720-875-7995</li>
            <li className="hover:text-white transition">ak6935846@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <hr className="border-gray-400" />
      <p className="text-center py-4 text-sm text-gray-300">
        © 2024 ScrapMart — All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
