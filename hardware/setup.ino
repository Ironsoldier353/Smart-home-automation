#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>

// WiFi credentials
const char *temporarySSID = "TemporarySSID";
const char *temporaryPassword = "TemporaryPassword";
const char *serverURL = "http://<your-backend-endpoint>/api/v1/devices/validatedevice";
const char *controlURL = "http://<your-backend-endpoint>/api/v1/devices/control";

// Pin configuration
const int DEVICE_CONTROL_PIN = 13; // GPIO pin to control your device

// Polling intervals in milliseconds
const unsigned long validationInterval = 15000; // 15 seconds
const unsigned long controlPollInterval = 5000; // 5 seconds
unsigned long lastValidationTime = 0;
unsigned long lastControlPollTime = 0;

// Device state
bool isConfigured = false;
bool isDeviceOn = false;
String configuredSSID = "";
String configuredPassword = "";
String deviceId = ""; // Store device ID received from backend

// Preferences for storing WiFi credentials and device state
Preferences preferences;

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\nESP32 Device Initialization");
    
    // Set device control pin as output
    pinMode(DEVICE_CONTROL_PIN, OUTPUT);
    
    // Initialize preferences
    preferences.begin("device-config", false);
    
    // Check if device is already configured
    isConfigured = preferences.getBool("configured", false);
    isDeviceOn = preferences.getBool("deviceState", false);
    deviceId = preferences.getString("deviceId", "");
    
    // Apply the saved device state
    updateDeviceState(isDeviceOn);
    
    if (isConfigured) {
        // Retrieve stored credentials
        configuredSSID = preferences.getString("ssid", "");
        configuredPassword = preferences.getString("password", "");
        
        Serial.println("Device already configured. Connecting to stored WiFi...");
        Serial.print("Device ID: ");
        Serial.println(deviceId);
        Serial.print("Current device state: ");
        Serial.println(isDeviceOn ? "ON" : "OFF");
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
        delay(5000); // Wait before continuing
    }
    
    // Only poll for device validation if not yet configured
    if (!isConfigured && currentTime - lastValidationTime >= validationInterval) {
        lastValidationTime = currentTime;
        validateDevice();
    }
    
    // Poll for device control commands when in configured mode
    if (isConfigured && currentTime - lastControlPollTime >= controlPollInterval) {
        lastControlPollTime = currentTime;
        checkDeviceControl();
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
            
            // Parse the response to get SSID, password, and device ID
            DynamicJsonDocument responseDoc(1024);
            DeserializationError error = deserializeJson(responseDoc, response);
            
            if (!error) {
                String newSSID = responseDoc["ssid"].as<String>();
                String newPassword = responseDoc["password"].as<String>();
                String newDeviceId = responseDoc["deviceId"].as<String>();
                
                if (newSSID.length() > 0 && newPassword.length() > 0 && newDeviceId.length() > 0) {
                    // Store the new WiFi credentials and device ID
                    preferences.putBool("configured", true);
                    preferences.putString("ssid", newSSID);
                    preferences.putString("password", newPassword);
                    preferences.putString("deviceId", newDeviceId);
                    
                    Serial.println("New WiFi credentials and device ID saved.");
                    configuredSSID = newSSID;
                    configuredPassword = newPassword;
                    deviceId = newDeviceId;
                    isConfigured = true;
                    
                    // Connect to the new Wi-Fi network
                    Serial.println("Connecting to new WiFi network...");
                    connectToWiFi(newSSID.c_str(), newPassword.c_str());
                } else {
                    Serial.println("Error: Received incomplete configuration data");
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

void checkDeviceControl() {
    if (WiFi.status() == WL_CONNECTED && deviceId.length() > 0) {
        HTTPClient http;
        String fullControlURL = String(controlURL) + "?deviceId=" + deviceId;
        http.begin(fullControlURL);
        
        Serial.print("Checking device control status: ");
        Serial.println(fullControlURL);
        
        int httpResponseCode = http.GET();
        
        if (httpResponseCode == 200) {
            String response = http.getString();
            
            // Parse the control command
            DynamicJsonDocument doc(512);
            DeserializationError error = deserializeJson(doc, response);
            
            if (!error) {
                bool newState = doc["state"].as<bool>();
                
                if (newState != isDeviceOn) {
                    Serial.print("Received control command: Turn ");
                    Serial.println(newState ? "ON" : "OFF");
                    
                    // Update the device state
                    updateDeviceState(newState);
                    
                    // Store the new state
                    isDeviceOn = newState;
                    preferences.putBool("deviceState", isDeviceOn);
                    
                    // Send confirmation back to server
                    confirmStateChange(isDeviceOn);
                }
            } else {
                Serial.print("JSON parsing error: ");
                Serial.println(error.c_str());
            }
        } else if (httpResponseCode != 404) {
            // 404 might just mean no new commands, other errors are worth logging
            Serial.printf("Error checking device control: HTTP response code %d\n", httpResponseCode);
        }
        
        http.end();
    }
}

void updateDeviceState(bool turnOn) {
    // Set the control pin based on the desired state
    digitalWrite(DEVICE_CONTROL_PIN, turnOn ? HIGH : LOW);
    
    Serial.print("Device turned ");
    Serial.println(turnOn ? "ON" : "OFF");
}

void confirmStateChange(bool currentState) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(controlURL);
        http.addHeader("Content-Type", "application/json");
        
        // Create confirmation payload
        DynamicJsonDocument doc(256);
        doc["deviceId"] = deviceId;
        doc["state"] = currentState;
        doc["confirmed"] = true;
        
        String json;
        serializeJson(doc, json);
        
        // Send confirmation to server
        http.POST(json);
        http.end();
    }
}