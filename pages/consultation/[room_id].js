import { useRouter } from "next/router";

import { useState } from "@hookstate/core";
import store from "../../utils/store";
import { isAuthenticated } from "../../utils/auth";
import VideoRoom from "../../components/Consultation/VideoRoom/VideoRoom";
import AudioRoom from "../../components/Consultation/AudioRoom/AudioRoom";
import { useEffect } from "react";

const AVChatRoom = () => {

    const globalStore = useState(store);

    const router = useRouter();
    const authentication = useState(null);

    const roomID = useState(null);
    const customerID = useState(null);
    const roomType = router.query.type;

    useEffect(() => {
        authentication.set(isAuthenticated());
        if(!authentication.get()) {
            router.replace("/?redirect_url="+encodeURIComponent(window.location));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        globalStore.pathname.set("/consultation/room-id");
    }, []);
    
    useEffect(() => {
        roomID.set(router.query.room_id);
        customerID.set(router.query.customer_id)
    }, [router]);

    return (
        <div style={{backgroundColor: "#202124"}} >
            {authentication.get() && roomID.get() && customerID.get() ? roomType === "video" ? <VideoRoom roomID={roomID.get()} customerID={customerID.get()} /> : <AudioRoom roomID={roomID.get()} /> : null}
        </div>
    )
}

export default AVChatRoom;