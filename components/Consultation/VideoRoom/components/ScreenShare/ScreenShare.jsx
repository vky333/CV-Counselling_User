import { useState } from '@hookstate/core';

import styles from './ScreenShare.module.css';
import styles2 from '../UserVideo/UserVideo.module.css';
import store from '../../../../../utils/store';

const ScreenShare = (props) => {

    const globalStore = useState(store);

    return (
        <div style={{display: props.visible}} className={styles.screen_share_video}>
            <div style={{height: globalStore.video_grid_height.get()}} className={styles2.videogrid}>
                <video ref={props.videoRef} className='rounded' width="100%" height="99%" playsInline muted autoPlay />
                <p className={styles2.user_name}>{props.userName}</p>
            </div>
        </div>
    )
}

export default ScreenShare;