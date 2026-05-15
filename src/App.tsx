/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  ShieldAlert, 
  Map as MapIcon, 
  Wrench, 
  Zap, 
  Skull, 
  Users, 
  Trophy, 
  ChevronRight, 
  Fuel, 
  Cpu, 
  CloudRain, 
  Snowflake,
  Flame,
  Bomb,
  EyeOff,
  Radio,
  Navigation
} from 'lucide-react';

import { SignIn, Paywall } from './Screens';
import { Garage } from './Garage';
import { GameEngine } from './Game';

// --- Types ---
interface MapData {
  id: number;
  name: string;
  theme: string;
  hazards: string[];
  specialFeature: string;
  color: string;
  image: string;
}

interface TaskData {
  name: string;
  description: string;
  icon: React.ReactNode;
}

// --- Data ---
const MAPS: MapData[] = [
  {
    id: 1,
    name: "NEON CITY CIRCUIT",
    theme: "Cyberpunk downtown, night race, neon reflections on wet roads",
    hazards: ["Moving trams", "Red-light cameras", "Rain puddles"],
    specialFeature: "Rooftop shortcut accessible by ramp",
    color: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "DESERT HEAT TRACK",
    theme: "Arid canyon roads, dust storms, midday heat haze",
    hazards: ["Sandstorms reduction", "Crumbling cliff edges", "Explosive fuel barrels"],
    specialFeature: "A sand tunnel only Saboteurs can use",
    color: "from-orange-400 to-red-600",
    image: "https://images.unsplash.com/photo-1469060205005-5f36056d713a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "ARCTIC FREIGHT ZONE",
    theme: "Frozen tundra, icy roads, blizzard conditions",
    hazards: ["Black ice skidding", "Avalanche warnings", "Frozen bridges"],
    specialFeature: "Ice cracking under heavy vehicles — car choice matters",
    color: "from-blue-200 to-indigo-400",
    image: "https://images.unsplash.com/photo-1548696347-f05020a32375?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "PORT CARGO COMPLEX",
    theme: "Industrial harbor, shipping containers, cranes",
    hazards: ["Moving cranes dropping containers", "Forklift NPCs", "Flooded lower decks"],
    specialFeature: "Interactive Crane Hijack: Saboteurs can block lanes via control rooms",
    color: "from-slate-400 to-slate-700",
    image: "https://images.unsplash.com/photo-1586528116311-ad866c820986?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "VOLCANO RIDGE PASS",
    theme: "High-altitude pass near active volcano, glowing lava flows",
    hazards: ["Falling volcanic rock", "Heat fatigue (engine damage in lava zones)", "Sulphur clouds"],
    specialFeature: "Lava Bridges: Activated only via team Bridge Extension tasks",
    color: "from-orange-600 to-red-900",
    image: "https://images.unsplash.com/photo-1506020424100-3fc1e84711f9?auto=format&fit=crop&q=80&w=800"
  }
];

const TASKS: TaskData[] = [
  { name: "Fuel Refill", description: "Match pressure gauge to green zone at pump", icon: <Fuel className="w-5 h-5 text-brand" /> },
  { name: "Tire Swap", description: "Tap tires in sequence before timer runs out", icon: <Car className="w-5 h-5 text-brand" /> },
  { name: "Engine Repair", description: "Connect matching color wires under the hood", icon: <Wrench className="w-5 h-5 text-brand" /> },
  { name: "Cargo Delivery", description: "Drive fragile crate to zone without crashing", icon: <Zap className="w-5 h-5 text-brand" /> },
  { name: "Traffic Redirect", description: "Flip road signs using switch puzzles", icon: <Navigation className="w-5 h-5 text-brand" /> },
  { name: "Bridge Override", description: "Hold position on pressure plate for partner", icon: <CloudRain className="w-5 h-5 text-brand" /> },
  { name: "Fuel Siphon", description: "Drain fuel with skill-shot mini-game", icon: <Fuel className="w-5 h-5 text-brand" /> },
  { name: "Signal Boost", description: "Drive to high ground & align satellite dish", icon: <Radio className="w-5 h-5 text-brand" /> }
];

const SABOTEUR_ABILITIES = [
  { name: "Shadow Kill", description: "Ram a Driver in blind spots to eliminate them.", icon: <Skull /> },
  { name: "Circuit Overload", description: "Trigger city blackout — all minimaps offline.", icon: <Zap /> },
  { name: "Roadblock Plant", description: "Place invisible spike strips on roads.", icon: <Bomb /> },
  { name: "Underground Tunnel", description: "Replace vents — reappear across map instantly.", icon: <EyeOff /> }
];

