// src/components/Footer.jsx
import { FaEnvelope, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[var(--blue)] to-[var(--green)] text-white pt-12 pb-6 relative overflow-hidden">
      {/* Subtle wave top */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white opacity-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 85% 100%, 70% 60%, 55% 100%, 40% 60%, 25% 100%, 10% 60%, 0 100%)' }} />

      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-8 drop-shadow-lg">
          Contact Us
        </h2>

        <p className="text-3xl md:text-4xl font-bold mb-10 tracking-wide">
          Raising the pre-school benchmark!
        </p>

        <div className="max-w-2xl mx-auto space-y-6 mb-12">
          <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl">
            <FaEnvelope className="text-[var(--yellow)]" />
            <a href="mailto:info@flaviction.co.za" className="hover:text-[var(--yellow)] transition">
              info@flaviction.co.za
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl">
            <FaGlobe className="text-[var(--yellow)]" />
            <a href="https://www.flaviction.co.za" target="_blank" className="hover:text-[var(--yellow)] transition">
              www.flaviction.co.za
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl">
            <FaMapMarkerAlt className="text-[var(--yellow)]" />
            <span>Pretoria, Gauteng, South Africa</span>
          </div>
        </div>

        {/* Links row */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-lg md:text-xl mb-8">
          <a href="#" className="hover:text-[var(--yellow)] transition">Terms and Conditions</a>
          <a href="#" className="hover:text-[var(--yellow)] transition">Privacy Policy</a>
          <a href="#" className="hover:text-[var(--yellow)] transition">Access Request Form</a>
        </div>

        <p className="text-base md:text-lg opacity-90">
          © Copyright 2026 Flaviction Daycare Center. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;