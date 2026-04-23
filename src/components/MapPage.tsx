import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, Building2, Loader2, Search, Filter, ChevronRight, Heart, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSupportPoints, geocodeAddress, SupportPoint } from '../services/dataService';

// Fix for default marker icon in Leaflet + React
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Internal component to fix map sizing issues
function MapController({ loading }: { loading: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    // Initial invalidate
    map.invalidateSize();
    
    // Trigger window resize event which Leaflet listens to by default
    window.dispatchEvent(new Event('resize'));

    // Handle container changes aggressively
    const observer = new ResizeObserver(() => {
       map.invalidateSize();
    });
    
    const container = map.getContainer();
    if (container) {
      observer.observe(container);
    }

    // Interval fallback for the first few seconds (the "aggressive" fix)
    let count = 0;
    const interval = setInterval(() => {
       map.invalidateSize();
       count++;
       if (count > 5) clearInterval(interval);
    }, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [map, loading]);

  return null;
}

// Custom Marker for points
const SupportIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #FF6B35; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3); display: flex; align-items: center; justify-content: center; color: white;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.54.4 3 1.5 3 3.24 0 1.76-1.28 3.58-3.07 5.41a3 3 0 0 1-4.86 0C7.28 11.84 6 10.02 6 8.26c0-1.74 1.46-2.84 3-3.24.65-.17 1.33-.26 2-.26Z"/><circle cx="12" cy="8" r="2"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export default function MapPage() {
  const [points, setPoints] = useState<SupportPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Hepsi');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSupportPoints();
        setPoints(data);
        
        const geocodedPoints: SupportPoint[] = [];
        for (let i = 0; i < data.length; i++) {
          const point = data[i];
          const coords = await geocodeAddress(point.address, point.district);
          if (coords) {
            geocodedPoints.push({ ...point, ...coords });
          }
          setProgress(Math.round(((i + 1) / data.length) * 100));
          setPoints(prev => {
            const updated = [...prev];
            if (coords) updated[i] = { ...point, ...coords };
            return updated;
          });
        }
      } catch (error) {
        console.error('Failed to load points:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const districts = ['Hepsi', ...Array.from(new Set(points.map(p => p.district))).sort()];

  const filteredPoints = points.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'Hepsi' || p.district === selectedDistrict;
    return matchesSearch && matchesDistrict && p.lat && p.lng;
  });

  return (
    <div className="h-screen pt-20 flex flex-col md:flex-row bg-[#E5E2DE] overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full md:w-[420px] bg-white border-r border-line z-30 flex flex-col shadow-2xl relative">
        <div className="p-10 border-b border-line">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white shadow-xl shadow-brand/20">
              <MapPin size={22} strokeWidth={3} />
            </div>
            <h2 className="font-display font-black text-2xl uppercase tracking-tighter">İSTANBUL DESTEK</h2>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Arama</div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="NOKTA VEYA İLÇE..." 
                  className="w-full pl-12 pr-4 py-4 bg-paper border border-line rounded-2xl focus:ring-2 focus:ring-brand outline-none transition-all font-bold text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Filtrele</div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={3} />
                <select 
                  className="w-full pl-12 pr-4 py-4 bg-paper border border-line rounded-2xl focus:ring-2 focus:ring-brand outline-none transition-all appearance-none font-bold text-xs uppercase"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-paper/30">
          {loading && progress < 100 && (
            <div className="p-6 bg-white rounded-3xl border border-line shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Loader2 className="animate-spin text-brand" size={24} strokeWidth={3} />
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">Nominatim API Aktif</span>
              </div>
              <div className="w-full bg-line h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-brand h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {filteredPoints.map((point) => (
            <motion.div 
              layout
              key={point.id}
              className="p-6 bg-white border border-line rounded-[32px] hover:border-brand shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-ink text-lg leading-tight group-hover:text-brand transition-colors uppercase tracking-tighter">{point.name}</h3>
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${
                  point.type === 'Barınak' ? 'bg-blue-100 text-blue-600' :
                  point.type === 'Veteriner' ? 'bg-red-100 text-red-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {point.type.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-bold uppercase tracking-widest">
                  <MapPin size={12} strokeWidth={3} />
                  <span>{point.district}</span>
                </div>
                {point.isFree === 'Evet' && (
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <Heart size={10} fill="currentColor" strokeWidth={3} />
                    Ücretsiz
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          
          {!loading && filteredPoints.length === 0 && (
            <div className="text-center py-20 px-4">
              <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.2em]">Sonuç Bulunamadı</p>
            </div>
          )}
        </div>
        
        {/* Sidebar Footer Stats */}
        <div className="p-10 border-t border-line bg-white flex justify-between items-center">
            <div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Toplam</div>
              <div className="text-2xl font-black">{points.length}</div>
            </div>
            <div className="w-px h-8 bg-line"></div>
            <div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Güncelleme</div>
              <div className="text-2xl font-black">BUGÜN</div>
            </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative md:p-12 overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="w-full h-full bg-white md:rounded-[60px] shadow-[inset_0_2px_20px_rgba(0,0,0,0.1)] md:border-[16px] border-white relative overflow-hidden z-10 flex">
          <div className="relative w-full h-full min-h-full">
            <MapContainer 
              center={[41.0082, 28.9784]} 
              zoom={11} 
              scrollWheelZoom={true}
              zoomControl={false}
              className="absolute inset-0 w-full h-full"
            >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapController loading={loading} />
            <ZoomControl position="bottomright" />

            {filteredPoints.map((point) => (
              <Marker 
                key={point.id} 
                position={[point.lat!, point.lng!]}
                icon={SupportIcon}
              >
                <Tooltip className="custom-tooltip" direction="top" offset={[0, -32]}>
                   {point.name} • {point.district}
                </Tooltip>
                <Popup className="custom-popup" maxWidth={320}>
                  <div className="min-w-[280px]">
                    <div className={`${
                      point.type === 'Barınak' ? 'bg-blue-600' :
                      point.type === 'Veteriner' ? 'bg-red-600' :
                      'bg-emerald-600'
                    } p-8 text-white relative overflow-hidden`}>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{point.type}</span>
                          {point.isFree === 'Evet' && (
                            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Gönüllü/Ücretsiz</span>
                          )}
                        </div>
                        <h3 className="font-black text-2xl leading-[0.9] uppercase tracking-tighter">{point.name}</h3>
                      </div>
                      <div className="absolute -bottom-4 -right-4 opacity-10">
                         {point.type === 'Barınak' ? <Building2 size={80} strokeWidth={3} /> : 
                          point.type === 'Veteriner' ? <Heart size={80} strokeWidth={3} /> : 
                          <PawPrint size={80} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="text-zinc-300 pt-1"><MapPin size={20} strokeWidth={3} /></div>
                          <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">Adres</p>
                            <p className="text-sm font-bold text-ink leading-tight">{point.address}, {point.district}</p>
                          </div>
                        </div>
                        {point.phone !== '-' && (
                          <div className="flex gap-4">
                            <div className="text-zinc-300 pt-1"><Phone size={20} strokeWidth={3} /></div>
                            <div>
                              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">İletişim</p>
                              <p className="text-lg font-black text-ink">{point.phone}</p>
                            </div>
                          </div>
                        )}
                        {point.notes && (
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-line">
                            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">Bilgi</p>
                            <p className="text-xs font-medium text-zinc-600 italic leading-relaxed">"{point.notes}"</p>
                          </div>
                        )}
                      </div>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-5 bg-ink text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand transition-all shadow-xl shadow-ink/10 active:scale-95"
                      >
                        YOL TARİFİ AL
                        <ChevronRight size={16} strokeWidth={3} />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          </div>

          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[1000] bg-paper/60 backdrop-blur-md flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                     <Loader2 className="animate-spin text-brand w-full h-full" strokeWidth={3} />
                     <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-ink">{progress}%</div>
                  </div>
                  <h2 className="text-2xl font-display font-black text-ink mb-2 uppercase tracking-tighter">SİSTEM YÜKLENİYOR</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                    İSTANBUL DESTEK NOKTALARI KOORDİNAT HESAPLANIYOR
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
