import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import ContactList from "./chat/ContactList";
import ChatWindow from "./chat/ChatWindow";
import CallModal from "./modals/CallModal";
import MoodModal from "./modals/MoodModal";
import LogPanel from "./log/LogPanel";
import { initialContacts } from "../data/contactsData";
import { statusOptions } from "../data/statusOptions";
import arduinoService from "../utils/arduinoService";

const ChatAppNew = ({
  userStatus,
  setUserStatus,
  socialEnergy,
  setSocialEnergy,
  showSettings,
  setShowSettings,
  onAppSwitch,
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [selectedChat, setSelectedChat] = useState("sarah");
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [contacts, setContacts] = useState(initialContacts);
  const [logs, setLogs] = useState([]);
  const [distance, setDistance] = useState(100);
  const [callTimeout, setCallTimeout] = useState(null);
  const [arduinoConnected, setArduinoConnected] = useState(false);
  const [magnetStrength, setMagnetStrength] = useState(0);

  const addLog = (type, message, details = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = {
      type,
      message,
      details,
      timestamp,
    };
    setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 9)]); // 保持最多10条日志
  };

  const getStatusLevel = (status) => {
    const statusOption = statusOptions.find((option) => option.key === status);
    return statusOption ? statusOption.score : 0;
  };

  const getEnergyLevel = (energy) => {
    if (energy >= 4) return "Very High";
    if (energy >= 2) return "High";
    if (energy >= 0) return "Normal";
    if (energy >= -2) return "Low";
    return "Very Low";
  };

  // Arduino集成
  useEffect(() => {
    console.log("🚀 ChatAppNew: Initializing Arduino connection...");

    // 连接Arduino服务
    arduinoService
      .connect()
      .then(() => {
        console.log("✅ ChatAppNew: Arduino service connected successfully");
        addLog("system", "Backend connection established");
      })
      .catch((err) => {
        console.error(
          "❌ ChatAppNew: Failed to connect to Arduino service:",
          err
        );
        addLog("system", `Backend connection failed: ${err.message}`);
      });

    // 监听Arduino连接状态
    const unsubscribeStatus = arduinoService.onStatus((connected) => {
      console.log("🤖 ChatAppNew: Arduino status changed:", connected);
      setArduinoConnected(connected);
      addLog("system", `Arduino ${connected ? "connected" : "disconnected"}`);
    });

    // 监听距离数据 - 仅用于触发功能，不控制磁力
    const unsubscribeDistance = arduinoService.onDistance((realDistance) => {
      setDistance(realDistance);

      // 如果正在通话且Arduino距离到达0%，开始通话
      if (isInCall && callStatus === "waiting" && realDistance === 0) {
        if (callTimeout) {
          clearTimeout(callTimeout);
          setCallTimeout(null);
        }

        setCallStatus("dialing");
        setTimeout(() => {
          setCallStatus("connected");
        }, 2000);
      }

      // 记录距离变化（每10%变化记录一次，减少日志噪音）
      const roundedDistance = Math.round(realDistance / 10) * 10;
      if (roundedDistance === 0) {
        addLog("system", "Distance at 0% - Ready for action");
      } else if (roundedDistance === 100) {
        addLog("system", "Distance at 100% - Maximum distance");
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeDistance();
    };
  }, [magnetStrength]);

  const handleChatSelect = (contactId) => {
    setSelectedChat(contactId);
    // Mark messages as read
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, unread: 0 } : contact
      )
    );
  };

  const handleCall = (type) => {
    const contact = contacts.find((c) => c.id === selectedChat);
    const statusLevel = getStatusLevel(contact.status);

    // 根据联系人状态设置磁力强度
    const magnetLevel = Math.abs(statusLevel); // 1-5的磁力等级
    setMagnetStrength(magnetLevel);
    arduinoService.setMagnetStrength(magnetLevel);

    // 记录状态等级和磁力信息
    addLog(
      "system",
      `Status check for ${contact.name}`,
      `Level: ${statusLevel}`
    );
    addLog(
      "magnet",
      `Magnet set for call to ${contact.name}`,
      `Status: ${contact.status} - Force: ${magnetLevel}`
    );

    setCallType(type);
    setCallStatus("waiting"); // 等待用户拉动滚动条
    setShowCallModal(true);
    setIsInCall(true);
    setDistance(100); // 重置距离

    // 5秒超时自动退出
    const timeout = setTimeout(() => {
      if (distance > 0) {
        setCallStatus("timeout");
        setIsInCall(false);
        setShowCallModal(false);
        // 超时时关闭磁力
        setMagnetStrength(0);
        arduinoService.setMagnetStrength(0);
        addLog("magnet", "Magnet turned off", "Call timeout");
      }
    }, 5000);

    setCallTimeout(timeout);
  };

  const handleCallClose = () => {
    if (callTimeout) {
      clearTimeout(callTimeout);
      setCallTimeout(null);
    }
    setShowCallModal(false);
    setCallStatus("");
    setIsInCall(false);

    // 通话结束时关闭磁力
    if (magnetStrength > 0) {
      setMagnetStrength(0);
      arduinoService.setMagnetStrength(0);
      addLog("magnet", "Magnet turned off", "Call ended");
    }
  };

  const handleMoodView = () => {
    const contact = contacts.find((c) => c.id === selectedChat);
    const energyLevel = getEnergyLevel(contact.socialEnergy);

    // 根据社交能量设置磁力强度 (转换为1-5等级)
    const magnetLevel = Math.max(
      1,
      Math.min(5, Math.abs(contact.socialEnergy) + 1)
    );
    setMagnetStrength(magnetLevel);
    arduinoService.setMagnetStrength(magnetLevel);

    // 记录社交能量和磁力信息
    addLog(
      "energy",
      `Social energy check for ${contact.name}`,
      `Energy: ${contact.socialEnergy}`
    );
    addLog(
      "magnet",
      `Magnet set for mood view of ${contact.name}`,
      `Energy: ${contact.socialEnergy} - Force: ${magnetLevel}`
    );

    setShowMoodModal(true);
  };

  const handleMoodClose = () => {
    setShowMoodModal(false);

    // 心情窗口关闭时关闭磁力
    if (magnetStrength > 0) {
      setMagnetStrength(0);
      arduinoService.setMagnetStrength(0);
      addLog("magnet", "Magnet turned off", "Mood view closed");
    }
  };

  const handleDistanceChange = (newDistance) => {
    // 保留手动距离控制作为备用（当Arduino未连接时）
    if (!arduinoConnected) {
      setDistance(newDistance);

      // 如果正在通话且拉到0%，开始通话（语音通话和视频通话都一样处理）
      if (isInCall && callStatus === "waiting" && newDistance === 0) {
        if (callTimeout) {
          clearTimeout(callTimeout);
          setCallTimeout(null);
        }

        setCallStatus("dialing");
        setTimeout(() => {
          setCallStatus("connected");
        }, 2000);
      }

      // 记录距离状态变化（减少日志噪音）
      if (newDistance === 0) {
        addLog("system", "Manual distance at 0% - Ready");
      } else if (newDistance === 100) {
        addLog("system", "Manual distance at 100% - Not ready");
      }
    }
  };

  // 移除自动跳转逻辑 - 语音通话和视频通话都保持在ChatApp中

  const selectedContact = contacts.find((c) => c.id === selectedChat);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <Sidebar
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        socialEnergy={socialEnergy}
        setSocialEnergy={setSocialEnergy}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {/* Contact list */}
      <ContactList
        contacts={contacts}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
      />

      {/* Chat window */}
      <ChatWindow
        selectedContact={selectedChat}
        contacts={contacts}
        onCall={handleCall}
        onMoodView={handleMoodView}
      />

      {/* Log panel */}
      <LogPanel
        logs={logs}
        distance={distance}
        onDistanceChange={handleDistanceChange}
        isInCall={isInCall}
        callStatus={callStatus}
        arduinoConnected={arduinoConnected}
        magnetStrength={magnetStrength}
      />

      {/* Call modal */}
      <CallModal
        isOpen={showCallModal}
        onClose={handleCallClose}
        callType={callType}
        callStatus={callStatus}
        contactName={selectedContact?.name || ""}
        isConnected={distance === 0}
      />

      {/* Mood modal */}
      <MoodModal
        isOpen={showMoodModal}
        onClose={handleMoodClose}
        contactName={selectedContact?.name || ""}
        socialEnergy={selectedContact?.socialEnergy || 0}
      />
    </div>
  );
};

export default ChatAppNew;
