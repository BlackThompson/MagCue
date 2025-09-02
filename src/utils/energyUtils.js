// Social energy utility functions
export const getEnergyColor = (energy) => {
    if (energy >= 4) return "text-green-500";
    if (energy >= 2) return "text-blue-500";
    if (energy >= 0) return "text-yellow-500";
    if (energy >= -2) return "text-orange-500";
    return "text-red-500";
};

export const getEnergyBallColor = (energy) => {
    if (energy >= 5) return "bg-green-500";
    if (energy >= 3) return "bg-blue-500";
    if (energy >= 0) return "bg-yellow-500";
    if (energy >= -3) return "bg-orange-500";
    return "bg-red-500";
};

export const getEnergyEmoji = (energy) => {
    if (energy >= 5) return "⚡";
    if (energy >= 3) return "⚡";
    if (energy >= 0) return "⚡";
    if (energy >= -3) return "⚡";
    return "⚡";
};

export const getEnergyEmojiColor = (energy) => {
    if (energy >= 5) return "text-green-500";
    if (energy >= 3) return "text-blue-500";
    if (energy >= 0) return "text-yellow-500";
    if (energy >= -3) return "text-orange-500";
    return "text-red-500";
};

export const getEnergyLabel = (energy) => {
    if (energy >= 5) return "Very High";
    if (energy >= 3) return "High";
    if (energy >= 0) return "Neutral";
    if (energy >= -3) return "Low";
    return "Very Low";
}; 