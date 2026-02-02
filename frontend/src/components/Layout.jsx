import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Sidebar from './common/Sidebar.jsx';
import Navbar from './Navbar.jsx';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;