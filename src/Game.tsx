import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Skull, Wrench, Send, AlertTriangle, User, Users, MessageSquare } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, ContactShadows, Grid, Environment, Box, Cylinder } from '@react-three/drei';
import { Joystick } from 'react-joystick-component';
import * as THREE from 'three';

// --- 3D Components ---

function City() {
  // A simple grid of buildings to create a city feeling
  const buildings = [];
  for (let i = -5; i <= 5; i++) {
    for (let j = -5; j <= 5; j++) {
      if (Math.abs(i) < 2 && Math.abs(j) < 2) continue; // leave center open
      if (Math.random() > 0.6) {
        buildings.push(
          <Box 
            key={`${i}-${j}`} 
            position={[i * 20, Math.random() * 10 + 5, j * 20]} 
            args={[10, Math.random() * 20 + 10, 10]}
          >
            <meshStandardMaterial color="#1A1D23" roughness={0.8} />
          </Box>
        );
      }
    }
  }
  return <group>{buildings}</group>;
}

function CarBody({ color = '#FF4E00', isImpostor = false }) {
  // Simple futuristic car composed of basic Drei shapes
  return (
    <group>
      {/* Main Chassis */}
      <Box position={[0, 0.4, 0]} args={[1.8, 0.5, 4]}>
        <meshStandardMaterial color={isImpostor ? '#EF4444' : color} roughness={0.3} metalness={0.7} />
      </Box>
      {/* Cabin */}
      <Box position={[0, 0.9, -0.2]} args={[1.4, 0.5, 2]}>
        <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.9} />
      </Box>
      {/* Spoiler */}
      <Box position={[0, 1.2, 1.8]} args={[1.8, 0.1, 0.4]}>
         <meshStandardMaterial color={isImpostor ? '#EF4444' : color} roughness={0.3} metalness={0.7} />
      </Box>
      <Box position={[-0.8, 0.9, 1.8]} args={[0.1, 0.3, 0.4]}>
         <meshStandardMaterial color="#0A0A0A" />
      </Box>
      <Box position={[0.8, 0.9, 1.8]} args={[0.1, 0.3, 0.4]}>
         <meshStandardMaterial color="#0A0A0A" />
      </Box>

      {/* Wheels */}
      <Cylinder position={[-1, 0.4, 1.3]} rotation={[0, 0, Math.PI / 2]} args={[0.4, 0.4, 0.2, 32]}>
        <meshStandardMaterial color="#111" />
      </Cylinder>
      <Cylinder position={[1, 0.4, 1.3]} rotation={[0, 0, Math.PI / 2]} args={[0.4, 0.4, 0.2, 32]}>
        <meshStandardMaterial color="#111" />
      </Cylinder>
      <Cylinder position={[-1, 0.4, -1.3]} rotation={[0, 0, Math.PI / 2]} args={[0.4, 0.4, 0.2, 32]}>
        <meshStandardMaterial color="#111" />
      </Cylinder>
      <Cylinder position={[1, 0.4, -1.3]} rotation={[0, 0, Math.PI / 2]} args={[0.4, 0.4, 0.2, 32]}>
        <meshStandardMaterial color="#111" />
      </Cylinder>

      {/* Headlights */}
      <Box position={[-0.6, 0.5, -2.05]} args={[0.4, 0.1, 0.1]}>
         <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2} />
      </Box>
      <Box position={[0.6, 0.5, -2.05]} args={[0.4, 0.1, 0.1]}>
         <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2} />
      </Box>
      
      {/* Tail lights */}
      <Box position={[-0.6, 0.5, 2.05]} args={[0.4, 0.1, 0.1]}>
         <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={2} />
      </Box>
      <Box position={[0.6, 0.5, 2.05]} args={[0.4, 0.1, 0.1]}>
         <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={2} />
      </Box>
    </group>
  );
}

