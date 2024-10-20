#include <WiFi.h>
#include <Preferences.h>
#include <WebServer.h>

Preferences preferences;
WebServer server(80);  // Create a web server on port 80

// Function to get or generate a unique ID
String getOrCreateUniqueID() {
    String uniqueID = preferences.getString("uniqueID", ""); // Retrieve from memory
    if (uniqueID.isEmpty()) {  // If it doesn't exist, generate a new one
        uniqueID = WiFi.macAddress();  // Using MAC address as a unique ID
        preferences.putString("uniqueID", uniqueID);  // Save it
    }
    return uniqueID;
}

// HTML page to be served
const char* webPage = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>Smart Door Lock Configuration</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
    input[type=text], input[type=password] { width: 100%; padding: 12px; margin: 8px 0; }
    button { padding: 12px 20px; font-size: 16px; }
  </style>
</head>
<body>
  <h1>Smart Door Lock Configuration</h1>
  <p>Your Unique ID (MAC Address): %MAC_ADDRESS%</p>
  <form action="/connect" method="POST">
    <input type="text" name="ssid" placeholder="Enter your Wi-Fi SSID" required>
    <input type="password" name="password" placeholder="Enter your Wi-Fi Password" required>
    <button type="submit">Connect</button>
  </form>
</body>
</html>
)rawliteral";

// Function to handle the root request
void handleRoot() {
    String uniqueID = getOrCreateUniqueID();
    String page = webPage;
    page.replace("%MAC_ADDRESS%", uniqueID);  // Replace placeholder with actual MAC address
    server.send(200, "text/html", page);  // Send the modified HTML page
}

// Function to handle Wi-Fi connection
void handleConnect() {
    if (server.method() == HTTP_POST) {
        String ssid = server.arg("ssid");
        String password = server.arg("password");
        
        // Attempt to connect to the specified Wi-Fi
        WiFi.begin(ssid.c_str(), password.c_str());
        
        // Wait for connection
        while (WiFi.status() != WL_CONNECTED) {
            delay(1000);
            Serial.print(".");
        }

        Serial.println("\nConnected to Wi-Fi!");
        // Here you can add code to redirect to another page or do something else.
    }
    server.send(200, "text/html", "<h1>Connecting...</h1>");  // A simple response after submission
}

void setup() {
    Serial.begin(115200);
    preferences.begin("my-app", false);  // Open Preferences with namespace "my-app"
    
    // Start the server
    server.on("/", HTTP_GET, handleRoot);
    server.on("/connect", HTTP_POST, handleConnect);

    // Start the server
    server.begin();
    Serial.println("HTTP server started");
}

void loop() {
    server.handleClient();  // Handle incoming client requests
}
