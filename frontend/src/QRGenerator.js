import React, { useState } from "react";
import axios from "axios";

const QRGenerator = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [inputData, setInputData] = useState({});
  const [qrCode, setQrCode] = useState("");

  const handleInputChange = (key, value) => {
    setInputData({ ...inputData, [key]: value });
  };

  const handleGenerate = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/generate", { data: inputData });
      setQrCode(response.data.qr_code);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const renderInputs = () => {
    switch (selectedOption) {
      case "url":
        return (
          <div>
            <label>Submit URL</label>
            <input
              type="text"
              placeholder="https://"
              onChange={(e) => handleInputChange("url", e.target.value)}
            />
            <p>Your QR code will open this URL.</p>
          </div>
        );
      case "whatsapp":
        return (
          <div>
            <label>Country code</label>
            <input
              type="text"
              placeholder="--"
              onChange={(e) => handleInputChange("countryCode", e.target.value)}
            />
            <label>Phone number</label>
            <input
              type="text"
              placeholder="Enter phone number"
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
            <p>Scanning the QR code will send a message to the phone number.</p>
          </div>
        );
      case "wifi":
        return (
          <div>
            <label>Network name (SSID)</label>
            <input
              type="text"
              placeholder="SSID"
              onChange={(e) => handleInputChange("ssid", e.target.value)}
            />
            <label>Network type</label>
            <select onChange={(e) => handleInputChange("networkType", e.target.value)}>
              <option value="none">No encryption</option>
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
            </select>
            <label>Password</label>
            <input
              type="text"
              placeholder="Wi-Fi password"
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleInputChange("hidden", e.target.checked)}
              />
              Hidden
            </label>
            <p>Scanning the QR code will connect to the Wi-Fi network.</p>
          </div>
        );
      default:
        return <p>Please select an option to generate a QR code.</p>;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h1>QR Code Generator</h1>
      <div>
        <button
          onClick={() => setSelectedOption("url")}
          className={selectedOption === "url" ? "selected" : ""}
        >
          URL
        </button>
        <button
          onClick={() => setSelectedOption("whatsapp")}
          className={selectedOption === "whatsapp" ? "selected" : ""}
        >
          WhatsApp
        </button>
        <button
          onClick={() => setSelectedOption("wifi")}
          className={selectedOption === "wifi" ? "selected" : ""}
        >
          Wi-Fi
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>{renderInputs()}</div>
      {selectedOption && (
        <button onClick={handleGenerate} style={{ marginTop: "10px", padding: "10px" }}>
          Generate QR Code
        </button>
      )}
      {qrCode && (
        <div style={{ marginTop: "20px" }}>
          <h3>Your QR Code:</h3>
          <img src={`data:image/png;base64,${qrCode}`} alt="Generated QR Code" />
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