function PlayerCar({ joystickRef, setSpeedDisplay }) {
  const group = useRef<THREE.Group>(null);
  
  const velocity = useRef(0);
  const angle = useRef(0);

  const keys = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) keys.current[key as keyof typeof keys.current] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) keys.current[key as keyof typeof keys.current] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Joystick input
    let moveForward = keys.current.w ? 1 : (keys.current.s ? -1 : 0);
    let turn = keys.current.d ? -1 : (keys.current.a ? 1 : 0);

    if (joystickRef.current) {
      if (joystickRef.current.y !== 0) moveForward = joystickRef.current.y;
      if (joystickRef.current.x !== 0) turn = -joystickRef.current.x; // Invert X for correct rotation
    }

    const acceleration = 15.0 * delta;
    const friction = 0.95;
    const maxSpeed = 30.0;
    const turnSpeed = 2.0 * delta;

    if (moveForward > 0) velocity.current += acceleration * moveForward;
    else if (moveForward < 0) velocity.current += acceleration * moveForward;

    velocity.current *= friction;

    if (velocity.current > maxSpeed) velocity.current = maxSpeed;
    if (velocity.current < -maxSpeed / 2) velocity.current = -maxSpeed / 2;

    if (Math.abs(velocity.current) > 0.1) {
       const turnAmount = turn * turnSpeed * (velocity.current > 0 ? 1 : -1);
       angle.current += turnAmount;
    }

    // Apply movement
    group.current.rotation.y = angle.current;
    group.current.position.z -= Math.cos(angle.current) * velocity.current * delta;
    group.current.position.x -= Math.sin(angle.current) * velocity.current * delta;

    // Camera follow (smoothed)
    const cameraOffset = new THREE.Vector3(0, 5, 12);
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle.current);
    
    state.camera.position.lerp(
      new THREE.Vector3(
        group.current.position.x + cameraOffset.x,
        group.current.position.y + cameraOffset.y,
        group.current.position.z + cameraOffset.z
      ),
      0.1
    );
    state.camera.lookAt(group.current.position);

    setSpeedDisplay(Math.round(Math.abs(velocity.current) * 4));
  });

  return (
    <group ref={group}>
      <CarBody />
    </group>
  );
}

// --- UI Framework ---

