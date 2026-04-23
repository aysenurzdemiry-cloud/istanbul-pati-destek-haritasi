import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Heart, Info, ChevronRight, Share2, PawPrint } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-20 overflow-hidden bg-paper">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-[11px] font-black uppercase tracking-[0.2em] mb-10 border border-brand/20">
              <Heart size={14} className="fill-brand" />
              <span>Sokaktaki Dostlarımız İçin</span>
            </div>
            
            <h1 className="font-display text-7xl md:text-[110px] font-black leading-[0.85] mb-12 tracking-tighter text-ink uppercase">
              İstanbul <br />
              <span className="text-brand">Sokak</span> <br />
              Dostları
            </h1>
            
            <p className="text-xl text-zinc-600 mb-12 max-w-md font-medium leading-tight">
              Şehrin her köşesindeki destek noktalarını, besleme alanlarını ve klinikleri tek bir interaktif haritada keşfedin.
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <Link 
                to="/map" 
                className="group flex items-center gap-3 bg-ink text-white px-10 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand transition-all shadow-2xl shadow-ink/20 active:scale-95"
              >
                Keşfetmeye Başla
                <ChevronRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </Link>
              
              <div className="flex items-center gap-4 p-4 border border-line rounded-3xl bg-white shadow-sm">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <Info size={20} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Veri Durumu</p>
                  <p className="text-xs font-bold">Gerçek Zamanlı Aktif</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 w-full aspect-[4/5] rounded-[60px] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border-[16px] border-white -rotate-2">
              <img 
                src="https://images.unsplash.com/photo-1548546738-8509cb246ed3?q=80&w=1287&auto=format&fit=crop" 
                alt="Istanbul Cat" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Background patterns */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.03] -z-0" style={{ backgroundImage: 'radial-gradient(circle, #1A1A1A 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section in Bold style */}
      <section className="py-32 bg-white border-y border-line">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          {[
            { label: "Toplam Nokta", value: "1,284", icon: MapPin },
            { label: "Günlük Destek", value: "24 Saat", icon: Heart },
            { label: "API Durumu", value: "AKTİF", icon: Info },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-paper rounded-[32px] flex items-center justify-center text-brand mb-8 shadow-inner border border-line">
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">{stat.label}</div>
              <div className="text-5xl font-black tracking-tighter uppercase">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-line pt-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white">
                <PawPrint size={18} strokeWidth={3} />
              </div>
              <span className="font-display font-black text-lg tracking-tighter uppercase">Pati Haritası</span>
          </div>
          <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em]">© 2026 İstanbul Pati Destek Haritası</p>
        </div>
      </footer>
    </div>
  );
}