// --- Components ---

const Navbar = ({ setView }: { setView: (v: string) => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-dark border-b-2 border-brand panel-gradient">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-brand flex items-center justify-center rounded-sm transform skew-x-[-15deg]">
        <Car className="text-black transform skew-x-[15deg]" />
      </div>
      <span className="font-display text-2xl font-black tracking-tight uppercase text-brand">Road Rivals</span>
    </div>
    <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase text-[var(--color-text-main)] opacity-80">
      <a href="#gameplay" className="hover:text-brand transition-colors">Gameplay</a>
      <a href="#roles" className="hover:text-brand transition-colors">Roles</a>
      <a href="#maps" className="hover:text-brand transition-colors">Maps</a>
      <a href="#tasks" className="hover:text-brand transition-colors">Tasks</a>
    </div>
    <button onClick={() => setView('signin')} className="px-5 py-2 bg-brand text-black font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all transform skew-x-[-15deg]">
      <span className="block transform skew-x-[15deg]">Play Now</span>
    </button>
  </nav>
);

const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="flex flex-col mb-12 relative">
    <span className="font-mono text-8xl md:text-[10rem] font-bold leading-none opacity-10 -mb-10 text-brand selection:bg-transparent">{number}</span>
    <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-brand relative z-10 selection:bg-brand">
      {title}
    </h2>
    <div className="h-1 w-24 bg-brand mt-4" />
  </div>
);

