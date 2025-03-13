#include <WiFi.h>
#include <WebServer.h>

#define LED1 5
#define LED2 18
#define LED3 19
#define LED4 23

const char *ssid = "Your_WiFi_SSID";
const char *password = "Your_WiFi_Password";

WebServer server(80);

void handleRoot() {
  server.send(200, "text/html", getHTML());
}

void handleControl() {
  String led = server.arg("led");
  String state = server.arg("state");

  int pin = led.toInt();

  // Check current LED state and toggle
  if (state == "TOGGLE") {
    int currentState = digitalRead(pin);
    digitalWrite(pin, !currentState); // Toggle the LED
  } else if (state == "ON") {
    digitalWrite(pin, HIGH);
  } else if (state == "OFF") {
    digitalWrite(pin, LOW);
  }

  server.send(200, "text/plain", "OK");
}


void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);

  server.on("/", handleRoot);
  server.on("/control", handleControl);

  server.begin();
  Serial.println("HTTP Server Started!");
}

void loop() {
  server.handleClient();
}

String getHTML() {
  return R"rawliteral(
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ESP32 LED Control</title>
      <style>
        body { font-family: Arial; text-align: center; }
        h1 { color: #333; }
        button { padding: 10px 20px; margin: 10px; font-size: 18px; }
        .on { background-color: green; color: white; }
        .off { background-color: red; color: white; }
      </style>
    </head>
    <body>
      <h1>ESP32 LED Control Panel</h1>
      <button onclick="toggleLED(5)">LED 1</button>
      <button onclick="toggleLED(18)">LED 2</button>
      <button onclick="toggleLED(19)">LED 3</button>
      <button onclick="toggleLED(23)">LED 4</button>

      <script>
        async function toggleLED(pin) {
          const currentState = await fetch(`/control?led=${pin}&state=TOGGLE`);
          console.log(await currentState.text());
        }
      </script>
    </body>
    </html>
  )rawliteral";
}
