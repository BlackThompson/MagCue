import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const MoodModal = ({ isOpen, onClose, contactName, socialEnergy }) => {
  if (!isOpen) return null;

  const getMoodEmoji = (energy) => {
    if (energy >= 5) return "😄";
    if (energy >= 3) return "🙂";
    if (energy >= 0) return "😐";
    if (energy >= -3) return "😔";
    return "😢";
  };

  const getMoodText = (energy) => {
    if (energy >= 5) return "Very Happy";
    if (energy >= 3) return "Happy";
    if (energy >= 0) return "Neutral";
    if (energy >= -3) return "Sad";
    return "Very Sad";
  };

  const getMoodColor = (energy) => {
    if (energy >= 5) return "text-green-500";
    if (energy >= 3) return "text-blue-500";
    if (energy >= 0) return "text-yellow-500";
    if (energy >= -3) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-80">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Mood View</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getMoodEmoji(socialEnergy)}
                </div>

                <h4 className="text-xl font-semibold mb-2">{contactName}</h4>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodModal;