export function GameEngine({ setView }: { setView: (v: string) => void }) {
  const joystickRef = useRef({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0);
  const [showJoystick, setShowJoystick] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Detect mobile touch
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isMobile) {
      setShowJoystick(true);
    }
  }, []);

  const handleJoystickMove = (e: any) => {
    joystickRef.current = { x: e.x / 50, y: e.y / 50 }; // Normalize
  };
  const handleJoystickStop = () => {
    joystickRef.current = { x: 0, y: 0 };
  };

  return (
    <div className="fixed inset-0 bg-dark z-[100] font-sans">
      
      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} />
        <ambientLight intensity={0.5} />
        <directionalLight 
           castShadow 
           position={[10, 20, 10]} 
           intensity={1.5} 
           shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="night" />

        <PlayerCar joystickRef={joystickRef} setSpeedDisplay={setSpeed} />
        <City />

        {/* Floor */}
        <Grid position={[0, -0.01, 0]} args={[100, 100]} cellColor="#1A1D23" sectionColor="#FF4E00" sectionThickness={1.5} fadeDistance={50} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
      </Canvas>

      {/* UI Overlay */}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
        
        {/* Top Left: Settings & Exit */}
        <div className="pointer-events-auto flex items-center gap-4">
          <button 
            onClick={() => setView('garage')}
            className="px-4 py-2 bg-[var(--color-panel)] text-white border-2 border-border font-black uppercase text-xs tracking-widest hover:border-brand hover:text-brand transition-all flex items-center gap-2 skew-x-[-15deg] shadow-lg"
          >
            <span className="transform skew-x-[15deg] flex items-center gap-2">
              <LogOut size={16} /> LEAVE
            </span>
          </button>
          
          {/* Controls Toggle */}
          <button 
            onClick={() => setShowJoystick(!showJoystick)}
            className="px-3 py-2 bg-dark/80 backdrop-blur border border-border text-[var(--color-text-main)] font-bold uppercase text-[10px] hover:text-white pointer-events-auto"
          >
            Toggle Controls
          </button>
        </div>

        {/* Top Center: Role Status */}
        <div className="bg-dark/90 backdrop-blur-md border border-danger p-3 skew-x-[-10deg] shadow-[0_0_15px_rgba(255,0,0,0.2)]">
          <div className="transform skew-x-[10deg] text-center">
            <span className="font-mono text-[10px] font-bold text-danger uppercase tracking-widest block mb-1">Your Role</span>
            <span className="font-display text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
               <Skull size={18} className="text-danger" /> Saboteur
            </span>
          </div>
        </div>

        {/* Top Right: Task List */}
        <div className="w-64 bg-dark/80 backdrop-blur-md border-[1px] border-border p-4 pointer-events-auto shadow-2xl">
          <h4 className="font-display font-black text-lg uppercase tracking-tight text-brand mb-3 border-b border-border pb-2 flex justify-between items-center">
            Circuit Tasks <span className="font-mono text-xs opacity-60">2/5</span>
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="mt-0.5 text-success"><Wrench size={14} /></div>
              <div>
                <p className="font-sans font-bold text-xs uppercase text-white line-through opacity-50">Calibrate Fuel Pumps</p>
                <p className="font-mono text-[10px] text-success">COMPLETED</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5 text-warning"><AlertTriangle size={14} /></div>
              <div>
                <p className="font-sans font-bold text-xs uppercase text-warning">Fix Signal Tower</p>
                <p className="font-mono text-[10px] text-[var(--color-text-main)]">Sector 4</p>
              </div>
            </li>
             <li className="flex items-start gap-2">
              <div className="mt-0.5 text-[var(--color-text-main)]"><Wrench size={14} /></div>
              <div>
                <p className="font-sans font-bold text-xs uppercase text-[var(--color-text-main)]">Inspect Cargo Bay</p>
                <p className="font-mono text-[10px] text-[var(--color-text-main)] opacity-50">Docks</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 flex justify-between items-end pointer-events-none">
        
        {/* Bottom Left: Chat & Players */}
        <div className="w-[60%] sm:w-80 pointer-events-auto">
          {chatOpen ? (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-dark/90 backdrop-blur border border-border h-64 flex flex-col mb-4 overflow-hidden shadow-2xl">
              <div className="bg-panel p-2 border-b border-border flex justify-between items-center">
                <span className="font-mono text-[10px] font-bold text-brand uppercase tracking-widest">Team Comms (Proximity)</span>
                <button onClick={() => setChatOpen(false)} className="text-[var(--color-text-main)] hover:text-white">x</button>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] space-y-2">
                <p><span className="text-neon-blue">[DRIFT_KING]</span> Anyone near the docks?</p>
                <p><span className="text-warning">[GHOST_RACER]</span> Doing fuel task.</p>
                <p><span className="text-danger">[SYSTEM]</span> PLAYER_4 disconnected.</p>
              </div>
              <div className="p-2 border-t border-border flex gap-2">
                <input type="text" className="flex-1 bg-dark border border-border px-2 py-1 font-mono text-xs text-white focus:outline-none focus:border-brand" placeholder="Type message..." />
                <button className="bg-brand text-black px-3 font-bold hover:bg-white transition-colors"><Send size={14}/></button>
              </div>
            </motion.div>
          ) : (
            <button 
              onClick={() => setChatOpen(true)}
              className="bg-panel/80 backdrop-blur border border-border px-4 py-3 font-bold text-xs uppercase tracking-widest text-white hover:border-brand transition-colors flex items-center gap-2 mb-4"
            >
              <MessageSquare size={16} /> Open Comms
            </button>
          )}

          <div className="bg-dark/60 backdrop-blur p-3 border-l-4 border-brand inline-block">
             <h3 className="font-display text-4xl font-black uppercase text-white tracking-tight">{speed} <span className="text-xl text-brand">KM/H</span></h3>
          </div>
        </div>

        {/* Bottom Right: Action Buttons & Joystick */}
        <div className="flex flex-col items-end gap-6 pointer-events-auto">
          
          <div className="flex gap-4">
             <button className="w-16 h-16 rounded-full bg-dark/80 backdrop-blur border-2 border-brand text-brand flex flex-col items-center justify-center hover:bg-brand hover:text-black transition-all shadow-[0_0_15px_rgba(255,78,0,0.3)] group">
                <Wrench size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[8px] font-bold">TASK</span>
             </button>
             <button className="w-20 h-20 rounded-full bg-danger/20 backdrop-blur border-2 border-danger text-danger flex flex-col items-center justify-center hover:bg-danger hover:text-black transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] group">
                <Skull size={32} className="mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[9px] font-bold">ELIMINATE</span>
             </button>
          </div>

          {showJoystick && (
            <div className="w-32 h-32 bg-dark/40 rounded-full border border-white/10 backdrop-blur flex items-center justify-center relative touch-none mb-10 mr-10 sm:m-0 sm:mr-10 sm:mb-10">
              <Joystick 
                size={100} 
                stickSize={40} 
                baseColor="transparent" 
                stickColor="rgba(255, 78, 0, 0.8)" 
                move={handleJoystickMove} 
                stop={handleJoystickStop} 
              />
              <span className="absolute -top-6 text-[10px] font-mono text-[var(--color-text-main)] uppercase tracking-widest pointer-events-none">Drive</span>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
