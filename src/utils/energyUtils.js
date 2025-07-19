// Social energy utility functions
export const getEnergyColor = (energy) => {
    if (energy >= 4) return "text-green-500";
    if (energy >= 2) return "text-blue-500";
    if (energy >= 0) return "text-yellow-500";
    if (energy >= -2) return "text-orange-500";
    return "text-red-500";
};

export const getEnergyBallColor = (energy) => {
    if (energy >= 4) return "bg-green-500";
    if (energy >= 2) return "bg-blue-500";
    if (energy >= 0) return "bg-yellow-500";
    if (energy >= -2) return "bg-orange-500";
    return "bg-red-500";
};

export const getEnergyEmoji = (energy) => {
    if (energy >= 4) return "⚡";
    if (energy >= 2) return "⚡";
    if (energy >= 0) return "⚡";
    if (energy >= -2) return "⚡";
    return "⚡";
};

export const getEnergyEmojiColor = (energy) => {
    if (energy >= 4) return "text-green-500";
    if (energy >= 2) return "text-blue-500";
    if (energy >= 0) return "text-yellow-500";
    if (energy >= -2) return "text-orange-500";
    return "text-red-500";
};

export const getEnergyLabel = (energy) => {
    if (energy >= 4) return "Very High";
    if (energy >= 2) return "High";
    if (energy >= 0) return "Normal";
    if (energy >= -2) return "Low";
    return "Very Low";
}; 