#include <WiFi.h>
#include <WebServer.h>

// Your Wi-Fi credentials
const char* ssid = "Sukanya";
const char* password = "9874126352";

// GPIO pins for 4 LEDs
const int led1 = 16;
const int led2 = 17;
const int led3 = 18;
const int led4 = 19;

// Create WebServer object on port 80
WebServer server(80);

// HTML page to control the LEDs
const char* htmlPage = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <title>ESP32 LED Control</title>
    <script>
        function sendCommand(command) {
            fetch("/action?command=" + command)
            .then(response => response.text())
            .then(data => console.log(data));
        }
    </script>
</head>
<body>
    <h1>Control 4 LEDs</h1>
    <button onclick="sendCommand('led1On')">Turn LED 1 ON</button>
    <button onclick="sendCommand('led1Off')">Turn LED 1 OFF</button><br><br>
    <button onclick="sendCommand('led2On')">Turn LED 2 ON</button>
    <button onclick="sendCommand('led2Off')">Turn LED 2 OFF</button><br><br>
    <button onclick="sendCommand('led3On')">Turn LED 3 ON</button>
    <button onclick="sendCommand('led3Off')">Turn LED 3 OFF</button><br><br>
    <button onclick="sendCommand('led4On')">Turn LED 4 ON</button>
    <button onclick="sendCommand('led4Off')">Turn LED 4 OFF</button><br><br>
</body>
</html>
)rawliteral";

void setup() {
  // Start the Serial Monitor
  Serial.begin(115200);

  // Initialize LED pins as outputs
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(led4, OUTPUT);

  // Turn off all LEDs initially
  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(led3, LOW);
  digitalWrite(led4, LOW);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Connected to WiFi. IP Address: ");
  Serial.println(WiFi.localIP());

  // Serve the HTML page
  server.on("/", HTTP_GET, []() {
    server.send(200, "text/html", htmlPage);
  });

  // Handle action requests to control the LEDs
  server.on("/action", HTTP_GET, []() {
    String command = server.arg("command");

    if (command == "led1On") {
      digitalWrite(led1, HIGH); // Turn on LED 1
      server.send(200, "text/plain", "LED 1 is ON");
    } else if (command == "led1Off") {
      digitalWrite(led1, LOW);  // Turn off LED 1
      server.send(200, "text/plain", "LED 1 is OFF");
    } else if (command == "led2On") {
      digitalWrite(led2, HIGH); // Turn on LED 2
      server.send(200, "text/plain", "LED 2 is ON");
    } else if (command == "led2Off") {
      digitalWrite(led2, LOW);  // Turn off LED 2
      server.send(200, "text/plain", "LED 2 is OFF");
    } else if (command == "led3On") {
      digitalWrite(led3, HIGH); // Turn on LED 3
      server.send(200, "text/plain", "LED 3 is ON");
    } else if (command == "led3Off") {
      digitalWrite(led3, LOW);  // Turn off LED 3
      server.send(200, "text/plain", "LED 3 is OFF");
    } else if (command == "led4On") {
      digitalWrite(led4, HIGH); // Turn on LED 4
      server.send(200, "text/plain", "LED 4 is ON");
    } else if (command == "led4Off") {
      digitalWrite(led4, LOW);  // Turn off LED 4
      server.send(200, "text/plain", "LED 4 is OFF");
    } else {
      server.send(400, "text/plain", "Invalid command");
    }
  });

  // Start the server
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  // Handle incoming client requests
  server.handleClient();
}
