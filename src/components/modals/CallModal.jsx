import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, X, Wifi, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const CallModal = ({
  isOpen,
  onClose,
  callType,
  callStatus,
  contactName,
  isConnected = false,
}) => {
  // 移除干扰的useEffect - 通话状态由ChatAppNew控制

  if (!isOpen) return null;

  const getCallIcon = () => {
    return callType === "video" ? <Video size={48} /> : <Phone size={48} />;
  };

  const getStatusText = () => {
    switch (callStatus) {
      case "waiting":
        return "Pull Distance Slider to 0%";
      case "dialing":
        return "Calling...";
      case "connected":
        return "Connected";
      case "timeout":
        return "Call timeout";
      default:
        return "Initiating call...";
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case "waiting":
        return "text-orange-500";
      case "dialing":
        return "text-blue-500";
      case "connected":
        return "text-green-500";
      case "timeout":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getStatusIcon = () => {
    switch (callStatus) {
      case "waiting":
        return <Wifi size={24} className="text-orange-500" />;
      case "timeout":
        return <Clock size={24} className="text-red-500" />;
      default:
        return <Phone size={24} className="text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-96">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {callType === "video" ? "Video Call" : "Voice Call"}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-500">{getCallIcon()}</div>
                </div>

                <h4 className="text-xl font-semibold mb-2">{contactName}</h4>
                <p className={`text-lg ${getStatusColor()}`}>
                  {getStatusText()}
                </p>

                {/* Status Icon */}
                <div className="mt-4 flex items-center justify-center space-x-2">
                  {getStatusIcon()}
                  <span className={`text-sm ${getStatusColor()}`}>
                    {callStatus === "waiting" &&
                      "Pull slider to 0% to start call"}
                    {callStatus === "timeout" && "Time expired"}
                    {callStatus === "connected" && "Call in progress"}
                  </span>
                </div>

                {callStatus === "waiting" && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700">
                      Pull the distance slider to 0% to start the call. You have
                      8 seconds.
                    </p>
                  </div>
                )}

                {callStatus === "dialing" && isConnected && (
                  <div className="mt-4">
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}

                {callStatus === "connected" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      📞 Call is connected with {contactName}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {callType === "video"
                        ? "Video call in progress"
                        : "Voice call in progress"}
                    </p>
                  </div>
                )}

                {callStatus === "timeout" && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">
                      Call timeout. You did not pull the slider to 0% in time.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                  {callStatus === "connected" ? (
                    <Button
                      onClick={onClose}
                      className="px-6 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X size={16} className="mr-2" />
                      Hang Up
                    </Button>
                  ) : (
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="px-6"
                    >
                      {callStatus === "timeout" ? "Close" : "Cancel"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CallModal;
