import React from "react";
import { statusOptions } from "../../data/statusOptions";

const ContactList = ({ contacts, selectedChat, onChatSelect }) => {
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
    <div className="w-80 bg-gradient-to-b from-gray-50 to-blue-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-gray-800">Contacts</h2>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onChatSelect(contact.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
              selectedChat === contact.id
                ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-sm"
                : "hover:bg-white/60 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-xl shadow-md">
                  {contact.avatar}
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 text-lg drop-shadow-sm">
                  {getStatusEmoji(contact.status)}
                </div>
              </div>

              {/* Contact info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">
                    {contact.time}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {contact.lastMessage}
                  </p>
                  {/* Unread count */}
                  {contact.unread > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm font-medium">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
