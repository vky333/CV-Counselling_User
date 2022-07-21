import { Downgraded, useState } from '@hookstate/core';
import Image from 'next/image';
import { Button } from 'react-bootstrap';
import { sendBusyCallDeclined } from '../../../pages/api/counsellor';
import { getUser } from '../../../utils/auth';

import store from '../../../utils/store';
import styles from './BusyCallModalContent.module.css';

const BusyCallModalContent = (props) => {

    const globalStore = useState(store);

    const handleAcceptCall = () => {

        globalStore.socketRef.attach(Downgraded).get().current.emit("accept-initiate-call", props.data.customer_id, "CUSTOMER");
        props.closeModal();

        const link = `/consultation/${props.data.room_id}?type=${props.data.type}&customer_id=${props.data.customer_id}&acceptor=true`;
        window.location.href = link;
    }

    const handleEndCall = () => {
        globalStore.socketRef.attach(Downgraded).get().current.emit("reject-end-call", props.data.customer_id, "CUSTOMER");

        let formData = new FormData();
        formData.append("counsellor_id", getUser());
        formData.append("customer_id", props.data.customer_id);
        formData.append("category", "chat-prompt");
        formData.append("sender_type", "SYSTEM");
        formData.append("message", "Sorry, the counsellor is busy on another session with a student. They will connect with you shortly.");
        formData.append("media", "");

        sendBusyCallDeclined(formData)
        .then(() => {
            props.closeModal();
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.image_wrapper}>
                <Image src={props.data.image} width={100} height={100} />
            </div>
            <div className={`mt-2 ${styles.counsellor_name}`}>
                {props.data.name}
            </div>
            <div className={`mt-2 ${styles.call_status}`}>
                You are receiving a {props.data.type} call
            </div>
            <div className="mt-4 d-flex justify-content-around w-100">
                <Button style={{fontSize: "14px"}} className='w-25' onClick={handleAcceptCall} variant='success'>
                    End &amp; Accept
                </Button>
                <Button style={{fontSize: "14px"}} className='w-25' onClick={handleEndCall} variant='danger'>
                    Decline
                </Button>
            </div>
        </div>
    )
}

export default BusyCallModalContent;