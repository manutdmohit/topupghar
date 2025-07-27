'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// Animation variants for text and buttons
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 max-[500px]:px-3 max-[500px]:py-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-blue-600/70 to-purple-600/80 z-10"></div>
        {/* Responsive hero image with aspect ratio */}
        <Image
          src="/hero-gaming.jpg"
          alt="Gaming Hero"
          width={1200}
          height={500}
          className="w-full h-auto min-h-[150px] sm:min-h-[300px] lg:min-h-[400px] max-[500px]:min-h-[150px] object-cover transition-transform duration-700 group-hover:scale-105 active:scale-105"
          priority
          sizes="(max-width: 500px) 100vw, (max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
        />
        {/* Content container */}
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
          <motion.div
            className="w-full max-w-[90%] sm:max-w-xl lg:max-w-3xl px-3 sm:px-6 lg:px-8 max-[500px]:px-3"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight max-[500px]:text-xl">
              Level Up Your
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Gaming Experience
              </span>
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-8 max-w-full sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed max-[500px]:text-xs">
              Get instant access to premium gaming credits, exclusive content,
              and the best deals on your favorite games
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center max-[500px]:gap-2">
              <motion.button
                className="px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:-translate-y-1 text-xs sm:text-base max-[500px]:px-4 max-[500px]:py-2 max-[500px]:text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shop now for gaming products"
              >
                Shop Now
              </motion.button>
              <motion.button
                className="px-4 sm:px-8 py-2 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-xs sm:text-base max-[500px]:px-4 max-[500px]:py-2 max-[500px]:text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Learn more about gaming products"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
