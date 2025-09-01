import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import arduinoService from "../utils/arduinoService";

const MeetingApp = ({
  userStatus,
  setUserStatus,
  socialEnergy,
  setSocialEnergy,
  showSettings,
  setShowSettings,
}) => {
  const [participants] = useState([
    {
      id: 1,
      name: "John Smith",
      avatar: "👨‍💼",
      isSpeaking: true,
      video: "/videos/meeting/participant1.mp4",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "👩‍🦰",
      isSpeaking: false,
      video: "/videos/meeting/participant2.mp4",
    },
    {
      id: 3,
      name: "Mike Chen",
      avatar: "👨‍🔬",
      isSpeaking: false,
      video: "/videos/meeting/participant3.mp4",
    },
  ]);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [distance, setDistance] = useState(100);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentResistance, setCurrentResistance] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState(null);
  const [emojiOpacity, setEmojiOpacity] = useState(0.3);
  const [arduinoConnected, setArduinoConnected] = useState(false);
  const [magnetStrength, setMagnetStrength] = useState(0);
  const videoRef = useRef(null);
  const reactionsRef = useRef(null);

  // 可用的emoji回应
  const availableReactions = [
    { emoji: "👍", name: "Thumbs Up", color: "bg-green-500" },
    { emoji: "👎", name: "Thumbs Down", color: "bg-red-500" },
    { emoji: "👏", name: "Clap", color: "bg-yellow-500" },
    { emoji: "❤️", name: "Heart", color: "bg-red-500" },
    { emoji: "🎉", name: "Party", color: "bg-purple-500" },
    { emoji: "😂", name: "Laugh", color: "bg-yellow-500" },
    { emoji: "😮", name: "Surprised", color: "bg-blue-500" },
    { emoji: "🤔", name: "Thinking", color: "bg-gray-500" },
  ];

  // 添加日志
  const addLog = (type, message, details = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = {
      type,
      message,
      details,
      timestamp,
    };
    setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 9)]);
  };

  // 根据距离计算电磁铁强度 (1-5)
  const calculateMagnetStrength = (distance) => {
    if (distance >= 80) return 1; // 距离很远，弱磁力
    if (distance >= 60) return 2;
    if (distance >= 40) return 3;
    if (distance >= 20) return 4;
    return 5; // 距离很近，强磁力
  };

  // Arduino集成
  useEffect(() => {
    // 连接Arduino服务
    arduinoService.connect().catch((err) => {
      console.error("Failed to connect to Arduino:", err);
    });

    // 监听Arduino连接状态
    const unsubscribeStatus = arduinoService.onStatus((connected) => {
      setArduinoConnected(connected);
      addLog("system", `Arduino ${connected ? "connected" : "disconnected"}`);
    });

    // 监听距离数据
    const unsubscribeDistance = arduinoService.onDistance((realDistance) => {
      setDistance(realDistance);

      // 计算并设置电磁铁强度
      const newStrength = calculateMagnetStrength(realDistance);
      if (newStrength !== magnetStrength) {
        setMagnetStrength(newStrength);
        arduinoService.setMagnetStrength(newStrength);
        addLog(
          "magnet",
          `Magnet strength: Level ${newStrength}`,
          `Distance: ${realDistance.toFixed(1)}% - Force: ${newStrength}`
        );
      }

      // 处理监测模式下的说话状态
      if (isMonitoring) {
        if (realDistance === 0 && !isSpeaking) {
          setIsSpeaking(true);
          addLog(
            "speaking",
            "Started speaking",
            `Resistance: ${currentResistance}`
          );
        } else if (realDistance > 0 && isSpeaking) {
          setIsSpeaking(false);
          addLog("speaking", "Stopped speaking");
        }
      }

      // 处理emoji模式下的透明度
      if (activeEmoji) {
        const opacity = 0.3 + ((100 - realDistance) / 100) * 0.7;
        setEmojiOpacity(opacity);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeDistance();
    };
  }, [
    magnetStrength,
    isMonitoring,
    isSpeaking,
    activeEmoji,
    currentResistance,
  ]);

  // 启动用户摄像头
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.log("摄像头访问失败:", err);
        });
    }
  }, [isCameraOn]);

  // 监测对话功能
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        const resistance = Math.floor(Math.random() * 5) - 5; // -1 到 -5
        setCurrentResistance(resistance);
        addLog(
          "monitor",
          `Conversation resistance: ${resistance}`,
          `Level: ${resistance}`
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  // 距离变化处理
  const handleDistanceChange = (newDistance) => {
    // 只有在Arduino未连接时才允许手动控制
    if (!arduinoConnected) {
      setDistance(newDistance);

      // 计算并设置电磁铁强度
      const newStrength = calculateMagnetStrength(newDistance);
      if (newStrength !== magnetStrength) {
        setMagnetStrength(newStrength);
        addLog(
          "magnet",
          `Manual magnet strength: Level ${newStrength}`,
          `Distance: ${newDistance}% - Force: ${newStrength}`
        );
      }

      if (isMonitoring) {
        // 监测模式：检查是否适合插入对话
        if (newDistance === 0) {
          setIsSpeaking(true);
          addLog(
            "speaking",
            "Started speaking",
            `Resistance: ${currentResistance}`
          );
        }
      } else if (activeEmoji) {
        // Emoji模式：控制透明度
        const opacity = 0.3 + ((100 - newDistance) / 100) * 0.7; // 0.3 到 1.0
        setEmojiOpacity(opacity);
      }
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (isSpeaking) {
      setIsSpeaking(false);
      addLog("system", "Stopped speaking");
    }
    if (!isMicOn) {
      // 开麦时，bar跳到最右边
      setDistance(100);
    }
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  // 切换监测模式
  const toggleMonitoring = () => {
    if (activeEmoji) {
      // 如果当前是emoji模式，先清除
      setActiveEmoji(null);
      setEmojiOpacity(0.3);
      setDistance(100);
    }

    setIsMonitoring(!isMonitoring);
    setCurrentResistance(0);
    setDistance(100);

    if (!isMonitoring) {
      addLog("system", "Conversation monitoring started");
    } else {
      addLog("system", "Conversation monitoring stopped");
    }
  };

  // 发送emoji回应
  const sendReaction = (reaction) => {
    if (isMonitoring) {
      // 如果正在监测，先停止监测
      setIsMonitoring(false);
      setCurrentResistance(0);
      addLog("system", "Monitoring stopped for emoji reaction");
    }

    // 清除之前的emoji
    setReactions([]);

    const newReaction = {
      id: Date.now(),
      emoji: reaction.emoji,
      name: reaction.name,
      sender: "You",
      timestamp: new Date(),
      position: "bottom-right",
    };

    setReactions([newReaction]);
    setActiveEmoji(newReaction);
    setEmojiOpacity(0.3);
    setDistance(100);
    setShowReactions(false);

    // 3秒后移除回应
    setTimeout(() => {
      setReactions([]);
      setActiveEmoji(null);
      setEmojiOpacity(0.3);
      setDistance(100);
    }, 5000);
  };

  // 模拟其他参与者的回应
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && !activeEmoji) {
        const randomReaction =
          availableReactions[
            Math.floor(Math.random() * availableReactions.length)
          ];
        const randomParticipant =
          participants[Math.floor(Math.random() * participants.length)];

        const newReaction = {
          id: Date.now(),
          emoji: randomReaction.emoji,
          name: randomReaction.name,
          sender: randomParticipant.name,
          timestamp: new Date(),
          position:
            randomParticipant.id === 1
              ? "top-left"
              : randomParticipant.id === 2
              ? "top-right"
              : "bottom-left",
        };

        setReactions((prev) => [...prev, newReaction]);

        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 5000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [participants, availableReactions, activeEmoji]);

  // 点击外部区域关闭emoji选择器
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionsRef.current &&
        !reactionsRef.current.contains(event.target)
      ) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactions]);

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
        <div className="bg-black/20 backdrop-blur-sm p-3 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-lg font-semibold">Team Meeting</h1>
            <div className="flex items-center space-x-4">
              <span className="text-white/70 text-sm">4 participants</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Video grid - Fill remaining space */}
        <div className="flex-1 p-2 min-h-0 relative">
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2">
            {/* Participant 1 - Top Left */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden border-2 border-green-400">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                playsInline
                muted={!isAudioOn}
                volume={isAudioOn ? 0.7 : 0}
              >
                <source src={participants[0].video} type="video/mp4" />
              </video>

              {/* Reactions for this participant */}
              <div className="absolute top-2 left-2 z-10">
                <div className="flex flex-wrap gap-1">
                  {reactions
                    .filter((reaction) => reaction.position === "top-left")
                    .map((reaction) => (
                      <div
                        key={reaction.id}
                        className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center reaction-bounce transition-opacity duration-200"
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Participant info */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      {participants[0].name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Speaking</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mute indicator */}
              <div className="absolute top-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                  <span className="text-white text-sm">🎤</span>
                </div>
              </div>
            </div>

            {/* Participant 2 - Top Right */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                playsInline
                muted={!isAudioOn}
                volume={isAudioOn ? 0.7 : 0}
              >
                <source src={participants[1].video} type="video/mp4" />
              </video>

              {/* Reactions for this participant */}
              <div className="absolute top-2 left-2 z-10">
                <div className="flex flex-wrap gap-1">
                  {reactions
                    .filter((reaction) => reaction.position === "top-right")
                    .map((reaction) => (
                      <div
                        key={reaction.id}
                        className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center reaction-bounce transition-opacity duration-200"
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Participant info */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      {participants[1].name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mute indicator */}
              <div className="absolute top-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                  <span className="text-white text-sm">🎤</span>
                </div>
              </div>
            </div>

            {/* Participant 3 - Bottom Left */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                playsInline
                muted={!isAudioOn}
                volume={isAudioOn ? 0.7 : 0}
              >
                <source src={participants[2].video} type="video/mp4" />
              </video>

              {/* Reactions for this participant */}
              <div className="absolute top-2 left-2 z-10">
                <div className="flex flex-wrap gap-1">
                  {reactions
                    .filter((reaction) => reaction.position === "bottom-left")
                    .map((reaction) => (
                      <div
                        key={reaction.id}
                        className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center reaction-bounce transition-opacity duration-200"
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Participant info */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      {participants[2].name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mute indicator */}
              <div className="absolute top-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                  <span className="text-white text-sm">🎤</span>
                </div>
              </div>
            </div>

            {/* My Camera - Bottom Right */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden border-2 border-blue-400">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <div className="text-6xl">👤</div>
                </div>
              )}

              {/* Reactions for my camera */}
              <div className="absolute top-2 left-2 z-10">
                <div className="flex flex-wrap gap-1">
                  {reactions
                    .filter((reaction) => reaction.position === "bottom-right")
                    .map((reaction) => (
                      <div
                        key={reaction.id}
                        className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-2 flex items-center justify-center reaction-bounce transition-opacity duration-200"
                        style={{
                          opacity:
                            activeEmoji?.id === reaction.id
                              ? emojiOpacity
                              : 0.3,
                        }}
                      >
                        <span className="text-2xl">{reaction.emoji}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* My info */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      You (Me)
                    </span>
                    <div className="flex items-center space-x-2">
                      {isCameraOn && (
                        <span className="text-blue-400 text-xs">📹</span>
                      )}
                      {isMicOn ? (
                        isSpeaking ? (
                          <span className="text-green-400 text-xs animate-pulse">
                            🎤 Speaking
                          </span>
                        ) : (
                          <span className="text-blue-400 text-xs">🎤</span>
                        )
                      ) : (
                        <span className="text-red-400 text-xs">🔇</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Camera off indicator */}
              {!isCameraOn && (
                <div className="absolute top-2 right-2">
                  <div className="bg-red-500 backdrop-blur-sm rounded-full p-1.5">
                    <span className="text-white text-sm">📹</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meeting controls */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={toggleMic}
              className={`p-4 rounded-full transition-colors ${
                isMicOn
                  ? isSpeaking
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <span className="text-white text-xl">🎤</span>
            </button>
            <button
              onClick={toggleCamera}
              className={`p-4 rounded-full transition-colors ${
                isCameraOn
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <span className="text-white text-xl">📹</span>
            </button>
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-colors ${
                isAudioOn
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <span className="text-white text-xl">🔊</span>
            </button>

            {/* Monitoring button */}
            <button
              onClick={toggleMonitoring}
              className={`p-4 rounded-full transition-colors ${
                isMonitoring
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              title="Monitor conversation"
            >
              <span className="text-white text-xl">📊</span>
            </button>

            {/* Reactions button */}
            <div className="relative" ref={reactionsRef}>
              <button
                onClick={() => setShowReactions(!showReactions)}
                className={`p-4 rounded-full transition-colors ${
                  showReactions
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <span className="text-white text-xl">😊</span>
              </button>

              {/* Reactions dropdown */}
              {showReactions && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-600 z-[100] min-w-[200px]">
                  <div className="grid grid-cols-4 gap-2">
                    {availableReactions.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => sendReaction(reaction)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                        title={reaction.name}
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform block">
                          {reaction.emoji}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar - System Log and Distance Control */}
      <div className="w-80 bg-gradient-to-b from-gray-800/90 to-blue-900/90 border-l border-gray-700 flex flex-col relative z-50">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-black/20 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white">System Log</h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-300">Distance Control</p>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  arduinoConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              ></div>
              <span className="text-xs text-gray-400">
                {arduinoConnected ? "Arduino" : "Manual"}
              </span>
            </div>
          </div>

          {/* Arduino连接状态 */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    arduinoConnected
                      ? "bg-green-400 animate-pulse"
                      : "bg-red-400"
                  }`}
                ></div>
                <span className="text-xs text-gray-300">
                  {arduinoConnected ? "Arduino Connected" : "Manual Mode"}
                </span>
              </div>
              {arduinoConnected && (
                <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded">
                  LIVE
                </span>
              )}
            </div>

            {/* 磁力强度显示 */}
            {magnetStrength > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Magnet:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        level <= magnetStrength
                          ? "bg-yellow-400"
                          : "bg-gray-600"
                      }`}
                    ></div>
                  ))}
                </div>
                <span className="text-xs font-medium text-yellow-400">
                  Level {magnetStrength}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Log content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.map((log, index) => (
            <div
              key={index}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-600"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">
                  {log.timestamp}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    log.type === "monitor"
                      ? "bg-blue-500/20 text-blue-300"
                      : log.type === "speaking"
                      ? "bg-green-500/20 text-green-300"
                      : log.type === "warning"
                      ? "bg-red-500/20 text-red-300"
                      : log.type === "system"
                      ? log.message.includes("Arduino connected")
                        ? "bg-green-500/20 text-green-300"
                        : log.message.includes("Arduino disconnected")
                        ? "bg-red-500/20 text-red-300"
                        : "bg-purple-500/20 text-purple-300"
                      : log.type === "magnet"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {log.type === "system" && log.message.includes("Arduino")
                    ? "ARDUINO"
                    : log.type.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-white font-medium">{log.message}</p>
              {log.details && (
                <div className="text-xs text-gray-300 mt-1">
                  {log.details.split(" - ").map((part, i) => {
                    const numberMatch = part.match(
                      /(Level|Resistance|Force):\s*([-\d]+)/
                    );
                    if (numberMatch) {
                      const label = numberMatch[1];
                      const value = parseInt(numberMatch[2]);

                      // 为不同类型使用不同颜色
                      let colorClass, sizeClass;
                      if (label === "Force") {
                        colorClass = "text-yellow-300 bg-yellow-500/20";
                        sizeClass = "text-base font-semibold";
                      } else if (label === "Resistance") {
                        colorClass = "text-red-400 bg-red-500/20";
                        sizeClass =
                          Math.abs(value) >= 4
                            ? "text-lg font-bold"
                            : Math.abs(value) >= 2
                            ? "text-base font-semibold"
                            : "text-sm font-medium";
                      } else {
                        colorClass = "text-blue-400 bg-blue-500/20";
                        sizeClass = "text-sm font-medium";
                      }

                      return (
                        <div
                          key={i}
                          className="flex items-center space-x-2 mt-1"
                        >
                          <span>{label}:</span>
                          <span
                            className={`px-2 py-1 rounded-md ${colorClass} ${sizeClass}`}
                          >
                            {label === "Force"
                              ? `Level ${value}`
                              : value > 0
                              ? `+${value}`
                              : value}
                          </span>
                          {label === "Force" && (
                            <span className="text-xs text-yellow-400">
                              (Magnet Strength)
                            </span>
                          )}
                          {label === "Resistance" && value !== 0 && (
                            <span className="text-xs text-gray-400">
                              (
                              {value >= -2
                                ? "Low resistance"
                                : "High resistance"}
                              )
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
        <div className="p-6 border-t border-gray-700 bg-black/30 backdrop-blur-sm">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">
                Distance: {distance.toFixed(1)}%
              </label>
              <div className="flex items-center space-x-2">
                {arduinoConnected && (
                  <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                    Arduino
                  </span>
                )}
                {magnetStrength > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-yellow-400">Magnet:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-1.5 h-1.5 rounded-full ${
                            level <= magnetStrength
                              ? "bg-yellow-400"
                              : "bg-gray-600"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-xs text-yellow-400">
                      L{magnetStrength}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={distance}
              onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
              className="w-full slider"
              disabled={arduinoConnected}
            />
            {isMonitoring && (
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Ready (0%)</span>
                <span>Not Ready (100%)</span>
              </div>
            )}
            {activeEmoji && (
              <div className="flex justify-between text-xs text-blue-400 mt-1">
                <span>Solid (0%)</span>
                <span>Transparent (100%)</span>
              </div>
            )}
            {arduinoConnected && (
              <p className="text-xs text-green-400 mt-1">
                🤖 Controlled by Arduino sensor
              </p>
            )}
          </div>

          {/* Status */}
          <div
            className={`p-3 rounded-lg border-2 ${
              isMonitoring
                ? currentResistance >= -2
                  ? "bg-green-500/20 border-green-400 text-green-300"
                  : "bg-red-500/20 border-red-400 text-red-300"
                : activeEmoji
                ? "bg-blue-500/20 border-blue-400 text-blue-300"
                : "bg-gray-500/20 border-gray-400 text-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isMonitoring
                    ? currentResistance >= -2
                      ? "bg-green-500"
                      : "bg-red-500"
                    : activeEmoji
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isMonitoring
                  ? currentResistance >= -2
                    ? "Good to speak"
                    : "Not suitable (can still speak)"
                  : activeEmoji
                  ? "Emoji active"
                  : "Idle"}
              </span>
            </div>
            {isMonitoring && (
              <p className="text-sm mt-2">
                Resistance: {currentResistance}{" "}
                {currentResistance >= -2 ? "✓" : "⚠️"}
              </p>
            )}
            {activeEmoji && (
              <p className="text-sm mt-2">
                Opacity: {Math.round(emojiOpacity * 100)}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingApp;
