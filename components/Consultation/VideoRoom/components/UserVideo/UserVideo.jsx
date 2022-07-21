import { useState } from '@hookstate/core';

import store from '../../../../../utils/store';
import styles from './UserVideo.module.css';

const UserVideo = (props) => {

  const globalStore = useState(store);

  return (
    <div style={{height: globalStore.video_grid_height.get()}} className={styles.videogrid}>
        <video ref={props.videoRef} className='rounded' width="100%" height="99%" playsInline muted autoPlay />
        <p className={styles.user_name}>{props.userName}</p>
    </div>
  )
}

export default UserVideo