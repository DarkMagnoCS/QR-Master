import React, { useState } from "react";
import axios from "axios";

const countryCodes = [
  { name: "Uruguay", code: "+598" },
  { name: "USA", code: "+1" },
  { name: "UK", code: "+44" },
  { name: "India", code: "+91" },
  { name: "Germany", code: "+49" },
  // Add more country codes here
];

const QRGenerator = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [inputData, setInputData] = useState({});
  const [qrCode, setQrCode] = useState("");

  const handleInputChange = (key, value) => {
    setInputData({ ...inputData, [key]: value });
  };

  const handleGenerate = async () => {
    let formattedData = "";

    switch (selectedOption) {
      case "url":
        formattedData = inputData.url || "";
        break;
      case "whatsapp":
        if (inputData.countryCode && inputData.phoneNumber) {
          const phone = inputData.countryCode + inputData.phoneNumber;
          formattedData = `https://wa.me/${phone}`;
        }
        break;
      case "wifi":
        if (inputData.ssid) {
          formattedData = `WIFI:S:${inputData.ssid};T:${inputData.networkType || ""};P:${inputData.password || ""};H:${inputData.hidden ? "true" : "false"};`;
        } else {
          alert("Please enter the Name of the Network (SSID)!");
          return;
        }
        break;
      default:
        console.error("Invalid option selected.");
    }

    if (!formattedData) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/generate", { data: formattedData });
      setQrCode(response.data.qr_code);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setInputData({});
    setQrCode("");
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
              value={inputData.url || ""}
              onChange={(e) => handleInputChange("url", e.target.value)}
            />
            <p>Your QR code will open this URL.</p>
          </div>
        );
      case "whatsapp":
        return (
          <div>
            <label>Country code</label>
            <select
              value={inputData.countryCode || ""}
              onChange={(e) => handleInputChange("countryCode", e.target.value)}
            >
              <option value="">Select a country</option>
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <label>Phone number</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={inputData.phoneNumber || ""}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
            <p>Scanning the QR code will send a message to the phone number.</p>
          </div>
        );
      case "wifi":
        return (
          <div>
            <label>
              Name of the Network (SSID) <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Name of the network"
              value={inputData.ssid || ""}
              onChange={(e) => handleInputChange("ssid", e.target.value)}
              required
            />
            <label>Encryption Type</label>
            <select
              value={inputData.networkType || ""}
              onChange={(e) => handleInputChange("networkType", e.target.value)}
            >
              <option value="none">No encryption</option>
              <option value="WPA">WPA</option>
              <option value="WEP">WEP</option>
              <option value="WPA-EAP">WPA-EAP</option>
            </select>
            <label>Password</label>
            <input
              type="text"
              placeholder="Wi-Fi password"
              value={inputData.password || ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={inputData.hidden || false}
                onChange={(e) => handleInputChange("hidden", e.target.checked)}
              />
              Hidden Network
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
          onClick={() => handleOptionChange("url")}
          className={selectedOption === "url" ? "selected" : ""}
        >
          URL
        </button>
        <button
          onClick={() => handleOptionChange("whatsapp")}
          className={selectedOption === "whatsapp" ? "selected" : ""}
        >
          WhatsApp
        </button>
        <button
          onClick={() => handleOptionChange("wifi")}
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
