import React, { useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import { statusOptions } from "../../data/statusOptions";

const Sidebar = ({
  userStatus,
  setUserStatus,
  socialEnergy,
  setSocialEnergy,
  showSettings,
  setShowSettings,
}) => {
  const settingsRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSettings &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings, setShowSettings]);

  const getStatusEmoji = (status) => {
    const statusOption = statusOptions.find((option) => option.key === status);
    if (statusOption) {
      // 使用空格分割，取第一部分作为emoji
      const parts = statusOption.label.split(" ");
      if (parts.length > 0 && parts[0]) {
        return parts[0];
      }
    }
    return "⚫";
  };

  return (
    <div className="w-16 bg-gradient-to-b from-white to-gray-50 shadow-lg flex flex-col items-center py-6 space-y-8 relative">
      {/* User avatar */}
      <div className="relative mt-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200">
          👤
        </div>
        <div className="absolute -bottom-1 -right-1 text-lg drop-shadow-sm">
          {getStatusEmoji(userStatus)}
        </div>
      </div>

      {/* Settings button */}
      <button
        ref={buttonRef}
        onClick={() => setShowSettings(!showSettings)}
        className="p-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md mt-auto"
      >
        <Settings size={20} />
      </button>

      {/* Settings panel */}
      {showSettings && (
        <div
          ref={settingsRef}
          className="absolute left-20 top-0 w-72 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 z-10 border border-gray-200"
        >
          <h3 className="font-semibold text-gray-800 mb-6 text-lg">Settings</h3>

          {/* Status selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status
            </label>
            <select
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Social energy slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Energy: {socialEnergy}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="1"
              value={socialEnergy}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                // 限制为指定的5档值
                let adjustedValue;
                if (value <= -4) adjustedValue = -5;
                else if (value <= -1) adjustedValue = -3;
                else if (value <= 1) adjustedValue = 0;
                else if (value <= 4) adjustedValue = 3;
                else adjustedValue = 5;
                setSocialEnergy(adjustedValue);
              }}
              className="w-full slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Very Low</span>
              <span>Low</span>
              <span>Neutral</span>
              <span>High</span>
              <span>Very High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
