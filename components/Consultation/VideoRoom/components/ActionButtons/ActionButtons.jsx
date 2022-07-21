import { Stack } from 'react-bootstrap';
import { AiFillAudio } from 'react-icons/ai';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { MdCallEnd, MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import { useEffect } from 'react';
import { Downgraded, useState } from '@hookstate/core';

import styles from './ActionButtons.module.css';
import ActionButtonIcon from './ActionButtonIcon';
import store from '../../../../../utils/store';

const ActionButtons = (props) => {

    const globalStore = useState(store);

    const actionButtons = useState([]);

    const audioStreaming = useState(true);
    const videoStreaming = useState(true);

    const handleAudioFeed = () => {
        if(props.userStream) {
            if(props.userStream.getAudioTracks()[0].enabled) {
                props.userStream.getAudioTracks().forEach(track => track.enabled = false);
                audioStreaming.set(false);
            }
            else {
                props.userStream.getAudioTracks().forEach(track => track.enabled = true);
                audioStreaming.set(true);
            }
        }
    }

    const handleVideoFeed = () => {
        if(props.userStream) {
            if(props.userStream.getVideoTracks()[0].enabled) {
                props.userStream.getVideoTracks().forEach(track => track.enabled = false);
                videoStreaming.set(false);
            }
            else {
                props.userStream.getVideoTracks().forEach(track => track.enabled = true);
                videoStreaming.set(true);
            }
        }
    }
    
    useEffect(() => {
        if(props.chatType === "video") {
            actionButtons.set([
                {
                    id: 0,
                    backgroundColor: audioStreaming.get() ? "#36373A" : "#ff0000",
                    icon: audioStreaming.get() ? <FaMicrophone /> : <FaMicrophoneSlash />,
                    action: handleAudioFeed
                },
                {
                    id: 1,
                    backgroundColor: videoStreaming.get() ? "#36373A" : "#ff0000",
                    icon: videoStreaming.get() ? <FaVideo /> : <FaVideoSlash />,
                    action: handleVideoFeed
                },
                {
                    id: 2,
                    backgroundColor: globalStore.isScreenSharing.get() ? "#14bef0" : "#36373A",
                    icon: !globalStore.isScreenSharing.get() ? <MdScreenShare /> : <MdStopScreenShare />,
                    action: !globalStore.isScreenSharing.get() ? props.startScreenShare : props.endScreenShare
                },
                {
                    id: 3,
                    backgroundColor: "#ff0000",
                    icon: <MdCallEnd />,
                    action: props.handleCallEnd
                }
            ]);
        }
        else {
            actionButtons.set([
                {
                    id: 0,
                    icon: <AiFillAudio />
                },
                {
                    id: 3,
                    icon: <MdCallEnd />
                }
            ]);
        }
    }, [audioStreaming.get(), videoStreaming.get(), globalStore.isScreenSharing.get()]);

    return (
        <Stack className={styles.button_container} direction='horizontal' gap={3}>
            {actionButtons.attach(Downgraded).get().map(button =>
                <ActionButtonIcon key={button.id} button={button} />
            )}
        </Stack>
    )
}

export default ActionButtons;