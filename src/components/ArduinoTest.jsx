import React, { useState, useEffect } from "react";
import arduinoService from "../utils/arduinoService";

const ArduinoTest = () => {
  const [arduinoConnected, setArduinoConnected] = useState(false);
  const [realDistance, setRealDistance] = useState(100);
  const [testMode, setTestMode] = useState("none"); // none, call, monitoring, emoji
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ timestamp, message }, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    console.log("ArduinoTest: Starting connection...");
    arduinoService
      .connect()
      .then(() => {
        console.log("Arduino service connected to backend");
        addLog("Backend connection established");

        // 强制请求状态
        setTimeout(() => {
          console.log("Force requesting Arduino status...");
          arduinoService.syncConnectionStatus();
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to connect to Arduino service:", err);
        addLog(`Backend connection failed: ${err.message}`);
      });

    const unsubscribeStatus = arduinoService.onStatus((connected) => {
      console.log("Arduino status update:", connected);
      setArduinoConnected(connected);
      addLog(`Arduino ${connected ? "connected" : "disconnected"}`);
    });

    const unsubscribeDistance = arduinoService.onDistance((distance) => {
      console.log("ArduinoTest received distance:", distance);
      setRealDistance(distance);
      addLog(`Distance updated: ${distance.toFixed(1)}%`);

      // 测试距离控制功能
      if (testMode === "call" && distance <= 5) {
        addLog(`Call triggered by Arduino distance: ${distance.toFixed(1)}%`);
        // 模拟通话开始
        setTimeout(() => {
          addLog("Call connected!");
          setTestMode("none");
        }, 2000);
      }

      if (testMode === "monitoring" && distance <= 5) {
        addLog(`Speaking started by Arduino distance: ${distance.toFixed(1)}%`);
      } else if (testMode === "monitoring" && distance > 5) {
        addLog(`Speaking stopped by Arduino distance: ${distance.toFixed(1)}%`);
      }

      if (testMode === "emoji") {
        const opacity = arduinoService.mapDistanceToOpacity(distance);
        addLog(
          `Emoji opacity: ${(opacity * 100).toFixed(
            1
          )}% (distance: ${distance.toFixed(1)}%)`
        );
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeDistance();
      arduinoService.disconnect();
    };
  }, [testMode]);

  const startCallTest = () => {
    setTestMode("call");
    addLog("Call test started - move Arduino sensor to 0% to trigger call");
  };

  const startMonitoringTest = () => {
    setTestMode("monitoring");
    addLog("Monitoring test started - move Arduino sensor to control speaking");
  };

  const startEmojiTest = () => {
    setTestMode("emoji");
    addLog("Emoji test started - move Arduino sensor to control opacity");
  };

  const stopTest = () => {
    setTestMode("none");
    addLog("Test stopped");
  };

  const testMagnet = (level) => {
    arduinoService.setMagnetStrength(level);
    addLog(`Magnet test: level ${level}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Arduino Integration Test
        </h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center space-x-4">
            <div
              className={`w-4 h-4 rounded-full ${
                arduinoConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-lg">
              Arduino: {arduinoConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {arduinoConnected && (
            <p className="text-gray-600 mt-2">
              Real Distance: {realDistance.toFixed(1)}%
            </p>
          )}
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={startCallTest}
              disabled={!arduinoConnected || testMode !== "none"}
              className="p-4 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Test Call Trigger
            </button>

            <button
              onClick={startMonitoringTest}
              disabled={!arduinoConnected || testMode !== "none"}
              className="p-4 bg-green-500 text-white rounded-lg disabled:opacity-50"
            >
              Test Monitoring
            </button>

            <button
              onClick={startEmojiTest}
              disabled={!arduinoConnected || testMode !== "none"}
              className="p-4 bg-purple-500 text-white rounded-lg disabled:opacity-50"
            >
              Test Emoji Opacity
            </button>

            <button
              onClick={stopTest}
              disabled={testMode === "none"}
              className="p-4 bg-red-500 text-white rounded-lg disabled:opacity-50"
            >
              Stop Test
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Magnet Test</h3>
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => testMagnet(level)}
                  disabled={!arduinoConnected}
                  className={`px-4 py-2 rounded ${
                    level === 0
                      ? "bg-gray-500 text-white"
                      : "bg-yellow-500 text-white"
                  } disabled:opacity-50`}
                >
                  {level === 0 ? "Off" : `Level ${level}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Test Status */}
        {testMode !== "none" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Current Test: {testMode}
            </h3>
            <p className="text-blue-600">
              {testMode === "call" &&
                "Move Arduino sensor to 0% to trigger call"}
              {testMode === "monitoring" &&
                "Move Arduino sensor to 0% to start speaking"}
              {testMode === "emoji" &&
                "Move Arduino sensor to control emoji opacity"}
            </p>
          </div>
        )}

        {/* Logs */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <span className="text-gray-500 font-mono">{log.timestamp}</span>
                <span className="text-gray-800">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArduinoTest;
