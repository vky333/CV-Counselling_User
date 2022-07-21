import { useState } from '@hookstate/core';
import { useEffect, useRef } from 'react';

import store from '../../../../../utils/store';
import styles from '../UserVideo/UserVideo.module.css';

const PeerVideo = (props) => {

    const ref = useRef(null);
    const globalStore = useState(store);

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    }, [props]);

    return (
        <div style={{height: globalStore.video_grid_height.get()}} className={styles.videogrid}>
            <video ref={ref} className='rounded' width="100%" height="99%" playsInline autoPlay />
            <p className={styles.user_name}>{props.peerName}</p>
        </div>
    );
}

export default PeerVideo;