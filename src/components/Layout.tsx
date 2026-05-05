import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Loader } from '@react-three/drei';

const HOTSPOTS = [
  { name: 'MOTOR', position: [3.37, -1.26, -0.41] },
  { name: 'Wheels', position: [4.47, -3.63, -1.65] },
  { name: 'LIPO Battery', position: [0.02, -1.53, -0.56] },
  { name: 'Chassis', position: [1.41, -0.07, 1.01] },
  { name: 'Microcontroller', position: [-1.31, 1.89, 1.01] },
  { name: 'Motors Drivers', position: [-1.55, -2.06, 0.01] },
];

function RobotModel({ onPartClick }: { onPartClick: (s: string) => void }) {
  const { scene } = useGLTF('/Assemblage2.glb');

  return (
    <group>
      <primitive
        object={scene}
        scale={0.035}
        position={[0, 0, 0]}
        onClick={(e: any) => {
          e.stopPropagation();
          const x = e.point.x.toFixed(2);
          const y = e.point.y.toFixed(2);
          const z = e.point.z.toFixed(2);
          onPartClick(`Coordinate: [${x}, ${y}, ${z}]`);
        }}
        onPointerOver={() => { document.body.style.cursor = 'crosshair'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      />

      {HOTSPOTS.map((spot, i) => (
        <Html key={i} position={spot.position as [number, number, number]} center>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPartClick(spot.name);
            }}
            className="w-4 h-4 bg-orange-500 rounded-full cursor-pointer border-2 border-white shadow-lg hover:scale-125 transition-transform"
          >
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
              {spot.name}
            </div>
          </div>
        </Html>
      ))}
    </group>
  );
}

export const Layout = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0c0c0c] selection:bg-orange-500 selection:text-white flex flex-col">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-[280px] mt-16 min-h-[calc(100vh-64px)] relative overflow-x-hidden p-8 mb-20 carbon-texture scanline-effect">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="hero-backdrop" />
          <div className="grid-sheen" />
          <div className="glow-orb glow-orb--orange" />
          <div className="glow-orb glow-orb--red" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[600px]">
            <div className="lg:col-span-12 xl:col-span-4 glass-panel carbon-texture scanline-effect border border-white/10 relative flex flex-col justify-between overflow-hidden shadow-2xl min-h-[400px]">
              <div className="absolute top-6 left-6 z-10">
                <p className="font-display text-orange-500 text-sm font-light tracking-widest uppercase">RX-F1 Visual</p>
              </div>
              
              <div className="absolute inset-0 z-0 pt-4 pb-16">
                <Canvas dpr={[1, 2]} camera={{ position: [0, 4, 15], fov: 50 }}>
                  <color attach="background" args={['#111111']} />
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[10, 10, 5]} intensity={2} />
                  <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                  <hemisphereLight args={['#ffffff', '#444444', 1]} />
                  
                  <Suspense fallback={null}>
                    <RobotModel onPartClick={setSelectedPart} />
                  </Suspense>
                  <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
                </Canvas>
                <Loader />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
                <div className="bg-black/80 px-4 py-2 border border-white/5 w-full rounded">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Selected</span>
                  <p className="font-display text-orange-500 text-sm font-light truncate">
                    {selectedPart || 'AWAITING INPUT...'}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-12 xl:col-span-8 flex flex-col bg-[#050505]/80 glass-panel scanline-effect relative p-10 border border-white/10 shadow-inner overflow-auto h-full">
                <Outlet context={{ selectedPart }} />
            </div>

        </div>

      </main>
      
      <footer className="fixed bottom-0 left-0 w-full bg-[#050505] z-50 flex flex-col md:flex-row justify-between items-center px-8 border-t border-white/5 py-4 lg:pl-[300px]">
        <p className="font-display text-[10px] tracking-widest uppercase text-gray-600">
          (c) 2024 ROBOT-X SYSTEM.
        </p>
      </footer>
    </div>
  );
};

