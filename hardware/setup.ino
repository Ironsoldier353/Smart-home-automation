#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>

// WiFi credentials
const char *temporarySSID = "TemporarySSID";
const char *temporaryPassword = "TemporaryPassword";
const char *serverURL = "http://<your-backend-endpoint>/api/v1/devices/validateDevice";

// Polling interval in milliseconds
const unsigned long pollingInterval = 15000; // 15 seconds
unsigned long lastPollTime = 0;

// Device state
bool isConfigured = false;
String configuredSSID = "";
String configuredPassword = "";

// Preferences for storing WiFi credentials
Preferences preferences;

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\nESP32 Device Initialization");
    
    // Initialize preferences
    preferences.begin("wifi-config", false);
    
    // Check if device is already configured
    isConfigured = preferences.getBool("configured", false);
    
    if (isConfigured) {
        // Retrieve stored credentials
        configuredSSID = preferences.getString("ssid", "");
        configuredPassword = preferences.getString("password", "");
        
        Serial.println("Device already configured. Connecting to stored WiFi...");
        connectToWiFi(configuredSSID.c_str(), configuredPassword.c_str());
    } else {
        Serial.println("Device not configured. Connecting to temporary WiFi...");
        connectToWiFi(temporarySSID, temporaryPassword);
    }
}

void loop() {
    unsigned long currentTime = millis();
    
    // Ensure WiFi is connected
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi connection lost. Reconnecting...");
        if (isConfigured) {
            connectToWiFi(configuredSSID.c_str(), configuredPassword.c_str());
        } else {
            connectToWiFi(temporarySSID, temporaryPassword);
        }
    }
    
    // Only poll for device validation if not yet configured
    if (!isConfigured && currentTime - lastPollTime >= pollingInterval) {
        lastPollTime = currentTime;
        validateDevice();
    }
    
    // Other tasks can go here
    delay(100);
}

void connectToWiFi(const char *ssid, const char *password) {
    Serial.print("Connecting to Wi-Fi: ");
    Serial.println(ssid);
    
    WiFi.disconnect();
    delay(500);
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(1000);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nConnected to Wi-Fi!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nFailed to connect to WiFi!");
    }
}

void validateDevice() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverURL);
        http.addHeader("Content-Type", "application/json");
        
        // Get the ESP32's MAC address
        String macAddress = WiFi.macAddress();
        Serial.print("Device MAC Address: ");
        Serial.println(macAddress);
        
        // Create JSON payload
        DynamicJsonDocument requestDoc(200);
        requestDoc["macAddress"] = macAddress;
        String json;
        serializeJson(requestDoc, json);
        
        Serial.print("Sending validation request to server: ");
        Serial.println(json);
        
        // Send the MAC address for validation
        int httpResponseCode = http.POST(json);
        Serial.print("HTTP Response Code: ");
        Serial.println(httpResponseCode);
        
        if (httpResponseCode == 200) {
            String response = http.getString();
            Serial.println("Validation success: " + response);
            
            // Parse the response to get SSID and password
            DynamicJsonDocument responseDoc(1024);
            DeserializationError error = deserializeJson(responseDoc, response);
            
            if (!error) {
                String newSSID = responseDoc["ssid"].as<String>();
                String newPassword = responseDoc["password"].as<String>();
                
                if (newSSID.length() > 0 && newPassword.length() > 0) {
                    // Store the new WiFi credentials
                    preferences.putBool("configured", true);
                    preferences.putString("ssid", newSSID);
                    preferences.putString("password", newPassword);
                    
                    Serial.println("New WiFi credentials saved.");
                    configuredSSID = newSSID;
                    configuredPassword = newPassword;
                    isConfigured = true;
                    
                    // Connect to the new Wi-Fi network
                    Serial.println("Connecting to new WiFi network...");
                    connectToWiFi(newSSID.c_str(), newPassword.c_str());
                } else {
                    Serial.println("Error: Received empty SSID or password");
                }
            } else {
                Serial.print("JSON parsing error: ");
                Serial.println(error.c_str());
            }
        } else if (httpResponseCode == 400) {
            Serial.println("Validation failed: MAC address not found in database.");
        } else {
            Serial.printf("Error: HTTP response code %d\n", httpResponseCode);
        }
        
        http.end();
    } else {
        Serial.println("Not connected to WiFi. Cannot validate device.");
    }
}