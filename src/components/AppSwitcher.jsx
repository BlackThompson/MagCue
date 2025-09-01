import React from "react";
import { MessageCircle, Video, Settings } from "lucide-react";

const AppSwitcher = ({ currentApp, onAppSwitch }) => {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => onAppSwitch("chat")}
            className={`p-3 rounded-xl transition-all duration-200 ${
              currentApp === "chat"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MessageCircle size={20} />
          </button>
          <button
            onClick={() => onAppSwitch("meeting")}
            className={`p-3 rounded-xl transition-all duration-200 ${
              currentApp === "meeting"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Video size={20} />
          </button>
          <button
            onClick={() => onAppSwitch("arduino")}
            className={`p-3 rounded-xl transition-all duration-200 ${
              currentApp === "arduino"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSwitcher;
