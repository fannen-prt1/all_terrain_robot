import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, BadgeDollarSign, ChevronLeft, ChevronRight, Shield, Zap } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import { DoubleSide } from 'three';

function ComboModel({
  modelPath,
  scale = 0.75,
  position = [0, -0.4, 0],
  rotation = [0, 0, 0]
}: {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    scene.traverse((child: any) => {
      if (!child.isMesh) return;
      child.frustumCulled = false;
      if (Array.isArray(child.material)) {
        child.material.forEach((material: any) => {
          material.side = DoubleSide;
          material.needsUpdate = true;
        });
      } else if (child.material) {
        child.material.side = DoubleSide;
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} scale={scale} position={position} rotation={rotation} />
    </Center>
  );
}

function ModelSlot({
  modelPath,
  title,
  scale,
  position,
  rotation
}: {
  modelPath: string;
  title: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');
  const orbitTarget = [0, 0, 0] as [number, number, number];
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    let active = true;
    setStatus('loading');

    fetch(modelPath, { method: 'GET' })
      .then((response) => {
        if (!active) return;
        const contentType = response.headers.get('content-type') ?? '';
        const isHtml = contentType.includes('text/html');
        setStatus(response.ok && !isHtml ? 'ready' : 'missing');
      })
      .catch(() => {
        if (!active) return;
        setStatus('missing');
      });

    return () => {
      active = false;
    };
  }, [modelPath]);

  useEffect(() => {
    if (status !== 'ready' || !controlsRef.current) return;
    controlsRef.current.target.set(orbitTarget[0], orbitTarget[1], orbitTarget[2]);
    controlsRef.current.update();
  }, [orbitTarget, status]);

  if (status !== 'ready') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6 text-zinc-400">
        <p className="text-xs uppercase tracking-widest text-zinc-500">Model Preview</p>
        <p className="text-sm mt-2">
          {status === 'loading' ? 'Loading model...' : `Missing model for ${title}.`}
        </p>
        <p className="text-[10px] mt-3 text-zinc-600">
          Place the file at <span className="text-zinc-400">{modelPath}</span>
        </p>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0.6, 2.4], fov: 42 }}>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 3, 2]} intensity={1.4} />
      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        }
      >
        <ComboModel
          modelPath={modelPath}
          scale={scale}
          position={position}
          rotation={rotation}
        />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
      />
    </Canvas>
  );
}

