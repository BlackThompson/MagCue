import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";

const MeetingApp = ({
  userStatus,
  setUserStatus,
  socialEnergy,
  setSocialEnergy,
  showSettings,
  setShowSettings,
}) => {
  const [participants] = useState([
    { id: 1, name: "John Smith", avatar: "👨‍💼", isSpeaking: true },
    { id: 2, name: "Sarah Johnson", avatar: "👩‍🦰", isSpeaking: false },
    { id: 3, name: "Mike Chen", avatar: "👨‍🔬", isSpeaking: false },
    { id: 4, name: "Emma Wilson", avatar: "👩‍🎨", isSpeaking: false },
  ]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Left sidebar */}
      <Sidebar
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        socialEnergy={socialEnergy}
        setSocialEnergy={setSocialEnergy}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {/* Main meeting area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl font-semibold">Team Meeting</h1>
            <div className="flex items-center space-x-4">
              <span className="text-white/70 text-sm">4 participants</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className={`relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl overflow-hidden border-2 ${
                  participant.isSpeaking
                    ? "border-green-400"
                    : "border-gray-600"
                }`}
              >
                {/* Video placeholder */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl">{participant.avatar}</div>
                </div>

                {/* Participant info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {participant.name}
                      </span>
                      {participant.isSpeaking && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs">
                            Speaking
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mute indicator */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                    <span className="text-white text-sm">🎤</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting controls */}
        <div className="bg-black/20 backdrop-blur-sm p-6 border-t border-gray-700">
          <div className="flex items-center justify-center space-x-6">
            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <span className="text-white text-xl">🎤</span>
            </button>
            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <span className="text-white text-xl">📹</span>
            </button>
            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <span className="text-white text-xl">📊</span>
            </button>
            <button className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
              <span className="text-white text-xl">📞</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingApp;
