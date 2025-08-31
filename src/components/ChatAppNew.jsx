import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import ContactList from "./chat/ContactList";
import ChatWindow from "./chat/ChatWindow";
import CallModal from "./modals/CallModal";
import MoodModal from "./modals/MoodModal";
import LogPanel from "./log/LogPanel";
import { initialContacts } from "../data/contactsData";
import { statusOptions } from "../data/statusOptions";

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

    // 只记录状态等级信息
    addLog(
      "system",
      `Status check for ${contact.name}`,
      `Level: ${statusLevel}`
    );

    setCallType(type);
    setCallStatus("waiting"); // 等待用户拉动滚动条
    setShowCallModal(true);
    setIsInCall(true);
    setDistance(100); // 重置距离

    // 3秒超时自动退出
    const timeout = setTimeout(() => {
      if (distance > 0) {
        setCallStatus("timeout");
        setIsInCall(false);
        setShowCallModal(false);
        // 不记录超时日志
      }
    }, 3000);

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
  };

  const handleMoodView = () => {
    const contact = contacts.find((c) => c.id === selectedChat);
    const energyLevel = getEnergyLevel(contact.socialEnergy);

    // 只记录社交能量信息
    addLog(
      "energy",
      `Social energy check for ${contact.name}`,
      `Energy: ${contact.socialEnergy}`
    );

    setShowMoodModal(true);
  };

  const handleMoodClose = () => {
    setShowMoodModal(false);
  };

  const handleDistanceChange = (newDistance) => {
    setDistance(newDistance);

    // 如果正在通话且拉到0%，开始通话
    if (isInCall && callStatus === "waiting" && newDistance === 0) {
      if (callTimeout) {
        clearTimeout(callTimeout);
        setCallTimeout(null);
      }

      setCallStatus("dialing");
      // 不记录通话开始日志

      // 开始通话流程，但不自动结束
      setTimeout(() => {
        setCallStatus("connected");
        // 不记录通话连接日志
      }, 2000);
    }

    // 记录距离状态变化
    if (newDistance === 0) {
      addLog("system", "Distance slider at 0% - Ready");
    } else if (newDistance === 100) {
      addLog("system", "Distance slider at 100% - Not ready");
    }
  };

  // 当视频通话连接后，跳转到 MeetingApp
  useEffect(() => {
    if (callStatus === "connected" && callType === "video") {
      if (callTimeout) {
        clearTimeout(callTimeout);
        setCallTimeout(null);
      }
      setShowCallModal(false);
      setIsInCall(false);
      if (onAppSwitch) {
        onAppSwitch("meeting");
      }
    }
  }, [callStatus, callType, onAppSwitch]);

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
