import React from 'react';
import { motion } from 'framer-motion';
import { FaRegCheckCircle } from 'react-icons/fa';

const scrapItems = [
  'Paper & Cardboard',
  'Plastic Bottles & Containers',
  'E-Waste (Mobiles, Chargers, etc.)',
  'Iron, Steel, Aluminum',
  'Old Furniture & Appliances',
];

const ScrapAcceptSection = () => {
  return (
    <div className="bg-white py-16 px-6 md:px-20 overflow-hidden" >
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 relative inline-block after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-600 after:mx-auto after:mt-3"
      >
        What Scrap Do We Accept?
      </motion.h2>

      {/* Scrap Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {scrapItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-start bg-slate-100 p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <FaRegCheckCircle className="text-green-600 mt-1 mr-3 text-xl" />
            <span className="text-gray-700 font-medium">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScrapAcceptSection;
