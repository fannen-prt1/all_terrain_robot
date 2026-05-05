#include <PS4Controller.h>

// --- Moteurs BTS7960 ---
// Moteur Droit
#define RPWM_R 18
#define LPWM_R 15

// Moteur Gauche
#define RPWM_L 19
#define LPWM_L 21

int v = 0;              // vitesse dynamique (0–255)
int maxSpeed = 255;     // vitesse max
int dpadSpeed = 80;    // vitesse utilisée avec le D-pad

// --- Mouvements simples ---
void gauche(){ 
  analogWrite(RPWM_R, v); analogWrite(LPWM_R, 0);
  analogWrite(RPWM_L, v); analogWrite(LPWM_L, 0);
}
void droite(){
  analogWrite(RPWM_R, 0); analogWrite(LPWM_R, v);
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, v);
}
void arriere(){ 
  analogWrite(RPWM_R, v); analogWrite(LPWM_R, 0);
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, v);
}
void avant(){ 
  analogWrite(RPWM_R, 0); analogWrite(LPWM_R, v);
  analogWrite(RPWM_L, v); analogWrite(LPWM_L, 0);
}
void stope(){ 
  analogWrite(RPWM_R, 0); analogWrite(LPWM_R, 0);
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, 0);
}

// --- Mouvements combinés ---
void avantGauche(){
  analogWrite(RPWM_R, v); analogWrite(LPWM_R, 0);
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, v / 2);
}
void avantDroite(){
  analogWrite(RPWM_R, v / 2); analogWrite(LPWM_R, 0); 
  analogWrite(RPWM_L, 0); analogWrite(LPWM_L, v);
}
void arriereGauche(){
  analogWrite(RPWM_R, 0); analogWrite(LPWM_R, v);
  analogWrite(RPWM_L, v / 2); analogWrite(LPWM_L, 0);
}
void arriereDroite(){
  analogWrite(RPWM_R, 0); analogWrite(LPWM_R, v / 2);
  analogWrite(RPWM_L, v); analogWrite(LPWM_L, 0);
}

void setup() {
  Serial.begin(115200);

  pinMode(RPWM_R, OUTPUT); 
  pinMode(LPWM_R, OUTPUT);
  pinMode(RPWM_L, OUTPUT); 
  pinMode(LPWM_L, OUTPUT);

  PS4.begin("30:d5:3e:17:be:e6");
  Serial.println("Ready.");
}

void loop() {
  int ly = PS4.data.analog.stick.ly;       // joystick vertical
  int rx = -PS4.data.analog.stick.rx;      // joystick horizontal (inversé)

  // Dead zone
  if (abs(ly) < 10) ly = 0;
  if (abs(rx) < 10) rx = 0;

  bool up    = PS4.data.button.down;
  bool down  = PS4.data.button.up;
  bool left  = PS4.data.button.right;
  bool right = PS4.data.button.left;

  // 🔥 Calcul vitesse analogique
  int intensity = max(abs(ly), abs(rx));
  v = map(intensity, 0, 127, 0, maxSpeed);
  v = constrain(v, 0, maxSpeed);

  // 🔹 Si D-pad utilisé → vitesse fixe
  if (up || down || left || right) {
    v = dpadSpeed;
  }

  // --- Cas combinés ---
  if ((ly < -20 && rx < -20) || (up && left)) avantGauche();
  else if ((ly < -20 && rx > 20) || (up && right)) avantDroite();
  else if ((ly > 20 && rx < -20) || (down && left)) arriereGauche();
  else if ((ly > 20 && rx > 20) || (down && right)) arriereDroite();

  // --- Cas simples ---
  else if (ly < -20 || up) avant();
  else if (ly > 20 || down) arriere();
  else if (rx < -20 || left) gauche();
  else if (rx > 20 || right) droite();
  else stope();

  // --- LIMITES DE VITESSE ---
  if (PS4.data.button.triangle) maxSpeed = 255;
  if (PS4.data.button.r1)       maxSpeed = 200;
  if (PS4.data.button.cross)    maxSpeed = 120;
  if (PS4.data.button.l1)       maxSpeed = 80;

  delay(20);
}
