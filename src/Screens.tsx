import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Car, Lock, CreditCard, ShieldAlert } from 'lucide-react';

export function SignIn({ setView }: { setView: (v: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('paywall');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-panel border-2 border-border p-8 relative skew-x-[-2deg]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 bg-brand flex items-center justify-center rounded-sm transform skew-x-[-15deg]">
            <Car className="text-black transform skew-x-[15deg] w-6 h-6" />
          </div>
          <span className="font-display text-4xl tracking-tight uppercase font-black text-brand">Road Rivals</span>
        </div>

        <h2 className="font-display text-2xl font-black uppercase text-center mb-6">Driver Authentication</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">Callsign / ID</label>
            <input 
              type="text" 
              required
              className="w-full bg-dark border border-border p-3 font-mono text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="GHOST_RACER_99"
            />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">Access Code</label>
            <input 
              type="password" 
              required
              className="w-full bg-dark border border-border p-3 font-sans text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-brand text-black font-sans font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center hover:bg-white disabled:opacity-50 skew-x-[-15deg]"
          >
            <span className="transform skew-x-[15deg] flex items-center gap-2">
              {loading ? (
                <>AUTHENTICATING...</>
              ) : (
                <>INITIALIZE UPLINK <ShieldAlert size={14} /></>
              )}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export function Paywall({ setView }: { setView: (v: string) => void }) {
  const [processing, setProcessing] = useState(false);

  const handlePurchase = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setView('garage');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/10 via-dark to-dark" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand mb-4 block">Restricted Sector</span>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-4">Unlock The Circuit</h1>
          <p className="text-[var(--color-text-main)] font-sans font-medium text-lg max-w-2xl mx-auto">
            Upgrade to the PRO LICENSE to access the Garage Customizer, Ranked Matches, and the Underground Tunnel Network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-border border border-border">
          {/* Free Tier */}
          <div className="p-10 bg-panel opacity-60 grayscale">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-2 block">Standard License</span>
            <h3 className="font-display text-4xl font-black uppercase mb-6">Free</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm font-bold text-[var(--color-text-main)] uppercase"><div className="w-2 h-2 bg-border" /> Limited Garage</li>
              <li className="flex items-center gap-3 text-sm font-bold text-[var(--color-text-main)] uppercase"><div className="w-2 h-2 bg-border" /> 2 Playable Maps</li>
              <li className="flex items-center gap-3 text-sm font-bold text-[var(--color-text-main)] uppercase"><div className="w-2 h-2 bg-border" /> Driver Role Only</li>
            </ul>
            <button disabled className="w-full py-4 border border-border text-[var(--color-text-main)] font-black uppercase tracking-[0.2em] text-xs opacity-50 cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-10 bg-dark relative border-t-4 border-brand">
            <div className="absolute top-4 right-4 bg-brand text-black font-bold uppercase text-[10px] tracking-wider px-3 py-1 skew-x-[-10deg]">
              <span className="block transform skew-x-[10deg]">Recommended</span>
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand mb-2 block">Pro License</span>
            <h3 className="font-display text-4xl font-black uppercase mb-2 text-white">$14.99 <span className="text-lg text-[var(--color-text-main)] opacity-70">/season</span></h3>
            <p className="text-[10px] text-brand uppercase tracking-widest font-mono mb-6 border-b border-white/10 pb-4">Billed once. Keep forever.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm font-bold text-white uppercase"><div className="w-2 h-2 bg-brand shadow-[0_0_10px_rgba(255,78,0,0.8)]" /> Full Customization Engine</li>
              <li className="flex items-center gap-3 text-sm font-bold text-white uppercase"><div className="w-2 h-2 bg-brand" /> All 5 Circuit Maps</li>
              <li className="flex items-center gap-3 text-sm font-bold text-white uppercase"><div className="w-2 h-2 bg-brand" /> Unlock Saboteur Role</li>
              <li className="flex items-center gap-3 text-sm font-bold text-white uppercase"><div className="w-2 h-2 bg-brand" /> Exclusive Neon FX Pack</li>
            </ul>

            <button 
              onClick={handlePurchase}
              disabled={processing}
              className="w-full py-4 bg-brand text-black font-sans font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-white disabled:opacity-70 skew-x-[-15deg]"
            >
              <span className="transform skew-x-[15deg] flex items-center justify-center gap-2">
                {processing ? 'Processing Secure Link...' : <><CreditCard size={16} /> Purchase Access</>}
              </span>
            </button>
            <p className="font-mono text-[10px] text-[var(--color-text-main)] opacity-50 text-center mt-4">Secure 256-bit encryption. Can cancel anytime.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
