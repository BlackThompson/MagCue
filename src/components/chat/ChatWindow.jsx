import React, { useState } from "react";
import { Phone, Video, Heart, Send } from "lucide-react";
import { statusOptions } from "../../data/statusOptions";
import {
  getEnergyEmoji,
  getEnergyEmojiColor,
  getEnergyLabel,
} from "../../utils/energyUtils";

const ChatWindow = ({ selectedContact, contacts, onCall, onMoodView }) => {
  const [message, setMessage] = useState("");

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center text-gray-600">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">Select a contact</h3>
          <p className="text-sm">Choose someone to start chatting</p>
        </div>
      </div>
    );
  }

  const contact = contacts.find((c) => c.id === selectedContact);
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

  const getStatusName = (status) => {
    const statusOption = statusOptions.find((option) => option.key === status);
    if (statusOption) {
      // 从label中提取名称（去掉emoji部分）
      const parts = statusOption.label.split(" ");
      if (parts.length > 1) {
        return parts.slice(1).join(" "); // 返回除emoji外的所有部分
      }
    }
    return "Unknown";
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Chat header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg shadow-lg">
              {contact.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 text-sm">
              {getStatusEmoji(contact.status)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {contact.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span>{getStatusEmoji(contact.status)}</span>
                <span>{getStatusName(contact.status)}</span>
              </span>
              <span>•</span>
              <span
                className={`flex items-center space-x-1 ${getEnergyEmojiColor(
                  contact.socialEnergy
                )}`}
              >
                <span>{getEnergyEmoji(contact.socialEnergy)}</span>
                <span>{getEnergyLabel(contact.socialEnergy)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
        {contact.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                msg.sender === "me"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p
                className={`text-xs mt-2 ${
                  msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        {/* Call buttons and mood view */}
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={onMoodView}
            className="p-3 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <Heart size={18} />
          </button>
          <button
            onClick={() => onCall("voice")}
            className="p-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={() => onCall("video")}
            className="p-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <Video size={18} />
          </button>
        </div>

        {/* Message input */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
              rows="1"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