function Landing({ setView }: { setView: (v: string) => void }) {
  const [activeMap, setActiveMap] = useState(MAPS[0]);

  return (
    <div className="min-h-screen custom-scrollbar">
      <Navbar setView={setView} />

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
          <img 
            src="https://images.unsplash.com/photo-1563220413-435777dfb24c?auto=format&fit=crop&q=80&w=2000" 
            alt="Racing hero" 
            className="w-full h-full object-cover opacity-60 filter grayscale brightness-50"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="font-heading text-brand font-bold uppercase tracking-[0.5em] text-xs md:text-sm">
              Multiple Social Deduction × Vehicular Action
            </span>
          </motion.div>

          <div className="title-wrapper overflow-hidden">
            <h1 className="font-display text-7xl md:text-[12vw] lg:text-[15rem] leading-[0.85] uppercase slam-in text-brand font-black tracking-tight">
              Betrayal<br />Circuit
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-dark bg-slate-800 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 12}`} alt="player" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-dark bg-brand flex items-center justify-center text-xs font-bold">
                12+
              </div>
            </div>
            <p className="font-heading text-sm text-slate-400 max-w-sm text-center md:text-left">
              4-12 Players. Complete tasks to fix the city or eliminate the crew before you're found out.
            </p>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 select-none">
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to Inspect</span>
            <div className="w-px h-12 bg-white" />
          </div>
        </div>
      </header>

      {/* Gameplay Loop Section */}
      <section id="gameplay" className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
        <SectionHeader number="01" title="The Loop" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border border border-border">
          {[
            { phase: "Phase 1", title: "Lobby & Setup", desc: "Select your ride from the garage. Secret roles assigned. Map briefing begins.", icon: <Users /> },
            { phase: "Phase 2", title: "The Circuit", desc: "Open-world racing map with 10 zones. Constant movement is survival.", icon: <MapIcon /> },
            { phase: "Phase 3", title: "Task Execution", desc: "Drivers must complete 20+ mini-games to repair city systems.", icon: <Wrench /> },
            { phase: "Phase 4", title: "Sabotage", desc: "Impostors trigger blackouts, plant spikes, and use dark tunnels.", icon: <ShieldAlert /> },
            { phase: "Phase 5", title: "Emergency Horn", desc: "Gather at the Plaza. Discuss. Eject. The hydraulic press awaits.", icon: <Trophy /> },
            { phase: "Ghost Mode", title: "Post-Life Service", desc: "Dead players become Ghost Cars — keep doing tasks to help win.", icon: <Zap /> },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ backgroundColor: "#1A1D23" }}
              className="p-10 bg-dark"
            >
              <div className="text-brand mb-6 flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest uppercase opacity-60">{item.phase}</span>
                <div className="w-8 h-8 rounded-full border border-brand/30 flex items-center justify-center">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                </div>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roles Comparison */}
      <section id="roles" className="py-24 md:py-40 bg-dark panel-gradient relative overflow-hidden border-t-2 border-brand">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader number="02" title="The Factions" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {/* Drivers */}
            <div className="p-8 md:p-12 border border-border bg-panel border-l-4 border-l-success">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-success/20 text-success rounded-xl">
                  <Car size={32} />
                </div>
                <div>
                  <h3 className="font-display text-5xl font-black uppercase tracking-tight">Drivers</h3>
                  <p className="font-sans font-bold text-xs uppercase tracking-widest text-success">The Repair Crew</p>
                </div>
              </div>
              <ul className="space-y-6">
                {[
                  "Maintain the Circuit through task completion.",
                  "Stay in groups to prevent Shadow Kills.",
                  "Monitor minimap for emergency signals.",
                  "Identify and report suspicious driving patterns."
                ].map((li, i) => (
                  <li key={i} className="flex gap-4 items-start text-sm text-[var(--color-text-main)] font-medium">
                    <ChevronRight size={18} className="text-success flex-shrink-0 mt-0.5" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Saboteurs */}
            <div className="p-8 md:p-12 border border-border bg-panel border-l-4 border-l-danger">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-danger/20 text-danger rounded-xl">
                  <Skull size={32} />
                </div>
                <div>
                  <h3 className="font-display text-5xl font-black uppercase tracking-tight">Saboteurs</h3>
                  <p className="font-sans font-bold text-xs uppercase tracking-widest text-danger">The Betrayers</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SABOTEUR_ABILITIES.map((ability, i) => (
                  <div key={i} className="p-4 bg-dark border border-border flex flex-col gap-2">
                    <div className="text-danger">{React.cloneElement(ability.icon as React.ReactElement, { size: 14 })}</div>
                    <h4 className="font-sans font-bold text-xs uppercase">{ability.name}</h4>
                    <p className="text-[10px] text-[var(--color-text-main)] opacity-70">{ability.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maps Showcase */}
      <section id="maps" className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <SectionHeader number="03" title="World Circuit" />
          <div className="flex gap-2">
            {MAPS.map(m => (
              <button 
                key={m.id}
                onClick={() => setActiveMap(m)}
                className={`h-3 rounded-none transition-all border border-border ${activeMap.id === m.id ? 'bg-brand w-10' : 'bg-dark w-3'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative group">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeMap.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="aspect-video overflow-hidden relative border-4 border-border shadow-2xl skew-x-[-2deg]"
              >
                <img 
                  src={activeMap.image} 
                  alt={activeMap.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-80`} />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className={`w-12 h-1 bg-gradient-to-r ${activeMap.color}`} />
                  <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold text-white shadow-black drop-shadow-md">{activeMap.name}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight leading-none mb-4">{activeMap.name}</h3>
                  <p className="text-[var(--color-text-main)] text-lg font-sans font-medium leading-relaxed">{activeMap.theme}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-4 flex items-center gap-2">
                       Environmental Hazards
                    </h4>
                    <ul className="space-y-2">
                      {activeMap.hazards.map((h, i) => (
                        <li key={i} className="text-sm font-mono font-bold opacity-80 flex items-center gap-2">
                           <div className="w-2 h-2 bg-brand" /> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-panel border-l-2 border-brand">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neon-blue mb-2 flex items-center gap-2">
                       Special Feature
                    </h4>
                    <p className="text-xs text-[var(--color-text-main)] font-medium leading-normal">{activeMap.specialFeature}</p>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button className="flex-1 py-4 bg-brand text-black font-sans font-black uppercase tracking-[0.2em] text-xs transition-all group skew-x-[-15deg] hover:bg-white">
                    <span className="inline-block transform skew-x-[15deg]">View Strategic Layout <ChevronRight className="inline-block ml-1 group-hover:translate-x-1 transition-transform" /></span>
                  </button>
                  <button className="px-6 py-4 border border-border hover:bg-panel transition-all skew-x-[-15deg]">
                    <MapIcon size={18} className="transform skew-x-[15deg]" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Tasks Grid */}
      <section id="tasks" className="py-24 md:py-40 bg-panel relative overflow-hidden border-t-2 border-border">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 relative">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand mb-4 block">20+ Interactive Systems</span>
            <h2 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tight mb-6 relative z-10 text-white">Repair the City</h2>
            <p className="text-[var(--color-text-main)] max-w-2xl mx-auto font-sans font-medium text-lg relative z-10">
              Each zone features unique mechanical and digital puzzles. Drivers must balance speed with precision to keep the circuit running.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border border border-border mt-12">
            {TASKS.map((task, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ backgroundColor: "#0F1115" }}
                className="p-6 bg-dark group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4">{task.icon}</div>
                <div>
                  <h4 className="font-display font-black text-lg uppercase tracking-tight mb-2">{task.name}</h4>
                  <p className="font-mono text-xs text-[var(--color-text-main)] opacity-70 leading-relaxed font-bold">{task.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Economy Section */}
      <section id="economy" className="py-24 md:py-40 bg-dark panel-gradient border-t-2 border-brand">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader number="04" title="The Economy" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-border mt-12 border border-border">
            {[
              { 
                title: "Road Pass", 
                type: "Seasonal Progression", 
                desc: "100 tiers of unlockables including exclusive car frame sets and emotes.", 
                perks: ["Double XP Weekends", "Premium Vault Access", "Season-exclusive Decals"],
                icon: <Trophy className="text-warning" />
              },
              { 
                title: "Garage Customs", 
                type: "Monetized Cosmetics", 
                desc: "Deep monetization through body kits, neon underglow, and interactive dash pets.", 
                perks: ["Holographic Wraps", "Custom Engine Samples", "Smoke Trail FX"],
                icon: <Car className="text-neon-blue" />
              },
              { 
                title: "Circuit Scrap", 
                type: "Play-to-Earn", 
                desc: "In-game currency earned purely through match performance and task completion.", 
                perks: ["Used for Base Upgrades", "Standard Paint Tiers", "Profile Badges"],
                icon: <Zap className="text-success" />
              }
            ].map((item, idx) => (
              <div key={idx} className="p-10 bg-panel relative group overflow-hidden hover:bg-dark transition-colors">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                <div className="mb-6">{item.icon}</div>
                <span className="font-mono font-bold text-[10px] uppercase tracking-widest opacity-60 mb-2 block">{item.type}</span>
                <h3 className="font-display text-3xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-[var(--color-text-main)] text-sm mb-8 leading-relaxed font-medium">{item.desc}</p>
                <div className="space-y-3">
                  {item.perks.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-[var(--color-text-main)] uppercase tracking-wider">
                      <div className="w-2 h-2 bg-border" /> {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Spec / Architecture */}
      <section className="py-24 border-y border-border bg-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl uppercase font-black tracking-tight mb-12">Technical Blueprint</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border border border-border">
            <div className="p-6 bg-panel">
              <p className="text-brand font-display text-3xl font-black mb-1">UNREAL 5</p>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">Engine</p>
            </div>
            <div className="p-6 bg-panel">
              <p className="text-neon-blue font-display text-3xl font-black mb-1">WSS-PRO</p>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">Netcode</p>
            </div>
            <div className="p-6 bg-panel">
              <p className="text-success font-display text-3xl font-black mb-1">GCP/EDGE</p>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">Servers</p>
            </div>
            <div className="p-6 bg-panel">
              <p className="text-white font-display text-3xl font-black mb-1">CROSSPLAY</p>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">Platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 border-t-2 border-brand bg-panel px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
              <div className="w-12 h-12 bg-brand flex items-center justify-center rounded-sm transform skew-x-[-15deg]">
                <Car className="text-black transform skew-x-[15deg] w-6 h-6" />
              </div>
              <span className="font-display text-4xl tracking-tight uppercase font-black text-brand">Road Rivals</span>
            </div>
            <p className="text-[var(--color-text-main)] text-xs font-bold tracking-widest uppercase mb-2">Designed for High-stakes Competition</p>
            <p className="font-mono text-[10px] opacity-60 font-bold">BLUEPRINT v.1.0.4 — © 2024 BETRAYAL SYSTEMS INC.</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-6 uppercase font-sans text-[10px] font-bold tracking-[0.3em] opacity-60">
              <a href="#" className="hover:text-brand transition-colors">Technical Docs</a>
              <a href="#" className="hover:text-brand transition-colors">Asset Pack</a>
              <a href="#" className="hover:text-brand transition-colors">Financial Forecast</a>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-border bg-dark flex items-center justify-center hover:bg-brand hover:text-black transition-all cursor-pointer transform skew-x-[-15deg]">
                <Radio size={16} className="transform skew-x-[15deg]" />
              </div>
              <div className="w-10 h-10 border border-border bg-dark flex items-center justify-center hover:bg-brand hover:text-black transition-all cursor-pointer transform skew-x-[-15deg]">
                <Skull size={16} className="transform skew-x-[15deg]" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('landing');
  
  if (view === 'signin') return <SignIn setView={setView} />;
  if (view === 'paywall') return <Paywall setView={setView} />;
  if (view === 'garage') return <Garage setView={setView} />;
  if (view === 'game') return <GameEngine setView={setView} />;

  return <Landing setView={setView} />;
}
