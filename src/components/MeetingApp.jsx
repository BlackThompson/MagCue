import React, { useState, useRef, useEffect } from "react";
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
          // 如果摄像头不可用，显示默认头像
        });
    }
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  // 发送emoji回应
  const sendReaction = (reaction) => {
    const newReaction = {
      id: Date.now(),
      emoji: reaction.emoji,
      name: reaction.name,
      sender: "You",
      timestamp: new Date(),
      position: "bottom-right", // 指定显示位置
    };

    setReactions((prev) => [...prev, newReaction]);
    setShowReactions(false);

    // 3秒后移除回应
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 3000);
  };

  // 模拟其他参与者的回应
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% 概率发送回应
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

        // 3秒后移除回应
        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 3000);
      }
    }, 5000); // 每5秒检查一次

    return () => clearInterval(interval);
  }, [participants, availableReactions]);

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
                        className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center reaction-bounce"
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
                        className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center reaction-bounce"
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
                        className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center reaction-bounce"
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
                        className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center justify-center reaction-bounce"
                      >
                        <span className="text-lg">{reaction.emoji}</span>
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
                      {isMicOn && (
                        <span className="text-blue-400 text-xs">🎤</span>
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
                  ? "bg-gray-700 hover:bg-gray-600"
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

            {/* <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <span className="text-white text-xl">📊</span>
            </button>
            <button className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
              <span className="text-white text-xl">📞</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingApp;
