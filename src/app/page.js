'use client';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-lime-100 text-gray-800 font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-green-200 to-lime-100"></div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-8 h-full flex flex-col items-center justify-center text-center">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-green-800 mb-6 leading-tight">
              Seamless Scrap Collection <br /> in Your Local Area
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Eco-friendly doorstep scrap pickup — fast, reliable, and sustainable.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-lime-500 via-green-600 to-yellow-600 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-md transition duration-300"
              style={{ borderRadius: '30px 10px', padding: '15px 30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)' }}
            >
              Schedule a Pickup
            </motion.button>
          </motion.div>
        </div>

        {/* Animated Decorations */}
        <motion.div
          className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-lime-200 opacity-20 rounded-tl-full"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-12 h-12 bg-green-300 opacity-20 rounded-full"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-yellow-400 opacity-10 rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Scroll Prompt */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-green-700 text-sm animate-bounce"
        >
          ↓ Scroll to explore
        </motion.div>
      </div>
    </main>
  );
}