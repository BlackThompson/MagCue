import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  Search,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Heart,
  Send,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const ChatApp = () => {
  const [userStatus, setUserStatus] = useState("online");
  const [socialEnergy, setSocialEnergy] = useState(0);
  const [isInCall, setIsInCall] = useState(false);
  const [selectedChat, setSelectedChat] = useState("sarah");
  const [showSettings, setShowSettings] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [showMoodModal, setShowMoodModal] = useState(false);

  // User status configuration
  const statusOptions = [
    {
      key: "online",
      name: "Online",
      description: "User is currently active and can freely answer calls",
      score: 1,
      color: "text-green-500",
      emoji: "🟢",
    },
    {
      key: "available",
      name: "Available",
      description: "User is available, might be on phone, suitable for calls",
      score: 2,
      color: "text-yellow-500",
      emoji: "🟡",
    },
    {
      key: "away",
      name: "Away",
      description: "User has been away from device for a while",
      score: 3,
      color: "text-orange-500",
      emoji: "🟠",
    },
    {
      key: "busy",
      name: "Busy",
      description:
        "User is working or handling things, not recommended to disturb",
      score: 3,
      color: "text-red-500",
      emoji: "🔴",
    },
    {
      key: "sleeping",
      name: "Sleeping",
      description: "User set to rest mode, not recommended to disturb",
      score: 4,
      color: "text-purple-500",
      emoji: "💤",
    },
    {
      key: "dnd",
      name: "Do Not Disturb",
      description:
        "User doesn't want to be disturbed, system should avoid call alerts",
      score: 4,
      color: "text-red-600",
      emoji: "⛔",
    },
    {
      key: "oncall",
      name: "On a Call",
      description: "User is currently in voice or video call",
      score: 5,
      color: "text-blue-500",
      emoji: "📞",
    },
    {
      key: "offline",
      name: "Offline",
      description: "User not connected to network or inactive for long time",
      score: 5,
      color: "text-gray-500",
      emoji: "⚫",
    },
  ];

  // Contact data with status and energy
  const [contacts, setContacts] = useState([
    {
      id: "sarah",
      name: "Sarah Johnson",
      avatar: "👩‍🦰",
      lastMessage: "How's your day going?",
      time: "13:25",
      unread: 0,
      status: "online",
      socialEnergy: 3,
      messages: [
        { sender: "them", text: "Hey! How are you doing?", time: "13:20" },
        {
          sender: "me",
          text: "I'm doing great! How about you?",
          time: "13:22",
        },
        {
          sender: "them",
          text: "Pretty good! Just finished my work",
          time: "13:23",
        },
        {
          sender: "me",
          text: "That's awesome! What are you up to now?",
          time: "13:24",
        },
        { sender: "them", text: "How's your day going?", time: "13:25" },
      ],
    },
    {
      id: "mike",
      name: "Mike Chen",
      avatar: "👨‍💼",
      lastMessage: "Can we meet tomorrow?",
      time: "14:46",
      unread: 3,
      status: "busy",
      socialEnergy: -1,
      messages: [
        {
          sender: "them",
          text: "Hi Mike! Are you free tomorrow?",
          time: "14:40",
        },
        { sender: "me", text: "Let me check my schedule", time: "14:42" },
        { sender: "them", text: "I have a project to discuss", time: "14:44" },
        { sender: "me", text: "Sure, what time works for you?", time: "14:45" },
        { sender: "them", text: "Can we meet tomorrow?", time: "14:46" },
      ],
    },
    {
      id: "emma",
      name: "Emma Wilson",
      avatar: "👩‍🎨",
      lastMessage: "The design looks amazing!",
      time: "14:32",
      unread: 0,
      status: "available",
      socialEnergy: 4,
      messages: [
        {
          sender: "them",
          text: "I just finished the new design",
          time: "14:30",
        },
        { sender: "me", text: "Can you send me a preview?", time: "14:31" },
        { sender: "them", text: "The design looks amazing!", time: "14:32" },
      ],
    },
    {
      id: "david",
      name: "David Brown",
      avatar: "👨‍🔬",
      lastMessage: "Thanks for the help! 😊",
      time: "12:24",
      unread: 0,
      status: "away",
      socialEnergy: 0,
      messages: [
        { sender: "them", text: "I need help with the code", time: "12:20" },
        { sender: "me", text: "What's the issue?", time: "12:22" },
        { sender: "them", text: "Thanks for the help! 😊", time: "12:24" },
      ],
    },
    {
      id: "lisa",
      name: "Lisa Anderson",
      avatar: "👩‍⚕️",
      lastMessage: "The meeting is at 3 PM",
      time: "11:53",
      unread: 0,
      status: "dnd",
      socialEnergy: -3,
      messages: [
        {
          sender: "them",
          text: "Don't forget about the meeting",
          time: "11:50",
        },
        { sender: "me", text: "What time is it again?", time: "11:52" },
        { sender: "them", text: "The meeting is at 3 PM", time: "11:53" },
      ],
    },
    {
      id: "james",
      name: "James Taylor",
      avatar: "👨‍🎤",
      lastMessage: "The concert was incredible!",
      time: "11:19",
      unread: 0,
      status: "sleeping",
      socialEnergy: -5,
      messages: [
        { sender: "them", text: "Did you go to the concert?", time: "11:15" },
        { sender: "me", text: "Yes! It was amazing", time: "11:17" },
        { sender: "them", text: "The concert was incredible!", time: "11:19" },
      ],
    },
    {
      id: "phone",
      name: "My Phone",
      avatar: "📱",
      lastMessage: "487145030421...",
      time: "10:59",
      unread: 0,
      status: "online",
      socialEnergy: 0,
      messages: [
        { sender: "them", text: "System notification", time: "10:55" },
        { sender: "me", text: "Checking device status", time: "10:57" },
        { sender: "them", text: "487145030421...", time: "10:59" },
      ],
    },
    {
      id: "alex",
      name: "Alex Rodriguez",
      avatar: "👨‍💻",
      lastMessage: "The code is working perfectly!",
      time: "09:35",
      unread: 0,
      status: "oncall",
      socialEnergy: 2,
      messages: [
        { sender: "them", text: "I fixed the bug", time: "09:30" },
        { sender: "me", text: "Great job! How did you do it?", time: "09:32" },
        {
          sender: "them",
          text: "The code is working perfectly!",
          time: "09:35",
        },
      ],
    },
  ]);

  const currentStatus = statusOptions.find((s) => s.key === userStatus);
  const currentContact = contacts.find((c) => c.id === selectedChat);
  const currentContactStatus = statusOptions.find(
    (s) => s.key === currentContact?.status
  );

  const handleChatSelect = (contactId) => {
    setSelectedChat(contactId);
    // Clear unread messages
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId ? { ...contact, unread: 0 } : contact
      )
    );
  };

  const handleCall = (type) => {
    setCallType(type);
    setShowCallModal(true);
    setCallStatus("calling");

    // Simulate call process
    setTimeout(() => {
      setCallStatus("connecting");
      setTimeout(() => {
        setCallStatus("connected");
        setTimeout(() => {
          setCallStatus("ended");
          setTimeout(() => {
            setShowCallModal(false);
            setCallStatus("");
          }, 1000);
        }, 3000);
      }, 2000);
    }, 1000);
  };

  const handleSocialEnergyChange = (e) => {
    setSocialEnergy(parseInt(e.target.value));
  };

  const getEnergyColor = (energy) => {
    if (energy >= 4) return "text-green-500";
    if (energy >= 2) return "text-blue-500";
    if (energy >= 0) return "text-yellow-500";
    if (energy >= -2) return "text-orange-500";
    return "text-red-500";
  };

  const getEnergyBallColor = (energy) => {
    if (energy >= 4) return "bg-green-500";
    if (energy >= 2) return "bg-blue-500";
    if (energy >= 0) return "bg-yellow-500";
    if (energy >= -2) return "bg-orange-500";
    return "bg-red-500";
  };

  const getEnergyEmoji = (energy) => {
    if (energy >= 4) return "⚡";
    if (energy >= 2) return "⚡";
    if (energy >= 0) return "⚡";
    if (energy >= -2) return "⚡";
    return "⚡";
  };

  const getEnergyEmojiColor = (energy) => {
    if (energy >= 4) return "text-green-500";
    if (energy >= 2) return "text-blue-500";
    if (energy >= 0) return "text-yellow-500";
    if (energy >= -2) return "text-orange-500";
    return "text-red-500";
  };

  const getEnergyLabel = (energy) => {
    if (energy >= 4) return "Very High";
    if (energy >= 2) return "High";
    if (energy >= 0) return "Normal";
    if (energy >= -2) return "Low";
    return "Very Low";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      {/* Left sidebar */}
      <div className="w-16 bg-white shadow-lg flex flex-col items-center py-4 space-y-6 relative">
        {/* CHAT Logo */}
        <div className="text-2xl font-bold text-blue-500">CHAT</div>

        {/* User avatar and settings */}
        <div className="relative">
          <div
            className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
            onClick={() => setShowSettings(!showSettings)}
          >
            👤
          </div>

          {/* Settings dropdown */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-16 top-0 w-80 bg-white rounded-lg shadow-xl border p-4 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Personal Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <ChevronUp size={16} />
                </Button>
              </div>

              {/* User status selection */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">My Status</h4>
                <select
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status.key} value={status.key}>
                      {status.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {currentStatus?.description}
                </p>
              </div>

              {/* Social energy slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">My Social Energy</h4>
                  <span className="text-sm text-gray-500">{socialEnergy}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  value={socialEnergy}
                  onChange={handleSocialEnergyChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>-5</span>
                  <span>0</span>
                  <span>+5</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getEnergyLabel(socialEnergy)} -{" "}
                  {socialEnergy === -5 && "Extremely Tired"}
                  {socialEnergy === -4 && "Very Tired"}
                  {socialEnergy === -3 && "Tired"}
                  {socialEnergy === -2 && "A Bit Tired"}
                  {socialEnergy === -1 && "Slightly Tired"}
                  {socialEnergy === 0 && "Normal"}
                  {socialEnergy === 1 && "A Bit Excited"}
                  {socialEnergy === 2 && "Excited"}
                  {socialEnergy === 3 && "Very Excited"}
                  {socialEnergy === 4 && "Extremely Excited"}
                  {socialEnergy === 5 && "Off the Charts"}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Functional icons */}
        <div className="flex flex-col space-y-4">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500 cursor-pointer">
            <MessageCircle size={20} />
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Middle panel - Contact list */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                <Plus size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat === contact.id
                  ? "bg-pink-50 border-l-4 border-pink-500"
                  : ""
              }`}
              onClick={() => handleChatSelect(contact.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                  {contact.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {contact.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {contact.lastMessage}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs">
                      {
                        statusOptions.find((s) => s.key === contact.status)
                          ?.emoji
                      }
                    </span>
                    <span
                      className={`text-xs ${getEnergyEmojiColor(
                        contact.socialEnergy
                      )}`}
                    >
                      {getEnergyEmoji(contact.socialEnergy)}
                    </span>
                  </div>
                </div>
                {contact.unread > 0 && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    {contact.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right chat window */}
      <div className="flex-1 bg-gradient-to-b from-pink-50 to-green-50 flex flex-col">
        {/* Chat header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              {currentContact?.avatar}
            </div>
            <div>
              <h2 className="font-medium text-gray-900">
                {currentContact?.name}
              </h2>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${currentContactStatus?.color}`}>
                  {currentContactStatus?.emoji} {currentContactStatus?.name}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span
                  className={`text-sm ${getEnergyColor(
                    currentContact?.socialEnergy
                  )}`}
                >
                  <div className="inline-flex items-center space-x-1">
                    <span
                      className={getEnergyEmojiColor(
                        currentContact?.socialEnergy
                      )}
                    >
                      {getEnergyEmoji(currentContact?.socialEnergy)}
                    </span>
                    <span>
                      Energy: {getEnergyLabel(currentContact?.socialEnergy)}
                    </span>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {currentContact?.messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.sender === "me" ? "justify-end" : ""
                }`}
              >
                {message.sender === "them" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                    {currentContact.avatar}
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 shadow-sm max-w-xs ${
                    message.sender === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "me"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
                {message.sender === "me" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    👤
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white p-4 border-t">
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoodModal(true)}
            >
              <Heart size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCall("voice")}
            >
              <Phone size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCall("video")}
            >
              <Video size={16} />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              <Send size={16} className="mr-1" />
              Send
              <ChevronDown size={12} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Call modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              {currentContact?.avatar}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {currentContact?.name}
            </h3>

            {callStatus === "calling" && (
              <div className="space-y-4">
                <div className="text-gray-600">Dialing...</div>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}

            {callStatus === "connecting" && (
              <div className="space-y-4">
                <div className="text-green-600">Connecting...</div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
              </div>
            )}

            {callStatus === "connected" && (
              <div className="space-y-4">
                <div className="text-green-600 font-semibold">
                  {callType === "voice" ? "Voice Call" : "Video Call"}
                </div>
                <div className="text-sm text-gray-500">Duration: 00:03</div>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {callStatus === "ended" && (
              <div className="space-y-4">
                <div className="text-gray-600">Call Ended</div>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowCallModal(false)}
                className="px-6"
              >
                <X size={16} className="mr-2" />
                Hang Up
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mood modal */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              {currentContact?.avatar}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {currentContact?.name}
            </h3>

            <div className="space-y-4">
              <div className="text-gray-600 mb-4">Current Mood</div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-3xl">{currentContactStatus?.emoji}</div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {currentContactStatus?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentContactStatus?.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <div
                  className={`w-4 h-4 rounded-full ${getEnergyBallColor(
                    currentContact?.socialEnergy
                  )}`}
                ></div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    Social Energy
                  </div>
                  <div className="text-sm text-gray-500">
                    {getEnergyLabel(currentContact?.socialEnergy)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={() => setShowMoodModal(false)} className="px-6">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
