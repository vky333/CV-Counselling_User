import { Downgraded, useState } from '@hookstate/core';
import { useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import Peer from "simple-peer";
import Image from 'next/image';
import { useRouter } from 'next/router';

import { getCustomerDetails } from '../../../pages/api/customer';
import { verifyConsultation } from '../../../pages/api/consultation';
import { getProfileDetails } from '../../../pages/api/counsellor';
import { getUser } from '../../../utils/auth';
import store from '../../../utils/store';
import VideoModalContent from '../modals/VideoModalContent';
import styles from './VideoRoom.module.css';
import ScreenShare from './components/ScreenShare/ScreenShare';
import UserVideo from './components/UserVideo/UserVideo';
import PeerVideo from './components/PeerVideo/PeerVideo';
import ActionButtons from './components/ActionButtons/ActionButtons';

const VideoRoom = (props) => {

    const router = useRouter();

    const consultationVerified = useState(false);

    const globalStore = useState(store);

    const modalContent = useState(null);
    const showModal = useState(false);
    const callStatus = useState("");

    const sPeers = useState([]);

    const mediaConstraints = {
        "audio": true,
        "video": {
            width: { min: 160, ideal: 320, max: 640 },
            height: { min: 120, ideal: 240, max: 480 },
        }
    };

    const userVideoRef = useRef(null);
    const screenShareRef = useRef(null);
    
    const userStream = useState(null);
    const peersRef = useRef([]);

    const customer = useState(null);
    const counsellor = useState(null);

    useEffect(() => {
        getProfileDetails(getUser()).then((response) => counsellor.set(response.data.description[0]));
        getCustomerDetails(props.customerID).then((response) => customer.set(response.data[0]));
    }, []);

    useEffect(() => {
        if(!globalStore.isScreenSharing.get() && sPeers.attach(Downgraded).get().length === 0) {
            globalStore.video_grid_height.set("95%");
        }
        else {
            globalStore.video_grid_height.set("fit-content");
        }
    }, [sPeers.attach(Downgraded).get()]);

    useEffect(() => {
        
        var counsellorID = getUser();
        var customerID = props.customerID;
        var roomID = props.roomID;

        verifyConsultation(counsellorID, customerID, roomID, "video_room_id")
        .then(() => {
            consultationVerified.set(true);
        })
        .catch(() => {
            console.log("Meeting marked as complete or invalid link")
        })
    }, []);

    useEffect(() => {
        if(consultationVerified.get()) {

            if(!router.query.acceptor) {
                setupModal("video-call-modal");
            }

            if(globalStore.socketRef.attach(Downgraded).get()) {
                globalStore.socketRef.attach(Downgraded).get().current.emit("get-availablity", getUser(), "COUNSELLOR", parseInt(props.customerID), "CUSTOMER");

                globalStore.socketRef.attach(Downgraded).get().current.on("call-status-update", (status) => {
                    if(status === "accepted") {
                        showModal.set(false);
                    }
                    else {
                        iziToast.error({
                            title: "Call declined",
                            message: "Your call has been declined",
                            position: "topRight",
                            timeout: 2000,
                            onClosing: () => {
                                window.location.href = "/dashboard/consultations";
                            }
                        });
                        showModal.set(false);
                    }
                });
            }

            if(globalStore.directLinkVideoCallAvailability.get()) {
                if(!router.query.acceptor) {
                    globalStore.socketRef.attach(Downgraded).get().current.emit("new-call", getUser(), "COUNSELLOR", counsellor.attach(Downgraded).get() ? counsellor.attach(Downgraded).get().name : '', counsellor.attach(Downgraded).get() ? counsellor.attach(Downgraded).get().profile_image : '/images/profile.png', "video", props.roomID, parseInt(props.customerID), "CUSTOMER");
                }
                globalStore.isIdle.set(false);
                callStatus.set("Ringing...");
            }
            else if(globalStore.directLinkVideoCallAvailability.get() === false) {
                callStatus.set("Customer is unavailable at the moment");
            }
            else {
                callStatus.set("Connecting...");
            }
        }
    }, [consultationVerified.get(), globalStore.directLinkVideoCallAvailability.get(), callStatus.get()]);

    useEffect(() => {
        if(consultationVerified.get()) {

            navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {
                userVideoRef.current.srcObject = stream;
                userStream.set(stream);

                globalStore.socketRef.attach(Downgraded).get().current.emit("join room", props.roomID);
                globalStore.socketRef.attach(Downgraded).get().current.on("all users", users => {
                    const peers = [];

                    users.forEach(userID => {
                        const peer = createPeer(userID, globalStore.socketRef.attach(Downgraded).get().current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peerName: customer.attach(Downgraded).get() ? customer.attach(Downgraded).get().name : '',
                            peerType: 'normal',
                            peer
                        });
                        peers.push({
                            peerID: userID,
                            peerName: customer.attach(Downgraded).get() ? customer.attach(Downgraded).get().name : '',
                            peerType: 'normal',
                            peer
                        });
                    });
                    sPeers.set(peers);
                });

                globalStore.socketRef.attach(Downgraded).get().current.on("user joined", payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peerName: customer.attach(Downgraded).get() ? customer.attach(Downgraded).get().name : '',
                        peerType: 'normal',
                        peer
                    });
                    
                    const peerObj = {
                        peerID: payload.callerID,
                        peerName: customer.attach(Downgraded).get() ? customer.attach(Downgraded).get().name : '',
                        peerType: 'normal',
                        peer,
                    }
                    
                    sPeers.set(users => [...users, peerObj]);
                });

                globalStore.socketRef.attach(Downgraded).get().current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });
                
                globalStore.socketRef.attach(Downgraded).get().current.on("user left", id => {
                    const peerObj = peersRef.current.find(p => p.peerID === id);
                    if(peerObj) {
                        peerObj.peer.destroy();
                    }
                    const peers = peersRef.current.filter(p => p.peerID !== id);
                    peersRef.current = peers;
                    sPeers.set(peers);
                });
            });
        }
    }, [consultationVerified.get()]);

    const startScreenShare = () => {
        navigator.mediaDevices.getDisplayMedia({ cursor: true, video: true }).then(stream2 => {

            screenShareRef.current.srcObject = stream2;
            const screenTrack = stream2.getVideoTracks()[0];
            
            sPeers.attach(Downgraded).get().forEach(peer => {
                peer.peer.replaceTrack(userStream.attach(Downgraded).get().getVideoTracks()[0], screenTrack, userStream.attach(Downgraded).get());
            });
            
            globalStore.isScreenSharing.set(true);
            screenTrack.onended = function() {
                endScreenShare();
            }
        });
    }

    const endScreenShare = () => {
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(newStream => {
            sPeers.attach(Downgraded).get().forEach(peer => {
                peer.peer.replaceTrack(userStream.attach(Downgraded).get().getVideoTracks()[0], newStream.getVideoTracks()[0], userStream.attach(Downgraded).get());
            });
        });
        globalStore.isScreenSharing.set(false);
    }

    const handleCallEnd = () => {
        window.location.href = "/dashboard/consultations";
    }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        
        peer.on("signal", signal => {
            globalStore.socketRef.attach(Downgraded).get().current.emit("sending signal", { userToSignal, callerID, signal })
        });
        
        return peer;
    }
    
    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            config: { 
                iceServers: [
                    {
                        urls: 'stun:stun.l.google.com:19302'
                    },
                    {
                        urls: 'turn:43.204.30.91:3478?transport=tcp',
                        username: "cv-admin",
                        credential: "cv-admin"
                    }
                ]
            },
            trickle: false,
            stream,
        });
        
        peer.on("signal", signal => {
          globalStore.socketRef.attach(Downgraded).get().current.emit("returning signal", { signal, callerID })
        });
        
        peer.signal(incomingSignal);
        return peer;
    }

    function VideoCallModal(props) {
        return (
            <Modal {...props}
            size="md"
            backdrop="static"
            centered>
                {modalContent.attach(Downgraded).get()}
            </Modal>
        );
    }

    function setupModal(key) {
        if(key === "video-call-modal") {
            modalContent.set(<VideoModalContent closeModal={() => showModal.set(false)} customer={customer.attach(Downgraded).get()} counsellor={counsellor.attach(Downgraded).get()} callStatus={callStatus.get()} />);
            showModal.set(true);
        }
    }

    return (
        <div>
            <div className={styles.cv_logo}>
                <Image src="/images/logo.png" width="100px" height="45px" />
            </div>
            <div className={`${styles.video_room} ${globalStore.isScreenSharing.get() ? 'd-flex align-items-center' : ''} pt-3`}>
                <ScreenShare visible={globalStore.isScreenSharing.get() ? "block" : "none"} userName="You are presenting" videoRef={screenShareRef} />
                <div className={`${styles.video_flex} ${globalStore.isScreenSharing.get() ? styles.side_user_video : ''}`}>
                    <UserVideo userName={counsellor.attach(Downgraded).get() ? counsellor.attach(Downgraded).get().name : ''} videoRef={userVideoRef} />
                    {sPeers.attach(Downgraded).get().filter(peer => peer.peerType === 'normal').map(sPeer =>
                        <PeerVideo key={sPeer.peerID} peer={sPeer.peer} peerName={sPeer.peerName} />
                    )}
                </div>
            </div>
            {userStream.attach(Downgraded).get() ?
                <ActionButtons chatType="video" userStream={userStream.attach(Downgraded).get()} startScreenShare={startScreenShare} endScreenShare={endScreenShare} handleCallEnd={handleCallEnd} />
                :
                null
            }
            <VideoCallModal show={showModal.get()} onHide={() => showModal.set(false)} />
        </div>
    )
}

export default VideoRoom;