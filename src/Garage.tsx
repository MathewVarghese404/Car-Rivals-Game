import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Settings, ChevronLeft, Save, PaintBucket, Cpu, Shield, Zap, Car } from 'lucide-react';

export function Garage({ setView }: { setView: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<'visual' | 'performance'>('visual');
  const [saved, setSaved] = useState(false);

  // States
  const [stats, setStats] = useState({ speed: 65, handling: 80, stealth: 45 });
  
  const [visuals, setVisuals] = useState({
    paint: '#FF4E00',
    decal: 'none',
    spoiler: 'stock',
    rims: 'alloy_v1'
  });

  const handleStatChange = (type: string, val: number) => {
    // Dummy handler for UI
  };

  const saveConfig = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setView('game');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col pt-20 px-6 pb-6 relative overflow-hidden font-sans">
      {/* Top Navbar overlay specific to Garage */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-dark border-b-2 border-brand panel-gradient">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('landing')} className="text-[var(--color-text-main)] hover:text-brand flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors">
            <ChevronLeft size={16} /> <span className="hidden sm:inline">Retreat</span>
          </button>
          <div className="w-px h-6 bg-border" />
          <span className="font-display text-2xl font-black uppercase text-white shadow-brand">Scrap Garage</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-[10px] uppercase text-brand font-bold tracking-widest">Available Credits</p>
            <p className="font-display text-xl font-black text-white">$45,200 CR</p>
          </div>
          <button 
            onClick={saveConfig}
            className="px-6 py-3 bg-success text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all flex items-center gap-2 skew-x-[-15deg]"
          >
            <span className="transform skew-x-[15deg] flex items-center gap-2">
              {saved ? 'UPLOADING...' : <><Save size={16} /> DEPLOY</>}
            </span>
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 mt-6">
        
        {/* Left Panel: Configuration Options */}
        <div className="lg:col-span-4 flex flex-col gap-[1px] bg-border border border-border">
          <div className="flex bg-dark">
            <button 
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-4 font-black uppercase text-xs tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'visual' ? 'bg-panel text-brand border-b-2 border-brand' : 'text-[var(--color-text-main)] hover:text-white'}`}
            >
              <PaintBucket size={16} /> Aesthetics
            </button>
            <button 
              onClick={() => setActiveTab('performance')}
              className={`flex-1 py-4 font-black uppercase text-xs tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'performance' ? 'bg-panel text-brand border-b-2 border-brand' : 'text-[var(--color-text-main)] hover:text-white'}`}
            >
              <Cpu size={16} /> Performance
            </button>
          </div>

          <div className="flex-1 bg-panel p-6 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'visual' && (
                <motion.div key="visual" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                  {/* Paint Section */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] border-b border-border pb-2">Chassis Pigment</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {['#FF4E00', '#00F0FF', '#FF00E5', '#00FF00', '#FFFFFF', '#0F1115', '#FFCC00', '#7C3AED', '#EF4444', '#3B82F6'].map(color => (
                        <button 
                          key={color}
                          onClick={() => setVisuals(v => ({...v, paint: color}))}
                          className={`w-full aspect-square border-2 transition-all ${visuals.paint === color ? 'border-white scale-110' : 'border-transparent hover:border-border'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Body Kits */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] border-b border-border pb-2">Body Kits</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Stock', 'Street Sweeper', 'Aero-Dynamics', 'Armored Rhino'].map(kit => (
                        <button key={kit} className="p-4 bg-dark border border-border hover:bg-[var(--color-border)] hover:text-white transition-colors text-left group">
                          <span className="font-sans font-bold text-xs uppercase block mb-1 text-[var(--color-text-main)] group-hover:text-white">{kit}</span>
                          <span className="font-mono text-[10px] text-brand opacity-80">$2,400</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spoilers & Unique Cosmetics */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] border-b border-border pb-2">Unique Cosmetics & Decals</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Holo-Projector Decal', 'Neon Underglow', 'Phantom Exhaust FX', 'Crimson Razor Rims'].map(decal => (
                        <button key={decal} className="p-4 bg-dark border border-border hover:border-brand transition-colors text-left flex items-center justify-between group">
                          <span className="font-sans font-bold text-xs uppercase block text-[var(--color-text-main)] group-hover:text-white">{decal}</span>
                          <span className="font-mono text-[10px] text-warning opacity-80">PRO</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'performance' && (
                <motion.div key="perf" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                  {/* Engine Tuning */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] border-b border-border pb-2"><Zap className="inline w-3 h-3 mr-2 text-brand" /> Engine Tuning</h3>
                    <div className="space-y-3">
                      {['V4 Eco-Mute (Stealth)', 'V6 Turbo (Balanced)', 'V8 Block (Max Speed)'].map((eng, idx) => (
                         <label key={eng} className="flex items-center gap-4 p-4 bg-dark border border-border cursor-pointer hover:border-brand transition-colors">
                            <input type="radio" name="engine" defaultChecked={idx===1} className="accent-brand w-4 h-4" />
                            <span className="font-sans font-bold text-xs uppercase text-white">{eng}</span>
                         </label>
                      ))}
                    </div>
                  </div>

                  {/* Tires */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] border-b border-border pb-2"><Shield className="inline w-3 h-3 mr-2 text-brand" /> Tire Compound & Suspension</h3>
                    <div className="space-y-3">
                      {['Street Grip & Stiff Suspension (+Handling)', 'Drift Specs & Lowered (-Handling, +Stealth)', 'Off-Road Tread & Rally Springs'].map((tire, idx) => (
                         <label key={tire} className="flex items-center gap-4 p-4 bg-dark border border-border cursor-pointer hover:border-brand transition-colors">
                            <input type="radio" name="tire" defaultChecked={idx===0} className="accent-brand w-4 h-4" />
                            <span className="font-sans font-bold text-xs uppercase text-white leading-tight">{tire}</span>
                         </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel: Auto Showcase & Stats */}
        <div className="lg:col-span-8 flex flex-col gap-[1px] bg-border border border-border relative">
          
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="px-3 py-1 bg-dark font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-main)] border border-border">Class: Touring</div>
            <div className="px-3 py-1 bg-dark font-mono text-[10px] font-bold uppercase tracking-widest text-brand border border-border">Blueprint: G-Coupe</div>
          </div>

          {/* Interactive Car Display Area */}
          <div className="flex-1 bg-dark relative overflow-hidden flex items-center justify-center min-h-[400px]">
            {/* Background grids and lights */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-[var(--color-panel)] to-transparent" />
            
            <div className="relative z-10 w-full max-w-2xl px-12">
               {/* Simplified 2D Top-Down/Isometric representation */}
               <motion.div 
                 key={visuals.paint}
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="w-full aspect-[2/1] relative transform perspective-[1000px] rotate-x-[10deg] rotate-y-[-15deg] shadow-2xl"
               >
                 <div className="absolute inset-0 rounded-3xl border-4 border-[#333]" style={{ backgroundColor: visuals.paint }}>
                    <div className="absolute top-[20%] left-[25%] w-[50%] h-[60%] bg-[#050505] rounded-xl border-t border-white/20" /> {/* Cockpit / Glass */}
                    <div className="absolute -left-2 top-[15%] w-4 h-[20%] bg-black rounded" /> {/* Wheel FL */}
                    <div className="absolute -left-2 bottom-[15%] w-4 h-[20%] bg-black rounded" /> {/* Wheel RL */}
                    <div className="absolute -right-2 top-[15%] w-4 h-[20%] bg-black rounded" /> {/* Wheel FR */}
                    <div className="absolute -right-2 bottom-[15%] w-4 h-[20%] bg-black rounded" /> {/* Wheel RR */}
                    {/* Headlights */}
                    <div className="absolute right-0 top-[15%] w-8 h-[20%] bg-yellow-400 rounded-l shadow-[20px_0_40px_rgba(250,204,21,0.5)]" />
                    <div className="absolute right-0 bottom-[15%] w-8 h-[20%] bg-yellow-400 rounded-l shadow-[20px_0_40px_rgba(250,204,21,0.5)]" />
                 </div>
               </motion.div>
            </div>
          </div>

          {/* Stat Block */}
          <div className="h-48 bg-panel p-8 grid grid-cols-3 gap-8 items-center border-t border-border relative z-20">
            {Object.entries(stats).map(([key, val]) => (
              <div key={key} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-mono font-bold text-xs uppercase tracking-widest text-[var(--color-text-main)] block">{key}</span>
                  <span className="font-display font-black text-2xl text-white block">{val}<span className="text-sm text-brand">/100</span></span>
                </div>
                <div className="w-full h-2 bg-dark rounded overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    className="h-full bg-brand"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
