#define ELECTROMAGNET_1 10
#define ELECTROMAGNET_2 11
#define BUTTON_PIN 2

// RGB LED pins
#define LED_RED 3
#define LED_GREEN 5
#define LED_BLUE 6

// Predefined strength levels
int strengthLevels[5] = {53, 125, 197, 228, 255};

// Predefined pair sequences (for demonstration)
int pairSequences[30][2] = {
    {3, 3},
    {3, 3},
    {2, 3},
    {1, 3},
    {1, 3}, // 5
    {5, 3},
    {3, 4},
    {3, 3},
    {5, 3},
    {2, 3}, // 10
    {3, 4},
    {5, 3},
    {3, 1},
    {4, 3},
    {2, 3}, // 15
    {1, 3},
    {3, 1},
    {3, 3},
    {3, 2},
    {3, 2}, // 20
    {3, 5},
    {3, 3},
    {3, 5},
    {3, 5},
    {3, 3}, // 25
    {3, 2},
    {3, 1},
    {3, 4},
    {4, 3},
    {4, 3}, // 30
};



int pairIndex = 0;
bool buttonPressed = false;

void setup() {
    pinMode(ELECTROMAGNET_1, OUTPUT);
    pinMode(ELECTROMAGNET_2, OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    pinMode(LED_RED, OUTPUT);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_BLUE, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    if (digitalRead(BUTTON_PIN) == LOW && !buttonPressed) {
        buttonPressed = true;
        delay(50);  // Debounce

        int strength1 = strengthLevels[pairSequences[pairIndex][0] - 1];
        int strength2 = strengthLevels[pairSequences[pairIndex][1] - 1];
        pairIndex = (pairIndex + 1) % 30;
        Serial.println("Strength 1: " + String(strength1));
        Serial.println("Strength 2: " + String(strength2));

        // Phase 1: Waiting (blue)
        setLEDColor(0, 0, 255);
        delay(3000);

        // Phase 2: First push (red)
        setLEDColor(255, 0, 0);
        analogWrite(ELECTROMAGNET_1, strength1);
        analogWrite(ELECTROMAGNET_2, strength1);
        delay(4000);

        // Phase 3: Interval (blue)
        setLEDColor(0, 0, 255);
        analogWrite(ELECTROMAGNET_1, 0);
        analogWrite(ELECTROMAGNET_2, 0);
        delay(2000);

        // Phase 4: Second push (red)
        setLEDColor(255, 0, 0);
        analogWrite(ELECTROMAGNET_1, strength2);
        analogWrite(ELECTROMAGNET_2, strength2);
        delay(4000);

        // Phase 5: Reset (off)
        setLEDColor(0, 0, 0);
        analogWrite(ELECTROMAGNET_1, 0);
        analogWrite(ELECTROMAGNET_2, 0);

        Serial.print("Condition: ");
        Serial.print(strength1);
        Serial.print(" - ");
        Serial.println(strength2);

        buttonPressed = false;
    }

    delay(10);
}

void setLEDColor(int redValue, int greenValue, int blueValue) {
    analogWrite(LED_RED, redValue);
    analogWrite(LED_GREEN, greenValue);
    analogWrite(LED_BLUE, blueValue);
}