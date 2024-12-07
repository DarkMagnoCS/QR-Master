import React, { useState } from "react";
import axios from "axios";

const QRGenerator = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const [inputData, setInputData] = useState("");
    const [qrCode, setQrCode] = useState("");

    const handleGenerate = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/generate", { data: inputData });
            setQrCode(response.data.qr_code);
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center" }}>
            <h1>QR Code Generator</h1>
            <div>
                <button onClick={() => setSelectedOption("url")}>URL</button>
                <button onClick={() => setSelectedOption("whatsapp")}>WhatsApp</button>
                <button onClick={() => setSelectedOption("wifi")}>Wi-Fi</button>
            </div>
            {selectedOption && (
                <div style={{ marginTop: "20px" }}>
                    <input
                        type="text"
                        placeholder={`Enter ${selectedOption} info`}
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        style={{ width: "100%", padding: "10px" }}
                    />
                    <button onClick={handleGenerate} style={{ marginTop: "10px", padding: "10px" }}>
                        Generate QR Code
                    </button>
                </div>
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
