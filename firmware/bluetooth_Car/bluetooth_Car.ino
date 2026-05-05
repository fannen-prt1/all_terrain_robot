// ------------------- Motor Pins -------------------
// Left motor
#define IN1 2
#define IN2 3
#define IN1_L 6
#define IN2_L 7


// Right motor
#define IN3 4
#define IN4 5
#define IN3_R 8
#define IN4_R 9
// ------------------- Variables -------------------
int speedDelay = 25; // Time in ms to move before stopping

// ------------------- Setup -------------------
void setup() {
  Serial.begin(9600); // Hardware Serial for HC-05

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(IN1_L, OUTPUT);
  pinMode(IN2_L, OUTPUT);
  pinMode(IN3_R, OUTPUT);
  pinMode(IN4_R, OUTPUT);

  stopCar(); // Ensure motors are stopped on start
  Serial.println("RC Car Ready!");
}

// ------------------- Main Loop -------------------
void loop() {
  if(Serial.available()) {
    char cmd = Serial.read();
    cmd = toupper(cmd); // Accept lowercase

    switch(cmd) {
      case 'F': forward(); break;
      case 'B': backward(); break;
      case 'L': left(); break;
      case 'R': right(); break;
      case 'S': stopCar(); break;
      default: Serial.print("Unknown command: "); Serial.println(cmd); break;
    }
  }
}

// ------------------- Movement Functions -------------------
void forward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN1_L, HIGH);
  digitalWrite(IN2_L, LOW);

  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  digitalWrite(IN3_R, HIGH);
  digitalWrite(IN4_R, LOW);

  delay(speedDelay);
  stopCar();
}

void backward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN1_L, LOW);
  digitalWrite(IN2_L, HIGH);

  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  digitalWrite(IN3_R, LOW);
  digitalWrite(IN4_R, HIGH);

  delay(speedDelay);
  stopCar();
}

void left() {
  digitalWrite(IN1, HIGH);  // Left motor backward
  digitalWrite(IN2, LOW);
  digitalWrite(IN1_L, LOW);
  digitalWrite(IN2_L, HIGH);

  digitalWrite(IN3, LOW); // Right motor forward
  digitalWrite(IN4, HIGH);
  digitalWrite(IN3_R, HIGH);
  digitalWrite(IN4_R, LOW);

  delay(speedDelay);
  stopCar();
}

void right() {
  digitalWrite(IN1, LOW); // Left motor forward
  digitalWrite(IN2, HIGH);
  digitalWrite(IN1_L, HIGH);
  digitalWrite(IN2_L, LOW);

  digitalWrite(IN3, HIGH);  // Right motor backward
  digitalWrite(IN4, LOW);
  digitalWrite(IN3_R, LOW);
  digitalWrite(IN4_R, HIGH);

  delay(speedDelay);
  stopCar();
}

void stopCar() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  digitalWrite(IN1_L, LOW);
  digitalWrite(IN2_L, LOW);
  digitalWrite(IN3_R, LOW);
  digitalWrite(IN4_R, LOW);
}
