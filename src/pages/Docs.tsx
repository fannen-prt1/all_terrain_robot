import React from 'react';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { FileText, AlertTriangle, Book, Download } from 'lucide-react';

export default function Docs() {
  const { selectedPart } = useOutletContext<{ selectedPart: string | null }>();

  const docData: Record<string, any> = {
    'system': {
      title: 'Assembly & Setup Guide',
      content: (
        <div className="space-y-6">
          <h4 className="text-white text-lg border-b border-white/10 pb-2">1. The Differential Drive Setup</h4>
          <p>
            An all-terrain robot requires high clearance and immense torque. This specific build leverages a "Skid-Steer" method. 
            There are no steering servos; instead, turning is accomplished by rotating the left wheels forward while the right wheels run in reverse.
          </p>
          <h4 className="text-white text-lg border-b border-white/10 pb-2 pt-4">2. The Power Ecosystem</h4>
          <p>
            The two BTS7960 dual H-Bridge motor drivers pull raw 11-12V power directly from the Lithium Polymer battery. 
            DO NOT plug the Lipo directly into the ESP32. Instead, tap a 5V buck converter off the battery lines, tune it to exactly 5.00V using a multimeter, and feed that into the ESP32 VIN pin.
          </p>
          <h4 className="text-white text-lg border-b border-white/10 pb-2 pt-4">3. Troubleshooting the Build</h4>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-zinc-400">
             <li><strong className="text-white">Robot drifts slightly forward/left:</strong> DC motors are rarely 100% matched in speed. You may need to offset the PWM values in code.</li>
             <li><strong className="text-white">Motors jitter but won't turn:</strong> Ensure the driver grounds and ESP32 ground are electrically connected.</li>
             <li><strong className="text-white">ESP32 resets under heavy load:</strong> Voltage sag. The buck converter might be browning out. Check lipo voltage or add a capacitor across 5V/GND.</li>
          </ul>
        </div>
      )
    },
    'Microcontroller': {
      title: 'PS4 Controller Pairing',
      content: (
        <div className="space-y-6">
          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded text-orange-200">
            <AlertTriangle className="w-5 h-5 mb-2 text-orange-500" />
            The MAC address ("30:d5:3e:17:be:e6") in the code MUST match your specific ESP32.
          </div>
          <h4 className="text-white text-lg border-b border-white/10 pb-2">How to Pair your Controller</h4>
          <ul className="list-decimal pl-5 space-y-3 mt-2 text-zinc-400">
             <li>Download the <strong className="text-white px-1">SixaxisPairTool</strong> on Windows.</li>
             <li>Plug your PS4 controller into the PC via USB.</li>
             <li>The tool will show your controller's current paired Master MAC address.</li>
             <li>Change it to the ESP32 MAC address used in your firmware (e.g., <code className="bg-black text-orange-400 mx-1 px-1 rounded">30:d5:3e:17:be:e6</code>).</li>
             <li>Unplug the controller. Press the PS button. It will now connect instantly to the robot!</li>
          </ul>
        </div>
      )
    },
    'MOTOR': {
      title: 'BTS7960 Configuration',
      content: (
        <div className="space-y-6">
          <p>
             The BTS7960 is an incredibly robust 43A motor driver. It requires 4 logic pins to function correctly, though we can optimize this.
          </p>
          <h4 className="text-white text-lg border-b border-white/10 pb-2 mt-4">Logic Truth Table (Per Motor)</h4>
          <table className="w-full text-left border-collapse mt-4">
             <thead>
               <tr className="border-b border-zinc-700 text-zinc-200">
                 <th className="py-2">State</th>
                 <th className="py-2">RPWM</th>
                 <th className="py-2">LPWM</th>
               </tr>
             </thead>
             <tbody>
               <tr className="border-b border-zinc-800">
                 <td className="py-2">Forward</td>
                 <td className="py-2 text-green-500 font-mono">PWM (0-255)</td>
                 <td className="py-2 font-mono">0</td>
               </tr>
               <tr className="border-b border-zinc-800">
                 <td className="py-2">Reverse</td>
                 <td className="py-2 font-mono">0</td>
                 <td className="py-2 text-green-500 font-mono">PWM (0-255)</td>
               </tr>
               <tr>
                 <td className="py-2">Brake/Stop</td>
                 <td className="py-2 font-mono">0</td>
                 <td className="py-2 font-mono">0</td>
               </tr>
             </tbody>
          </table>
          <p className="mt-4 italic">
            Note: L_EN and R_EN pins must be pulled HIGH (5V) at all times, otherwise the driver sleeps.
          </p>
        </div>
      )
    },
    'LIPO Battery': {
      title: 'LiPo Hazard & Operation Protocol',
      content: (
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded text-red-200">
            <AlertTriangle className="w-5 h-5 mb-2 text-red-500" />
            <b>FIRE HAZARD:</b> Lithium Polymer batteries can ignite if punctured, overcharged, or severely over-discharged.
          </div>
          <h4 className="text-white text-lg border-b border-white/10 pb-2">Voltage Basics</h4>
          <p>
            Assuming a 3S (3 Cell) LiPo battery:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-zinc-400">
             <li><strong className="text-white">Fully Charged:</strong> 12.6V (4.2V per cell)</li>
             <li><strong className="text-white">Nominal:</strong> 11.1V (3.7V per cell)</li>
             <li><strong className="text-white">Absolutely Dead:</strong> 9.6V (3.2V per cell)</li>
          </ul>
          <p className="mt-4">
             <b>Do not</b> run the robot below 9.6V under any circumstances. Since this build does not currently have automatic voltage telemetry, attach a cheap Lipo buzzer alarm to the balance lead during operation.
          </p>
        </div>
      )
    },
    'Wheels': {
      title: 'Traction and Current Spikes',
      content: (
        <div className="space-y-6">
          <p>
             The choice of wheel drastically alters the robot's performance and the electrical strain on the system.
          </p>
          <h4 className="text-white text-lg border-b border-white/10 pb-2">The "Carpet Problem"</h4>
          <p>
             Because this robot uses skid-steering, turning requires sliding the wheels laterally across the ground. High-friction rubber tires on a high-friction surface (like carpet) will cause extreme resistance. 
          </p>
          <p className="mt-2 text-orange-300">
             This resistance translates into an immediate amperage spike required by the motors. If you stall the motors (stall current), you could theoretically pull over 20+ amps, which is why cheap motor drivers instantly burn out. The BTS7960 can handle it, but your battery wiring might heat up!
          </p>
        </div>
      )
    },
    'Chassis': {
      title: 'Mechanical Assembly',
      content: (
        <div className="space-y-6">
          <p>
            The dual-deck chassis design keeps heavy components low and electronics isolated up top.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2 text-zinc-400">
             <li><strong className="text-white">Spacers & Standoffs:</strong> Use nylon or brass standoffs for the ESP32 and motor drivers. A metal screw touching a PCB trace will cause a dead short.</li>
             <li><strong className="text-white">Vibration Loosening:</strong> DC motors vibrate heavily. Use <b>Loctite Blue (Threadlocker)</b> on all metal-to-metal motor mount screws to prevent the robot from rattling itself apart over time.</li>
             <li><strong className="text-white">Wire Strain:</strong> Do not pull motor wires completely tight. Leave a "strain relief" loop so sudden impacts don't rip the copper out of the solder joints.</li>
          </ul>
        </div>
      )
    }
  };

  const currentData = selectedPart && docData[selectedPart] 
    ? docData[selectedPart] 
    : docData['system'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 text-orange-500">
          <Book className="w-6 h-6" />
          <h3 className="font-display text-2xl uppercase tracking-widest font-bold">
              {currentData.title}
          </h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-white/10 text-xs text-zinc-400 uppercase tracking-widest hover:text-white hover:border-orange-500 transition-colors">
           <Download className="w-3 h-3" />
           Download PDF
        </button>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-zinc-400 leading-relaxed font-sans">
        {currentData.content}
      </div>
      
    </motion.div>
  );
}