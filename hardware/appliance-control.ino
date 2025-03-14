#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "";
const char* password = "";

//relay pins
#define RELAY1 23
#define RELAY2 5
#define RELAY3 18
#define RELAY4 19

//switch pins
#define SWITCH1 27
#define SWITCH2 14
#define SWITCH3 12
#define SWITCH4 13

//relay state variables
bool relayState1 = LOW;
bool relayState2 = LOW;
bool relayState3 = LOW;
bool relayState4 = LOW;

//debounce variables for manual switches
unsigned long lastDebounceTime1 = 0;
unsigned long lastDebounceTime2 = 0;
unsigned long lastDebounceTime3 = 0;
unsigned long lastDebounceTime4 = 0;
const unsigned long debounceDelay = 50; // 50 ms debounce delay

//switch last known states
int lastSwitchState1 = HIGH;
int lastSwitchState2 = HIGH;
int lastSwitchState3 = HIGH;
int lastSwitchState4 = HIGH;

//initialize the web server....... this will serve the web page at the assigned ip from the wifi connection
WebServer server(80);

void setup() {
  Serial.begin(115200);

  //set relay pins as output and initialize to LOW
  pinMode(RELAY1, OUTPUT);
  pinMode(RELAY2, OUTPUT);
  pinMode(RELAY3, OUTPUT);
  pinMode(RELAY4, OUTPUT);
  digitalWrite(RELAY1, relayState1);
  digitalWrite(RELAY2, relayState2);
  digitalWrite(RELAY3, relayState3);
  digitalWrite(RELAY4, relayState4);

  //set switch pins as input with pullup resistors
  pinMode(SWITCH1, INPUT_PULLUP);
  pinMode(SWITCH2, INPUT_PULLUP);
  pinMode(SWITCH3, INPUT_PULLUP);
  pinMode(SWITCH4, INPUT_PULLUP);

  //establish wifi connection.
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
  Serial.println(WiFi.localIP());

  // define web server route
  server.on("/", handleRoot);
  server.on("/relay1", []() { toggleRelay(RELAY1, relayState1); });
  server.on("/relay2", []() { toggleRelay(RELAY2, relayState2); });
  server.on("/relay3", []() { toggleRelay(RELAY3, relayState3); });
  server.on("/relay4", []() { toggleRelay(RELAY4, relayState4); });

  server.begin();
}

void loop() {
  server.handleClient();

  // Handle manual switch inputs with debouncing
  handleManualSwitch(SWITCH1, RELAY1, relayState1, lastSwitchState1, lastDebounceTime1);
  handleManualSwitch(SWITCH2, RELAY2, relayState2, lastSwitchState2, lastDebounceTime2);
  handleManualSwitch(SWITCH3, RELAY3, relayState3, lastSwitchState3, lastDebounceTime3);
  handleManualSwitch(SWITCH4, RELAY4, relayState4, lastSwitchState4, lastDebounceTime4);
}

void handleRoot() {
  String html = "<h1>ESP32 Relay Control</h1>"
                "<button onclick=\"location.href='/relay1'\">Toggle Relay 1</button><br><br>"
                "<button onclick=\"location.href='/relay2'\">Toggle Relay 2</button><br><br>"
                "<button onclick=\"location.href='/relay3'\">Toggle Relay 3</button><br><br>"
                "<button onclick=\"location.href='/relay4'\">Toggle Relay 4</button><br><br>";
  server.send(200, "text/html", html);
}

void toggleRelay(int relayPin, bool &relayState) {
  relayState = !relayState; // Toggle relay state
  digitalWrite(relayPin, relayState);
  server.send(200, "text/html", "<h1>Relay Toggled!</h1><p><a href=\"/\">Go Back</a></p>");
}

void handleManualSwitch(int switchPin, int relayPin, bool &relayState, int &lastSwitchState, unsigned long &lastDebounceTime) {
  int currentSwitchState = digitalRead(switchPin);
  unsigned long currentTime = millis();

  // Check for state change with debounce logic
  if (currentSwitchState != lastSwitchState && currentTime - lastDebounceTime > debounceDelay) {
    lastDebounceTime = currentTime;

    // Toggle relay state if the switch is pressed
    if (currentSwitchState == LOW) { // Switch pressed
      relayState = !relayState;
      digitalWrite(relayPin, relayState);
    }
  }

  // Update the last known switch state
  lastSwitchState = currentSwitchState;
}
