#define ELECTROMAGNET_1 10
#define ELECTROMAGNET_2 11

// Predefined strength levels
int strengthLevels[5] = {53, 125, 197, 228, 255};

void setup() {
  pinMode(ELECTROMAGNET_1, OUTPUT);
  pinMode(ELECTROMAGNET_2, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type a number 1-5 to set strength, or 0 to turn off.");
}

void loop() {
  if (Serial.available() > 0) {
    char c = Serial.read();   // Read keyboard input
    if (c >= '1' && c <= '5') {
      int index = c - '1';   // Convert to array index (0–4)
      int strength = strengthLevels[index];

      analogWrite(ELECTROMAGNET_1, strength);
      analogWrite(ELECTROMAGNET_2, strength);

      Serial.print("Strength level ");
      Serial.print(c);
      Serial.print(" set to PWM value ");
      Serial.println(strength);
    }
    else if (c == '0') {
      // Turn electromagnets off
      analogWrite(ELECTROMAGNET_1, 0);
      analogWrite(ELECTROMAGNET_2, 0);
      Serial.println("Electromagnets turned OFF");
    }
  }
}
