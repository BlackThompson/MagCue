import React, { useState, useEffect } from "react";

const LogPanel = ({
  logs,
  distance,
  onDistanceChange,
  isInCall,
  callStatus,
}) => {
  const [isConnected, setIsConnected] = useState(false);

  // 检查是否完全连接（distance为0）
  useEffect(() => {
    setIsConnected(distance === 0);
  }, [distance]);

  const getStatusLevel = (status) => {
    const statusLevels = {
      online: -1,
      available: -2,
      away: -3,
      busy: -3,
      sleeping: -4,
      dnd: -4,
      oncall: -5,
      offline: -5,
    };
    return statusLevels[status] || 0;
  };

  const getEnergyLevel = (energy) => {
    if (energy >= 4) return "Very High";
    if (energy >= 2) return "High";
    if (energy >= 0) return "Normal";
    if (energy >= -2) return "Low";
    return "Very Low";
  };

  const getNumberColor = (value) => {
    if (value > 0) return "text-green-600 bg-green-100";
    if (value < 0) return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  const getNumberSize = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 4) return "text-2xl font-bold";
    if (absValue >= 2) return "text-xl font-semibold";
    return "text-lg font-medium";
  };

  // 过滤只显示有数字的日志
  const filteredLogs = logs.filter((log) => {
    if (log.details) {
      return log.details.includes("Level:") || log.details.includes("Energy:");
    }
    return false;
  });

  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-blue-50 border-l border-gray-200 flex flex-col relative z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-gray-800">System Log</h2>
        <p className="text-sm text-gray-600 mt-1">Distance Control</p>
      </div>

      {/* Log content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredLogs.map((log, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium">
                {log.timestamp}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  log.type === "call"
                    ? "bg-blue-100 text-blue-700"
                    : log.type === "energy"
                    ? "bg-green-100 text-green-700"
                    : log.type === "system"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {log.type.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-800 font-medium">{log.message}</p>
            {log.details && (
              <div className="text-xs text-gray-600 mt-1">
                {log.details.split(" - ").map((part, i) => {
                  // 检查是否包含数字（状态等级或能量值）
                  const numberMatch = part.match(/(Level|Energy):\s*([-\d]+)/);
                  if (numberMatch) {
                    const label = numberMatch[1];
                    const value = parseInt(numberMatch[2]);
                    const colorClass = getNumberColor(value);
                    const sizeClass = getNumberSize(value);

                    return (
                      <div key={i} className="flex items-center space-x-2 mt-1">
                        <span>{label}:</span>
                        <span
                          className={`px-2 py-1 rounded-md ${colorClass} ${sizeClass}`}
                        >
                          {value > 0 ? `+${value}` : value}
                        </span>
                        {value !== 0 && (
                          <span className="text-xs text-gray-500">
                            ({value > 0 ? "Attraction" : "Repulsion"})
                          </span>
                        )}
                      </div>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Distance control */}
      <div className="p-6 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance: {distance}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={distance}
            onChange={(e) => onDistanceChange(parseInt(e.target.value))}
            className="w-full slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Ready (0%)</span>
            <span>Not Ready (100%)</span>
          </div>
        </div>

        {/* Status */}
        <div
          className={`p-3 rounded-lg border-2 ${
            isConnected
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-orange-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {isConnected ? "Ready to Call" : "Not Ready"}
            </span>
          </div>
          {isInCall && callStatus === "waiting" && !isConnected && (
            <p className="text-sm mt-2 text-orange-700">
              📞 Pull to 0% to start call
            </p>
          )}
          {isInCall && callStatus === "waiting" && isConnected && (
            <p className="text-sm mt-2 text-green-700">
              ✓ Ready - Call starting
            </p>
          )}
          {isInCall && callStatus === "timeout" && (
            <p className="text-sm mt-2 text-red-700">
              ⏰ Timeout - Did not pull to 0% in time
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogPanel;
