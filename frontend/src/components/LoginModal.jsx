// src/components/LoginModal.jsx
import { motion } from 'framer-motion';

const LoginModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="card bg-white p-8 rounded-3xl max-w-md w-full">
        <h2 className="text-2xl text-var(--blue) mb-4">Flaviction Portal Login</h2>
        <input 
          type="text" 
          placeholder="Username" 
          className="w-full p-3 mb-4 border rounded" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 mb-6 border rounded" 
        />
        <button className="btn-primary w-full">Login</button>
        <button onClick={onClose} className="text-red-500 mt-4">Close</button>
      </div>
    </motion.div>
  );
};

export default LoginModal;