export default function Overview() {
  const { selectedPart } = useOutletContext<{ selectedPart: string | null }>();
  const [comboIndex, setComboIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Full BOM and Specs Database
  const database: Record<string, any> = {
    'system': {
      title: 'ALL-TERRAIN ROBOT SYSTEM',
      tagline: 'Bluetooth PS4-Controlled Differential Drive',
      description: 'A heavy-duty skid-steer robotic platform controlled via a PlayStation 4 controller over Bluetooth. Designed for rugged terrain using high-current motor drivers and high-torque motors.',
      specs: [
        { label: 'Control Protocol', value: 'Bluetooth (ESP32 PS4Controller)' },
        { label: 'Drive System', value: 'High-Current Differential / Skid-Steer' },
        { label: 'Max PWM Frequency', value: '80 kHz (Hardware Limit)' },
        { label: 'Kinematics', value: 'Tank Drive (Left/Right Tracks)' },
      ]
    },
    'Microcontroller': {
      title: 'ESP32 CORE BOARD',
      tagline: 'The Brain of the Operation',
      description: 'The ESP32 processes PlayStation 4 inputs via Bluetooth and generates precise PWM (Pulse Width Modulation) signals to control the motor drivers.',
      specs: [
        { label: 'Processor', value: 'Tensilica Xtensa Dual-Core 32-bit @ 240MHz' },
        { label: 'Wireless', value: 'Wi-Fi: 802.11 b/g/n, Bluetooth: v4.2 BR/EDR & BLE' },
        { label: 'Logic Voltage', value: '3.3V (5V tolerant on some pins)' },
        { label: 'Role in Robot', value: 'PS4 MAC Parsing, Differential Math, PWM Generation' },
      ]
    },
    'MOTOR': {
      title: 'HIGH-TORQUE DRIVE SYSTEM',
      tagline: 'BTS7960 Dual H-Bridge & DC Motors',
      description: 'Instead of standard small drivers, this robot uses BTS7960 high-current 43A motor drivers to handle powerful terrain-crushing DC motors without overheating.',
      specs: [
        { label: 'Motor Driver', value: 'BTS7960 (43 Amp H-Bridge)' },
        { label: 'Left Channel Pins', value: 'RPWM: 19, LPWM: 21' },
        { label: 'Right Channel Pins', value: 'RPWM: 18, LPWM: 15' },
        { label: 'Speed Control', value: '0-255 PWM Mapping (4 Gears via PS4 buttons)' },
      ]
    },
    'LIPO Battery': {
      title: 'LITHIUM POLYMER SUPPLY',
      tagline: 'Raw Power (Exercise Caution)',
      description: 'Provides massive uninterrupted discharge current for the BTS7960 drivers and motors. Steps down to 5V via a Buck Converter to safely power the ESP32.',
      specs: [
        { label: 'Chemistry', value: 'High-Discharge Lipo (Likely 3S 11.1V)' },
        { label: 'Power Routing', value: 'Direct to BTS7960 (B+ / B-)' },
        { label: 'Logic Routing', value: 'Buck Converter to ESP32 (Vin/5V)' },
        { label: 'Warning', value: 'Never short circuit or over-discharge below 3.2V/cell' },
      ]
    },
    'Wheels': {
      title: 'ALL-TERRAIN TREADS',
      tagline: 'Skid-Steer Traction Mechanics',
      description: 'Because this relies on differential drive ("tank steering"), the wheels must slip slightly when turning on the spot. High grip tires are excellent for dirt but require more torque to turn on carpet.',
      specs: [
        { label: 'Configuration', value: '4-Wheel Drive or Tracked' },
        { label: 'Steering Method', value: 'Opposing Thrust (Left forward, Right reverse)' },
      ]
    },
    'Motors Drivers': {
      title: 'MOTOR DRIVER MODULES',
      tagline: 'High-Current H-Bridge Interface',
      description: 'Dual BTS7960 driver boards translate low-power PWM signals into high-current motor power. They protect the ESP32 from load spikes and allow fast direction changes for skid-steer control.',
      specs: [
        { label: 'Driver Type', value: 'BTS7960 Dual H-Bridge (43A peak)' },
        { label: 'Logic Input', value: 'PWM + Direction (RPWM/LPWM)' },
        { label: 'Power Path', value: 'Direct battery feed to motor terminals' },
        { label: 'Enable Pins', value: 'L_EN and R_EN held HIGH' },
      ]
    },
    'Chassis': {
      title: 'STRUCTURAL FRAME',
      tagline: 'The Skeleton',
      description: 'Holds the heavy motors, battery, and electronics. Proper weight distribution prevents the robot from tipping on inclines and ensures even tire grip.',
      specs: [
        { label: 'Material', value: 'Durable SolidWorks Constructed Assembly' },
        { label: 'Design Goal', value: 'Low Center of Gravity' },
      ]
    }
  };

  const combinationData: Record<string, Array<{
    tier: 'Bad' | 'Normal' | 'Ultimate';
    title: string;
    description: string;
    protocols: string[];
    price: string;
    model: string;
    modelScale?: number;
    modelPosition?: [number, number, number];
    modelRotation?: [number, number, number];
    bestFor: string;
    watchOut: string;
  }>> = {
    'Microcontroller': [
      {
        tier: 'Bad',
        title: 'Arduino Uno R3',
        description: 'Entry-level MCU. Great for learning, but no native wireless and limited performance.',
        protocols: ['USB', 'UART', 'I2C', 'SPI', 'PWM'],
        price: '$8-$20',
        model: '/models/ImageToStl.com_Arduino+Uno+R3_pin.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        bestFor: 'Quick prototypes, beginner builds.',
        watchOut: 'Needs external Bluetooth; limited RAM.'
      },
      {
        tier: 'Normal',
        title: 'ESP32 DevKit',
        description: 'Strong all-round MCU with native Bluetooth and Wi-Fi for responsive control.',
        protocols: ['Bluetooth', 'Wi-Fi', 'UART', 'I2C', 'SPI', 'PWM'],
        price: '$5-$15',
        model: '/models/ImageToStl.com_PCB_ESP32-38Pines.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        bestFor: 'Wireless control, fast PWM loops.',
        watchOut: '3.3V logic only; use level shifting if needed.'
      },
      {
        tier: 'Ultimate',
        title: 'Raspberry Pi 5',
        description: 'Linux SBC for autonomy, vision, and logging. Pair with a MCU for real-time PWM.',
        protocols: ['Bluetooth', 'Wi-Fi', 'USB', 'Ethernet', 'UART', 'I2C', 'SPI'],
        price: '$50-$80',
        model: '/models/ImageToStl.com_raspberry_pi_5.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        bestFor: 'Autonomy, vision, advanced telemetry.',
        watchOut: 'Needs a co-processor for real-time motor control.'
      }
    ],
    'MOTOR': [
      {
        tier: 'Bad',
        title: 'Standard DC 550 + L298N',
        description: 'Basic brushed motor + budget driver. Works for light loads only.',
        protocols: ['PWM', 'Direction'],
        price: '$12-$35',
        model: '/models/DC%20Geared%20Motor.glb',
        modelScale: 0.015,
        modelPosition: [0,-0.2, 0.3],
        bestFor: 'Lightweight builds, short runs.',
        watchOut: 'Overheats easily; limited torque.'
      },
      {
        tier: 'Normal',
        title: 'BTS7960 + Brushed DC',
        description: 'High-current driver with solid brushed motor torque for rough terrain.',
        protocols: ['PWM', 'Direction'],
        price: '$25-$70',
        model: '/models/Motor%2012v%20dc.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        modelRotation: [0, 1.57, 0],
        bestFor: 'Off-road torque and reliability.',
        watchOut: 'Needs thick wiring and good cooling.'
      },
      {
        tier: 'Ultimate',
        title: 'FOC BLDC + Smart ESC',
        description: 'Efficient BLDC drive with smooth torque and telemetry.',
        protocols: ['CAN', 'UART', 'PWM'],
        price: '$120-$300',
        model: '/models/JGB37-555.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        bestFor: 'High efficiency, quiet operation.',
        watchOut: 'Requires tuning and sensor setup.'
      }
    ],
    'LIPO Battery': [
      {
        tier: 'Bad',
        title: '9V Alkaline Block',
        description: 'Low current capacity and fast voltage sag under load.',
        protocols: ['Snap Connector'],
        price: '$3-$8',
        model: '/models/Batterie%209V.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        bestFor: 'Testing LEDs or very light loads.',
        watchOut: 'Not suitable for motors.'
      },
      {
        tier: 'Normal',
        title: '3S 11.1V LiPo (5000mAh)',
        description: 'Balanced capacity and discharge for most mid-size robots.',
        protocols: ['XT60', 'Balance Lead'],
        price: '$25-$45',
        model: '/models/3s%20Turnigy%20Li-Po%20battery.glb',
        modelScale: 0.01,
        modelPosition: [0, 0.6, 0],
        bestFor: 'Reliable runtime and torque.',
        watchOut: 'Requires proper LiPo charging and storage.'
      },
      {
        tier: 'Ultimate',
        title: '6S High-C LiPo (33000mAh)',
        description: 'Massive capacity and discharge for heavy-duty builds.',
        protocols: ['XT60', 'Balance Lead'],
        price: '$140-$260',
        model: '/models/Tattu%206s%2033000%20mah%20lipo%20batary.glb',
        modelScale: 0.01,
        modelPosition: [0, 0.6, 0],
        bestFor: 'Long runtime and high torque demands.',
        watchOut: 'Heavy and requires voltage-ready drivers.'
      }
    ],
    'Wheels': [
      {
        tier: 'Bad',
        title: 'Hard Plastic Wheels',
        description: 'Low grip and poor shock absorption; slips under torque.',
        protocols: ['Standard Hub', 'M3/M4 Adapter'],
        price: '$6-$15',
        model: '/models/Wheel_v2.glb',
        modelScale: 0.02,
        modelPosition: [0.1, 0.06, 0],
        bestFor: 'Indoor smooth floors.',
        watchOut: 'Low traction on dirt or gravel.'
      },
      {
        tier: 'Normal',
        title: 'All-Terrain Rubber Wheel',
        description: 'Balanced grip and rolling resistance for mixed terrain.',
        protocols: ['Standard Hub', 'Hex Adapter'],
        price: '$15-$35',
        model: '/models/Cramped%20Robot%20Wheel.glb',
        modelScale: 0.02,
        modelPosition: [0.1, 0.06, 0],
        bestFor: 'General off-road use.',
        watchOut: 'Needs torque for skid turns.'
      },
      {
        tier: 'Ultimate',
        title: 'Spiked Rubber 120mm',
        description: 'High bite for loose terrain and steep climbs.',
        protocols: ['Standard Hub', 'Hex Adapter'],
        price: '$30-$60',
        model: '/models/Spiked%20Rubber%20Wheel%20120mm.glb',
        modelScale: 0.013,
        modelPosition: [0.1, 0.06, 0],
        bestFor: 'Loose dirt, sand, and climbs.',
        watchOut: 'Higher current draw; more vibration.'
      }
    ],
    'Motors Drivers': [
      {
        tier: 'Bad',
        title: 'L298N Dual H-Bridge',
        description: 'Very common but inefficient; large voltage drop.',
        protocols: ['PWM', 'Direction'],
        price: '$3-$8',
        model: '/models/ImageToStl.com_L298N.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        bestFor: 'Small motors only.',
        watchOut: 'Runs hot and wastes power.'
      },
      {
        tier: 'Normal',
        title: 'BTS7960 Dual Driver',
        description: 'High-current H-bridge for rugged brushed motors.',
        protocols: ['PWM', 'Direction'],
        price: '$10-$25',
        model: '/models/bts.glb',
        modelScale: 0.02,
        modelPosition: [0, 0, 0],
        bestFor: 'High torque DC motors.',
        watchOut: 'Bulky and needs airflow.'
      },
      {
        tier: 'Ultimate',
        title: 'Dual VESC 6',
        description: 'Smart ESC with telemetry and smooth FOC control.',
        protocols: ['CAN', 'UART', 'PWM'],
        price: '$60-$160',
        model: '/models/fsesc.glb',
        modelScale: 0.01,
        modelPosition: [0, 0, 0],
        bestFor: 'High efficiency and monitoring.',
        watchOut: 'Needs careful configuration.'
      }
    ],
    'Chassis': [
      {
        tier: 'Bad',
        title: 'Acrylic Frame',
        description: 'Low cost but brittle under vibration and impacts.',
        protocols: ['M3 Hardware'],
        price: '$10-$25',
        model: '/models/chassis-acrylic.glb',
        bestFor: 'Indoor prototypes.',
        watchOut: 'Cracks on impacts.'
      },
      {
        tier: 'Normal',
        title: 'Aluminum Plate',
        description: 'Light, rigid, and easy to drill for mounting.',
        protocols: ['M3/M4 Hardware'],
        price: '$25-$60',
        model: '/models/chassis-aluminum.glb',
        bestFor: 'Balanced durability.',
        watchOut: 'Sharp edges need deburring.'
      },
      {
        tier: 'Ultimate',
        title: 'Steel Tubular Frame',
        description: 'Maximum strength and impact resistance.',
        protocols: ['Welding', 'M6 Hardware'],
        price: '$60-$150',
        model: '/models/chassis-steel.glb',
        bestFor: 'Extreme terrain and payloads.',
        watchOut: 'Heavier and harder to machine.'
      }
    ]
  };

  const currentData = selectedPart && database[selectedPart] 
    ? database[selectedPart] 
    : database['system'];

  const currentCombos = useMemo(() => {
    if (!selectedPart) return null;
    return combinationData[selectedPart] ?? null;
  }, [selectedPart]);
  const showComboModel = selectedPart !== 'Chassis';

  useEffect(() => {
    setComboIndex(0);
  }, [selectedPart]);

  const handleNext = () => {
    if (!currentCombos) return;
    setDirection(1);
    setComboIndex((idx) => (idx + 1) % currentCombos.length);
  };

  const handlePrev = () => {
    if (!currentCombos) return;
    setDirection(-1);
    setComboIndex((idx) => (idx - 1 + currentCombos.length) % currentCombos.length);
  };

  const cardVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50,
      y: 10,
      scale: 0.98
    }),
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
      y: -10,
      scale: 0.98
    })
  };

  const tierStyles = (tier: string) => {
    if (tier === 'Bad') return 'border-red-500/30 text-red-300 bg-red-500/10';
    if (tier === 'Normal') return 'border-orange-500/30 text-orange-300 bg-orange-500/10';
    return 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8 relative"
    >
      <div className="flex items-center gap-3 text-orange-500 mb-2">
        <Activity className="w-6 h-6" />
        <h3 className="font-display text-2xl uppercase tracking-widest font-bold">
          {currentData.title}
        </h3>
      </div>
      <p className="text-zinc-400 font-mono text-sm uppercase tracking-wider mb-8 border-l-2 border-orange-500 pl-3">
        // {currentData.tagline}
      </p>

      <div className="glass-panel scanline-effect relative overflow-hidden border border-white/10 p-6 rounded-lg text-zinc-300 leading-relaxed text-sm">
        {currentData.description}
      </div>

      <div className="space-y-4">
        <h4 className="tech-label-sm text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-2">Hardware Specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentData.specs.map((spec: any, idx: number) => (
             <div key={idx} className="bg-black/40 p-4 border border-white/5 rounded-md hover:border-orange-500/30 transition-colors">
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{spec.label}</p>
               <p className="text-sm font-mono text-orange-400">{spec.value}</p>
             </div>
          ))}
        </div>
      </div>

      {currentCombos && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-orange-500">
              <Zap className="w-5 h-5" />
              <h4 className="font-display text-xl uppercase tracking-widest font-bold">Build Combinations</h4>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-orange-500/40 transition-colors"
                aria-label="Previous combination"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-orange-500/40 transition-colors"
                aria-label="Next combination"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {currentCombos.map((combo, idx) => (
              <button
                key={combo.title}
                onClick={() => {
                  setDirection(idx > comboIndex ? 1 : -1);
                  setComboIndex(idx);
                }}
                className={`text-left px-4 py-3 border rounded-md transition-colors ${idx === comboIndex ? 'border-orange-500/60 text-orange-200 bg-orange-500/10' : 'border-white/5 text-zinc-500 hover:text-white hover:border-white/20'}`}
              >
                <p className="text-[10px] uppercase tracking-widest">{combo.tier}</p>
                <p className="text-xs mt-1 font-display uppercase tracking-wider">{combo.title}</p>
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${selectedPart}-${comboIndex}`}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="bg-gradient-to-br from-white/5 via-transparent to-orange-500/5 border border-white/10 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative overflow-hidden scanline-effect"
              >
                <div className="combo-glow pointer-events-none" />
                <div className={`${showComboModel ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${tierStyles(currentCombos[comboIndex].tier)}`}>
                      {currentCombos[comboIndex].tier} Tier
                    </span>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <BadgeDollarSign className="w-4 h-4" />
                      {currentCombos[comboIndex].price}
                    </div>
                  </div>
                  <h5 className="font-display text-xl uppercase tracking-widest text-orange-200">
                    {currentCombos[comboIndex].title}
                  </h5>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {currentCombos[comboIndex].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/40 border border-white/5 rounded-md p-4">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Protocols</p>
                      <div className="flex flex-wrap gap-2">
                        {currentCombos[comboIndex].protocols.map((item) => (
                          <span key={item} className="text-[10px] uppercase tracking-widest px-2 py-1 border border-white/10 text-zinc-400 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-md p-4">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Best For</p>
                      <p className="text-sm text-zinc-300">{currentCombos[comboIndex].bestFor}</p>
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-md p-4">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Watch Out</p>
                      <p className="text-sm text-zinc-300">{currentCombos[comboIndex].watchOut}</p>
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-md p-4 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Recommendation</p>
                        <p className="text-sm text-zinc-300">Pick based on torque + terrain risk.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {showComboModel && (
                  <div className="lg:col-span-5">
                    <div className="h-full rounded-lg border border-white/10 overflow-hidden bg-black/60 min-h-[220px]">
                      <ModelSlot
                        modelPath={currentCombos[comboIndex].model}
                        title={currentCombos[comboIndex].title}
                        scale={currentCombos[comboIndex].modelScale}
                        position={currentCombos[comboIndex].modelPosition}
                        rotation={currentCombos[comboIndex].modelRotation}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {(!selectedPart || selectedPart === 'system') && (
        <div className="mt-8 bg-blue-900/10 border border-blue-500/20 p-4 rounded-md">
          <p className="text-blue-400 text-sm font-bold mb-2">LEARNING GOAL:</p>
          <p className="text-blue-200/70 text-xs">
            Click on any highlighted hotspot on the 3D model to dynamically filter this data. You will learn the exact purpose, wiring, and code required for every component.
          </p>
        </div>
      )}

    </motion.div>
  );
}