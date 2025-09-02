import React, { useState, useEffect } from "react";
import ChatAppNew from "./components/ChatAppNew";
import MeetingApp from "./components/MeetingApp";
import ArduinoTest from "./components/ArduinoTest";
import AppSwitcher from "./components/AppSwitcher";
import arduinoService from "./utils/arduinoService";

function App() {
  const [currentApp, setCurrentApp] = useState("chat");
  const [userStatus, setUserStatus] = useState("online");
  const [socialEnergy, setSocialEnergy] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const handleAppSwitch = (app) => {
    // 切换应用时关闭磁力
    arduinoService.setMagnetStrength(0);
    console.log("🔄 App switching - Magnet turned off");
    setCurrentApp(app);
  };

  // 应用启动时确保磁力关闭
  useEffect(() => {
    arduinoService.setMagnetStrength(0);
    console.log("🚀 App initialized - Magnet turned off");
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      {/* Render current app */}
      {currentApp === "chat" ? (
        <ChatAppNew
          userStatus={userStatus}
          setUserStatus={setUserStatus}
          socialEnergy={socialEnergy}
          setSocialEnergy={setSocialEnergy}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          onAppSwitch={handleAppSwitch}
        />
      ) : currentApp === "meeting" ? (
        <MeetingApp
          userStatus={userStatus}
          setUserStatus={setUserStatus}
          socialEnergy={socialEnergy}
          setSocialEnergy={setSocialEnergy}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
      ) : (
        <ArduinoTest />
      )}

      {/* App switcher */}
      <AppSwitcher currentApp={currentApp} onAppSwitch={handleAppSwitch} />
    </div>
  );
}

export default App;
