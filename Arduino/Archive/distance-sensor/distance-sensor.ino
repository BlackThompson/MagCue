#define IR_PIN A0  // IR distance sensor pin

void setup() {
  Serial.begin(9600);
  pinMode(IR_PIN, INPUT);
}

void loop() {
  int val = analogRead(IR_PIN);            // Read raw sensor value (0–1023)
  float distance = calculate_distance(val); // Convert to distance in cm
  
  // Serial.print("Distance: ");
  Serial.println(distance, 2); // Print with 2 decimal places
  // Serial.println(" cm");

  delay(200);  // Small delay for readability
}

float calculate_distance(int rawValue) {
  // Convert analog reading to distance (example formula, may need calibration)
  float distance = 2076.0 / (rawValue - 11);  // Use float math for better precision
  return distance;
}
