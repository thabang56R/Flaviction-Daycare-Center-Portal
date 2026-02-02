// src/components/ProgramCard.jsx
import { motion } from 'framer-motion';

const ProgramCard = ({ title, description, image, color }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative rounded-3xl p-6 md:p-8 shadow-xl border-4 border-dashed border-${color}-400 bg-white overflow-hidden`}
      style={{ borderColor: `var(--${color})` }}
    >
      {/* Cloud/wave cutout bottom - Smiley signature */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" 
           style={{ 
             clipPath: 'polygon(0 0, 100% 0, 100% 40%, 85% 100%, 70% 40%, 55% 100%, 40% 40%, 25% 100%, 10% 40%, 0 100%)',
             background: 'white'
           }} />

      <div className="relative z-10 text-center">
        <div className="mb-6">
          <img 
            src={image} 
            alt={title} 
            className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full border-8 border-var(--yellow) shadow-lg object-cover"
          />
        </div>
        <h3 className="text-2xl md:text-3xl mb-4" style={{ color: `var(--${color})` }}>
          {title}
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {description}
        </p>
        <span className="inline-block text-var(--blue) font-bold text-xl hover:underline cursor-pointer">
          read more...
        </span>
      </div>
    </motion.div>
  );
};

export default ProgramCard;