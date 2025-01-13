#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* temporarySSID = "TemporarySSID";
const char* temporaryPassword = "TemporaryPassword";
const char* serverURL = "http://<your-backend-endpoint>/api/v1/devices/validateDevice";

// Polling interval in milliseconds
const unsigned long pollingInterval = 15000; // 15 seconds
unsigned long lastPollTime = 0;

void setup() {
    Serial.begin(115200);

    // Connect to temporary Wi-Fi
    connectToWiFi(temporarySSID, temporaryPassword);
}

void loop() {
    unsigned long currentTime = millis();

    // Poll the backend at the specified interval
    if (currentTime - lastPollTime >= pollingInterval) {
        lastPollTime = currentTime;
        validateDevice();
    }
}

void connectToWiFi(const char* ssid, const char* password) {
    Serial.print("Connecting to Wi-Fi: ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnected to Wi-Fi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void validateDevice() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverURL);
        http.addHeader("Content-Type", "application/json");

        // Get the ESP32's MAC address
        String macAddress = WiFi.macAddress();
        String json = "{\"macAddress\":\"" + macAddress + "\"}";

        // Send the MAC address for validation
        int httpResponseCode = http.POST(json);

        if (httpResponseCode == 200) {
            String response = http.getString();
            Serial.println("Validation success: " + response);

            // Parse the response to get SSID and password
            DynamicJsonDocument doc(1024);
            deserializeJson(doc, response);
            String ssid = doc["ssid"];
            String password = doc["password"];

            // Connect to the new Wi-Fi network
            connectToWiFi(ssid.c_str(), password.c_str());
        } else if (httpResponseCode == 400) {
            Serial.println("Validation failed: MAC address not found in database.");
        } else {
            Serial.printf("Error: HTTP response code %d\n", httpResponseCode);
        }

        http.end();
    } else {
        Serial.println("Not connected to temporary Wi-Fi.");
    }
}
