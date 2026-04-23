import { Link } from 'react-router-dom';
import { PawPrint, Map as MapIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const mailToLink = "mailto:aysenur@example.com?subject=İstanbul Pati Destek Haritası Geri Bildirim&body=Merhaba, proje hakkında geri bildirim paylaşmak istiyorum.";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white shadow-xl shadow-brand/20 group-hover:scale-110 transition-transform">
            <PawPrint size={22} strokeWidth={3} />
          </div>
          <span className="font-display font-black text-xl tracking-tighter uppercase">Pati Haritası</span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-ink/60 hover:text-brand font-bold transition-colors text-[10px] uppercase tracking-widest leading-none">Anasayfa</Link>
            <Link to="/map" className="text-ink/60 hover:text-brand font-bold transition-colors text-[10px] uppercase tracking-widest leading-none">Harita</Link>
            <Link to="/#data-sources" className="text-ink/60 hover:text-brand font-bold transition-colors text-[10px] uppercase tracking-widest leading-none">Veri Kaynakları</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={mailToLink}
              className="hidden sm:flex items-center gap-2 text-ink border border-line px-5 py-2.5 rounded-full hover:bg-zinc-50 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <span>İletişim</span>
            </a>
            <Link 
              to="/map" 
              className="flex items-center gap-2 bg-ink text-white px-6 py-3 rounded-full hover:bg-brand transition-all font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 whitespace-nowrap"
            >
              <MapIcon size={14} strokeWidth={3} />
              <span>Haritayı Aç</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
