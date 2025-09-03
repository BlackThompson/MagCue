// ---- CONFIG ----
#define IR_PIN A0                // IR distance sensor pin
#define ELECTROMAGNET_1 10       // PWM
#define ELECTROMAGNET_2 11       // PWM
const bool PLOTTER_MODE = false; // true: numeric-only output for Serial Plotter; false: human-readable Serial Monitor

// ---- Electromagnet strength levels ----
int strengthLevels[5] = {53, 125, 197, 228, 255};

// ---- Sampling ----
// const unsigned long SAMPLE_INTERVAL_MS = 100; // sensor sample interval
const unsigned long SAMPLE_INTERVAL_MS = 200; // sensor sample interval
unsigned long lastSampleMs = 0;

// ---- Magnet safety timer ----
const unsigned long MAX_ON_TIME_MS = 20000; // 20 seconds
bool magnetOn = false;
unsigned long magnetStartMs = 0;

// ---- Distance threshold ----
const float MIN_DISTANCE = 6.20;
const float MAX_DISTANCE = 7.20;

void setup()
{
  pinMode(IR_PIN, INPUT);
  pinMode(ELECTROMAGNET_1, OUTPUT);
  pinMode(ELECTROMAGNET_2, OUTPUT);

  Serial.begin(9600);
  if (!PLOTTER_MODE)
  {
    Serial.println("Type 1-5 to set electromagnet strength, or 0 to turn OFF.");
    Serial.println("Sensor streaming is active.");
  }
}

void loop()
{
  unsigned long now = millis();

  // 1) SENSOR: periodic read + print
  if (now - lastSampleMs >= SAMPLE_INTERVAL_MS)
  {
    lastSampleMs = now;

    int raw = analogRead(IR_PIN); // 0..1023
    float distance = calculate_distance(raw);

    if (PLOTTER_MODE)
    {
      Serial.print(raw);
      Serial.print(' ');
      Serial.println(distance, 2);
    }
    else
    {
      Serial.print("Raw: ");
      Serial.print(raw);
      Serial.print("  Distance: ");
      Serial.print(distance, 2);
      Serial.println(" %");
    }
  }

  // 2) CONTROL: read keyboard input
  if (Serial.available() > 0)
  {
    char c = Serial.read();

    if (c >= '1' && c <= '5')
    {
      int idx = c - '1';
      int pwm = strengthLevels[idx];
      analogWrite(ELECTROMAGNET_1, pwm);
      analogWrite(ELECTROMAGNET_2, pwm);
      magnetOn = true;
      magnetStartMs = now;
      if (!PLOTTER_MODE)
      {
        Serial.print("Strength level ");
        Serial.print(c);
        Serial.print(" -> PWM ");
        Serial.println(pwm);
      }
    }
    else if (c == '0')
    {
      turnOffMagnet();
      if (!PLOTTER_MODE)
      {
        Serial.println("Electromagnets OFF");
      }
    }
    else if (c == '\r' || c == '\n')
    {
      // ignore line endings
    }
    else
    {
      if (!PLOTTER_MODE)
      {
        Serial.println("Use keys 1-5 to set strength, 0 to turn OFF.");
      }
    }
  }

  // 3) Auto-off safety timer
  if (magnetOn && (now - magnetStartMs >= MAX_ON_TIME_MS))
  {
    turnOffMagnet();
    if (!PLOTTER_MODE)
    {
      Serial.println("Electromagnets auto-OFF (20s limit).");
    }
  }
}

// Helper: turn off both magnets
void turnOffMagnet()
{
  analogWrite(ELECTROMAGNET_1, 0);
  analogWrite(ELECTROMAGNET_2, 0);
  magnetOn = false;
}

// Distance conversion (example; adjust for your sensor with calibration)
float calculate_distance(int rawValue)
{
  if (rawValue <= 12)
    return 0; // invalid reading

  float distance = 2076.0f / (rawValue - 11.0f);

  // Convert to relative percentage
  float relative_distance;

  if (distance < MIN_DISTANCE)
    distance = MIN_DISTANCE;
  if (distance > MAX_DISTANCE)
    distance = MAX_DISTANCE;

  relative_distance = distance - MIN_DISTANCE;
  float max_relative_distance = MAX_DISTANCE - MIN_DISTANCE;

  float percent_distance = (relative_distance / max_relative_distance) * 100.0;

  if (percent_distance > 100.0)
    percent_distance = 100.0;
  return percent_distance;
}
