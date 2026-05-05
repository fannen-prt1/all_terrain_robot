import React from 'react';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { Zap, Cable } from 'lucide-react';

export default function Wiring() {
  const { selectedPart } = useOutletContext<{ selectedPart: string | null }>();

  const wiringData: Record<string, any> = {
    'system': {
      title: 'Global Wiring Schematic',
      steps: [
        '1. Lipo Battery B+ / B- connects thick gauge wire directly to Motor Drivers (B+ / B-).',
        '2. Lipo Battery paths through a 5V Step-Down (Buck Converter) to the ESP32 (Vin/GND).',
        '3. ESP32 Pin 18 (RPWM_R) & Pin 15 (LPWM_R) to Right BTS7960.',
        '4. ESP32 Pin 19 (RPWM_L) & Pin 21 (LPWM_L) to Left BTS7960.',
        '5. Dual DC Motors on Left hook to Left Driver (M+/M-).',
        '6. Dual DC Motors on Right hook to Right Driver (M+/M-).'
      ]
    },
    'MOTOR': {
      title: 'Motors & Drivers (BTS7960)',
      steps: [
        '[ BTS7960 Right Side ] RPWM -> ESP32 GPIO 18',
        '[ BTS7960 Right Side ] LPWM -> ESP32 GPIO 15',
        '[ BTS7960 Left Side ]  RPWM -> ESP32 GPIO 19',
        '[ BTS7960 Left Side ]  LPWM -> ESP32 GPIO 21',
        '[ BTS7960 Both ] VCC  -> 5V Rail',
        '[ BTS7960 Both ] L_EN -> 5V Rail (Always Enabled)',
        '[ BTS7960 Both ] R_EN -> 5V Rail (Always Enabled)'
      ]
    },
    'Microcontroller': {
      title: 'ESP32 Control Logic Pins',
      steps: [
        'VIN -> Receives 5V from Buck Converter DO NOT exceed 5V.',
        'GND -> Common Ground (tie to Drivers and Buck).',
        'GPIO 18 -> Right Motor Forward PWM',
        'GPIO 15 -> Right Motor Reverse PWM',
        'GPIO 19 -> Left Motor Forward PWM',
        'GPIO 21 -> Left Motor Reverse PWM'
      ]
    },
    'LIPO Battery': {
      title: 'High Current Power Distribution',
      steps: [
        'XT60 Connector -> Parallel Splitter',
        'Splitter Out 1 -> Buck Converter In (Sets 11.1V down to 5V)',
        'Splitter Out 2 -> BTS7960 Right B+ / B-',
        'Splitter Out 3 -> BTS7960 Left B+ / B-'
      ]
    },
    'Wheels': {
      title: 'Motor Output Terminals',
      steps: [
        'Right Front Motor + Right Rear Motor wired in Parallel -> Right BTS7960 M+ / M-',
        'Left Front Motor + Left Rear Motor wired in Parallel -> Left BTS7960 M+ / M-'
      ]
    },
    'Chassis': {
      title: 'Ground Loop & Shielding',
      steps: [
        'Run all logical GND cables to a single starred ground point to prevent ground loops.',
        'Ensure the thick Lipo wires do not pinch against the chassis edges.'
      ]
    }
  };

  const currentData = selectedPart && wiringData[selectedPart] 
    ? wiringData[selectedPart] 
    : wiringData['system'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 text-orange-500 mb-6">
        <Zap className="w-6 h-6 animate-pulse" />
        <h3 className="font-display text-2xl uppercase tracking-widest font-bold">
          {currentData.title}
        </h3>
      </div>
      
      <div className="bg-black/50 p-6 border border-white/10 rounded-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2 text-zinc-500 tech-label-sm">
           <Cable className="w-4 h-4" />
           <span>Routing Protocol</span>
        </div>
        <ul className="space-y-4 font-mono text-sm text-zinc-300">
           {currentData.steps.map((step: string, id: number) => (
             <li key={id} className="flex gap-4">
                <span className="text-orange-500 font-bold flex-shrink-0">Step {id + 1} //</span>
                <span>{step}</span>
             </li>
           ))}
        </ul>
      </div>

      <div className="mt-8 bg-orange-900/10 border border-orange-500/20 p-4 rounded-md">
         <p className="text-orange-400 text-sm font-bold mb-2">CRITICAL WIRING RULE:</p>
         <p className="text-orange-200/70 text-xs">
           Always connect the Ground (GND) of the ESP32, the Buck Converter, and the Motor Drivers together. If the grounds are not shared, the PWM signals will float and the robot will behave erratically.
         </p>
      </div>

    </motion.div>
  );
}