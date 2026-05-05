import React from 'react';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { CodeXml, Terminal } from 'lucide-react';

export default function Code() {
  const { selectedPart } = useOutletContext<{ selectedPart: string | null }>();

  const codeData: Record<string, any> = {
    'system': {
      title: 'Main Super-Loop & Headers',
      code: `
#include <PS4Controller.h>

// MOTOR DRIVERS (BTS7960)
#define RPWM_R 18
#define LPWM_R 15
#define RPWM_L 19
#define LPWM_L 21

int v = 0;              // Dynamic Speed
int maxSpeed = 255;     // Speed Limit

void setup() {
  Serial.begin(115200);
  pinMode(RPWM_R, OUTPUT); pinMode(LPWM_R, OUTPUT);
  pinMode(RPWM_L, OUTPUT); pinMode(LPWM_L, OUTPUT);

  // Initialize Bluetooth Listener
  PS4.begin("30:d5:3e:17:be:e6");
  Serial.println("Ready.");
}

void loop() {
  // Polled at 50Hz (delay(20))
  // Add steering logic here
}
      `.trim()
    },
    'MOTOR': {
      title: 'PWM Directional Control Functions',
      code: `
// Right Motor (Droit)
void droite(){
  analogWrite(RPWM_R, 0); analogWrite(LPWM_R, v);
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, v);
}

// Left Motor (Gauche)
void gauche(){ 
  analogWrite(RPWM_R, v); analogWrite(LPWM_R, 0);
  analogWrite(RPWM_L, v); analogWrite(LPWM_L, 0);
}

// Full Stop (Stope)
void stope(){ 
  analogWrite(RPWM_R, 0); analogWrite(LPWM_R, 0);
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, 0);
}
      `.trim()
    },
    'Microcontroller': {
      title: 'PS4 Bluetooth & Analog Mapping',
      code: `
// ESP32 reading PS4 Bluetooth Controller
int ly = PS4.data.analog.stick.ly;       // left joystick Y
int rx = -PS4.data.analog.stick.rx;      // right joystick X (inverted)

// Deadzone to prevent drift
if (abs(ly) < 10) ly = 0;
if (abs(rx) < 10) rx = 0;

// Dynamic Analog Speed Mapping
int intensity = max(abs(ly), abs(rx));
v = map(intensity, 0, 127, 0, maxSpeed);
v = constrain(v, 0, maxSpeed); // Ensures 0-255 bound
      `.trim()
    },
    'LIPO Battery': {
      title: 'Voltage Telemetry (Optional Theory)',
      code: `
// The current code uses a Buck Converter. 
// If you want Lipo Telemetry, use a voltage divider!
#define LIPO_PIN 34
void readBattery() {
  // Lipo max 12.6V -> Voltage Divider (e.g. 10k & 3.3k) -> ESP32 Max 3.3V
  int raw = analogRead(LIPO_PIN);
  float voltage = (raw / 4095.0) * 3.3 * (13.3 / 3.3);
  
  if(voltage < 9.6) {
    stope(); 
    Serial.println("LIPO CRITICAL LOW");
  }
}
      `.trim()
    },
    'Wheels': {
      title: 'Differential Drive Mixing (Tank Steering)',
      code: `
// Forward Left (avantGauche)
// Right motor runs full speed, left motor runs 50%
void avantGauche(){
  analogWrite(RPWM_R, v); analogWrite(LPWM_R, 0);
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, v / 2);
}

// Forward Right (avantDroite)
// Left motor runs full speed, right motor runs 50%
void avantDroite(){
  analogWrite(RPWM_R, v / 2); analogWrite(LPWM_R, 0); 
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, v);
}
      `.trim()
    },
    'Chassis': {
      title: 'Speed Clamping limits',
      code: `
// --- SPEED LIMITERS ---
// Triangle = Full Speed
if (PS4.data.button.triangle) maxSpeed = 255;
// R1 = Medium High
if (PS4.data.button.r1)       maxSpeed = 200;
// Cross = Medium Low
if (PS4.data.button.cross)    maxSpeed = 120;
// L1 = Turtle Mode
if (PS4.data.button.l1)       maxSpeed = 80;
      `.trim()
    }
  };

  const currentData = selectedPart && codeData[selectedPart] 
    ? codeData[selectedPart] 
    : codeData['system'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 text-orange-500 mb-6">
        <CodeXml className="w-6 h-6" />
        <h3 className="font-display text-2xl uppercase tracking-widest font-bold">
           {currentData.title}
        </h3>
      </div>

      <div className="bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="bg-zinc-900 border-b border-white/5 p-3 flex items-center gap-4">
           <Terminal className="text-zinc-500 w-4 h-4"/>
           <span className="font-mono text-zinc-500 text-xs">final-esp32-ps4.ino</span>
        </div>
        <pre className="p-6 text-[#ffaa00] text-sm font-mono overflow-x-auto leading-relaxed">
          <code>{currentData.code}</code>
        </pre>
      </div>
      
    </motion.div>
  );
}