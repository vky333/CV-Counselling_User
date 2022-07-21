import { Downgraded, useState } from '@hookstate/core';
import Image from 'next/image';
import { MdCallEnd } from 'react-icons/md';
import store from '../../../utils/store';

import styles from './VideoModalContent.module.css';

const VideoModalContent = (props) => {

    const globalStore = useState(store);

    const handleCallEnd = () => {
        globalStore.socketRef.attach(Downgraded).get().current.emit("cancel-my-call-notification", props.customer.id, "CUSTOMER", props.counsellor.name);
        
        props.closeModal();
        window.location.href = "/dashboard/consultations";
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.image_wrapper}>
                {props.customer && props.customer.profile_image !== "" ?
                <Image src={props.customer.profile_image} width={140} height={140} />
                :
                <Image src="/images/profile.png" width={140} height={140} />
                }
            </div>
            <div className={styles.counsellor_name}>
                {props.customer && props.customer.name}
            </div>
            <div className={`mt-5 ${styles.call_status}`}>
                {props.callStatus}
            </div>
            <div className={`mt-5 ${styles.call_status}`}>
                {props.callStatus === "Customer is unavailable at the moment" ?
                <div onClick={() => window.location.href = '/user/consultations'} className={styles.unavailable}>
                    Don't worry! Leave a message right now
                </div>
                :
                <div className={styles.end_Call}>
                    <MdCallEnd onClick={handleCallEnd} />
                </div>
                }
            </div>
        </div>
    )
}

export default VideoModalContent;