import { Link } from 'react-router-dom';
import { PawPrint, Map as MapIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white shadow-xl shadow-brand/20 group-hover:scale-110 transition-transform">
            <PawPrint size={22} strokeWidth={3} />
          </div>
          <span className="font-display font-black text-xl tracking-tighter uppercase">Pati Haritası</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link to="/" className="text-ink/60 hover:text-brand font-bold transition-colors text-xs uppercase tracking-widest hidden sm:block">Anasayfa</Link>
          <Link 
            to="/map" 
            className="flex items-center gap-2 bg-ink text-white px-6 py-3 rounded-full hover:bg-brand transition-all font-black text-xs uppercase tracking-widest shadow-xl active:scale-95"
          >
            <MapIcon size={14} strokeWidth={3} />
            <span>Haritayı Aç</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
