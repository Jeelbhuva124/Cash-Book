import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Calculate 3D sphere coordinates from Latitude & Longitude
const getCoordinates = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  
  return new THREE.Vector3(x, y, z);
};

const Globe = ({ focusTrigger, onFocusRequest }) => {
  const earthRef = useRef();
  const controlsRef = useRef();
  
  // Load daytime satellite earth texture
  const colorMap = useLoader(THREE.TextureLoader, "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");

  const targetRotation = useRef(null);

  useEffect(() => {
    if (focusTrigger > 0 && earthRef.current) {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
      
      const currentY = earthRef.current.rotation.y;
      const baseTargetY = -2.949; // Exact angle for India
      const baseTargetX = 0.36;   // Tilt down slightly for India's latitude
      
      // Calculate nearest 2PI multiple so the globe doesn't spin backwards wildly
      const revolutions = Math.round((currentY - baseTargetY) / (Math.PI * 2));
      const targetY = baseTargetY + revolutions * Math.PI * 2;

      targetRotation.current = {
        x: baseTargetX,
        y: targetY,
        z: 0
      };
    }
  }, [focusTrigger]);

  // Auto rotate the earth slowly, or snap to India
  useFrame(() => {
    if (earthRef.current) {
      if (targetRotation.current) {
        // Smoothly lerp towards target
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, targetRotation.current.x, 0.05);
        earthRef.current.rotation.y = THREE.MathUtils.lerp(earthRef.current.rotation.y, targetRotation.current.y, 0.05);
        earthRef.current.rotation.z = THREE.MathUtils.lerp(earthRef.current.rotation.z, targetRotation.current.z, 0.05);
        
        // If close enough, release the target and resume normal auto-rotation
        if (Math.abs(earthRef.current.rotation.y - targetRotation.current.y) < 0.005) {
          targetRotation.current = null;
        }
      } else {
        // Normal slow rotation
        earthRef.current.rotation.y += 0.002;
      }
    }
  });

  const radius = 2;
  const indiaCoords = getCoordinates(20.5937, 78.9629, radius);
  const glowColor = new THREE.Color("hsl(320, 85%, 60%)"); // Matches the accent color from your theme

  return (
    <group ref={earthRef} rotation={[0.36, -2.949, 0]}>
      {/* The Earth */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          roughness={0.7} 
          metalness={0.1}
        />
      </mesh>

      {/* The India Marker (Glowing sphere) */}
      <mesh 
        position={indiaCoords} 
        onClick={(e) => { e.stopPropagation(); onFocusRequest(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      
      {/* The India Marker Ring Glow */}
      <mesh position={indiaCoords}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.4} />
      </mesh>
      
      {/* A larger softer glow around India */}
      <mesh position={indiaCoords}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.15} />
      </mesh>

      {/* Controls to allow manual spinning, reset when India is clicked */}
      <OrbitControls 
        ref={controlsRef}
        enableZoom={false} 
        enablePan={false}
        autoRotate={false} 
      />
    </group>
  );
};

const FallbackGlobe = () => (
  <div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">
    Loading Earth...
  </div>
);

export const EarthSection = () => {
  const [focusTrigger, setFocusTrigger] = useState(0);

  return (
    <section className="relative py-24 overflow-hidden bg-background border-t border-border">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
          
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary font-bold">Track • Manage • Grow</p>
            <h3 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Take control of your finances with the all-new <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">Cash Book</span>.
            </h3>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
              A powerful, multi-platform digital cash book. We secure, sync, and simplify your financial tracking end-to-end.
            </p>
            
            <Link to="/login" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)] hover:scale-105 active:scale-95">
              Start tracking now
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </motion.div>

          {/* Right 3D Earth Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center">
              
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 3, 5]} intensity={2} />
                  <directionalLight position={[-5, -3, -5]} intensity={0.2} color="#4c1d95" />
                  
                  <Suspense fallback={null}>
                    <Globe 
                      focusTrigger={focusTrigger} 
                      onFocusRequest={() => setFocusTrigger(prev => prev + 1)} 
                    />
                  </Suspense>
                </Canvas>
              </div>
              
              {/* Clickable Marker Label */}
              <button 
                onClick={() => setFocusTrigger(prev => prev + 1)}
                className="absolute -bottom-4 right-10 bg-card border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all cursor-pointer z-10 active:scale-95"
              >
                <MapPin className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-bold text-foreground">India</span>
              </button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
