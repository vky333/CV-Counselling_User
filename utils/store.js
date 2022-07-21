import { createState } from "@hookstate/core";

const store = createState({
    authType: true,
    activeSidebarItem: "",
    activeConsultation: {
        id: -1,
        unread: false,
        image: "",
        name: "",
        lastMessage: "",
        start_time: "",
        video_room_id: "",
        audio_room_id: "",
        lastMessageTime: "",
        customer_id: -1,
        finished: false,
    },
    lowerLimit: 1,
    upperLimit: 100,
    currentChatList: [],
    currentChatMessages: [],
    currentChatAttachments: [],
    socketRef: null,
    pathname: "/",
    video_grid_height: "fit-content",
    currentCounsellorAvailability: false,
    directLinkVideoCallAvailability: null,
    isScreenSharing: false,
    isIdle: true,
});

export default store;