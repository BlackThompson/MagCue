// Initial contact data with status and energy
// 按社交能量从高到低排列：Very High → Very Low
export const initialContacts = [
    // Very High (5) - 磁力等级5
    {
        id: "emma",
        name: "Emma Wilson",
        avatar: "👩‍🎨",
        lastMessage: "The design looks amazing!",
        time: "14:32",
        unread: 0,
        status: "available",
        socialEnergy: 5,
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
        id: "alex",
        name: "Alex Thompson",
        avatar: "👨‍🎤",
        lastMessage: "Great performance tonight!",
        time: "22:15",
        unread: 0,
        status: "sleeping",
        socialEnergy: 5,
        messages: [
            {
                sender: "them",
                text: "How was the concert?",
                time: "22:10",
            },
            { sender: "me", text: "It was incredible!", time: "22:12" },
            { sender: "them", text: "Great performance tonight!", time: "22:15" },
        ],
    },
    // High (3) - 磁力等级3
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
    // Neutral (0) - 磁力等级1
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
    // Low (-3) - 磁力等级3
    {
        id: "mike",
        name: "Mike Chen",
        avatar: "👨‍💼",
        lastMessage: "Can we meet tomorrow?",
        time: "14:46",
        unread: 3,
        status: "busy",
        socialEnergy: -3,
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
    // Very Low (-5) - 磁力等级5
    {
        id: "lisa",
        name: "Lisa Anderson",
        avatar: "👩‍⚕️",
        lastMessage: "The meeting is at 3 PM",
        time: "11:53",
        unread: 0,
        status: "dnd",
        socialEnergy: -5,
        messages: [
            {
                sender: "them",
                text: "Don't forget about the meeting",
                time: "11:50",
            },
            { sender: "me", text: "What time is it?", time: "11:52" },
            { sender: "them", text: "The meeting is at 3 PM", time: "11:53" },
        ],
    },
    // Very Low (-5) - 磁力等级5
    {
        id: "sophia",
        name: "Sophia Rodriguez",
        avatar: "👩‍🏫",
        lastMessage: "The lesson was very helpful",
        time: "16:30",
        unread: 0,
        status: "offline",
        socialEnergy: -5,
        messages: [
            {
                sender: "them",
                text: "Thank you for the tutoring session",
                time: "16:25",
            },
            { sender: "me", text: "You're welcome! How did it go?", time: "16:28" },
            { sender: "them", text: "The lesson was very helpful", time: "16:30" },
        ],
    },
]; 