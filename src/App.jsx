import React, { useState } from "react";
import ChatAppNew from "./components/ChatAppNew";
import MeetingApp from "./components/MeetingApp";
import ArduinoTest from "./components/ArduinoTest";
import AppSwitcher from "./components/AppSwitcher";

function App() {
  const [currentApp, setCurrentApp] = useState("chat");
  const [userStatus, setUserStatus] = useState("online");
  const [socialEnergy, setSocialEnergy] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const handleAppSwitch = (app) => {
    setCurrentApp(app);
  };

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
