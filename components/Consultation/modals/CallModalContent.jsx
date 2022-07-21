import { Downgraded, useState } from '@hookstate/core';
import Image from 'next/image';
import { Button } from 'react-bootstrap';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { FaVideo } from 'react-icons/fa';
import { MdCallEnd } from 'react-icons/md';

import store from '../../../utils/store';
import styles from './CallModalContent.module.css';

const CallModalContent = (props) => {

    const globalStore = useState(store);

    const handleAcceptCall = () => {

        props.stopCallAudio();

        globalStore.socketRef.attach(Downgraded).get().current.emit("accept-initiate-call", props.data.customer_id, "CUSTOMER");
        props.closeModal();

        const link = `/consultation/${props.data.room_id}?type=${props.data.type}&customer_id=${props.data.customer_id}&acceptor=true`;
        window.location.href = link;
    }

    const handleEndCall = () => {

        props.stopCallAudio();

        globalStore.socketRef.attach(Downgraded).get().current.emit("reject-end-call", props.data.customer_id, "CUSTOMER");

        props.closeModal();
    }

    return (
        <div className={styles.container}>
            <div className={styles.image_wrapper}>
                <Image src={props.data.image} width={140} height={140} />
            </div>
            <div className={styles.counsellor_name}>
                {props.data.name}
            </div>
            <div className={`mt-4 ${styles.call_status}`}>
                You are receiving a {props.data.type} call
            </div>
            <div className="mt-5 d-flex justify-content-around w-100">
                <Button className='w-25' onClick={handleAcceptCall} variant='success'>
                    {props.data.type === "video" ? <FaVideo fontSize={20} /> : <BsFillTelephoneFill  fontSize={20} /> }
                </Button>
                <Button className='w-25' onClick={handleEndCall} variant='danger'>
                    <MdCallEnd fontSize={24} />
                </Button>
            </div>
        </div>
    )
}

export default CallModalContent