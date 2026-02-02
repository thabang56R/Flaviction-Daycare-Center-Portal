import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import { BellIcon } from '@heroicons/react/24/outline';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  return (
    <nav className="bg-var(--bg) shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="https://via.placeholder.com/150x50?text=Flaviction+Logo" alt="Logo" className="h-10 mr-4" />
        <h1 className="text-2xl text-var(--primary)">{t('welcome')}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
          <option value="en">EN</option>
          <option value="af">AF</option>
        </select>
        <Switch onChange={toggleTheme} checked={theme === 'dark'} />
        <BellIcon className="h-6 w-6 cursor-pointer" onClick={() => {/* Open notifications */}} />
        {user && <button onClick={logout} className="text-red-500">{t('logout')}</button>}
      </div>
    </nav>
  );
};

export default Navbar;