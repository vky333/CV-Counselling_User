import { Downgraded, useState } from '@hookstate/core';
import Image from 'next/image';
import { Button } from 'react-bootstrap';

import { getUser } from '../../../utils/auth';
import store from '../../../utils/store';
import styles from './CallModalContent.module.css';

const NewOppModalContent = (props) => {

    const globalStore = useState(store);

    const handleAcceptOpp = () => {
        props.stopNewOppAudio();

        globalStore.socketRef.attach(Downgraded).get().current.emit("accept-oppurtunity", props.data.oppurtunityID, getUser(), props.data.customerID, props.data.specializationID, props.data.razorpayPaymentID);
        globalStore.socketRef.attach(Downgraded).get().current.on("oppurtunity-seized", () => {
            props.closeModal();
            window.location.href = "/dashboard/consultations";
        });
        globalStore.socketRef.attach(Downgraded).get().current.on("unable-to-seize-oppurtunity", (message) => {

            props.closeModal();

            iziToast.error({
                title: "Error",
                message: message,
                position: "topRight",
                timeout: 2000
            });
        });
    }

    const handleIgnoreOpp = () => {
        props.stopNewOppAudio();
        props.closeModal();
    }

    return (
        <div className={styles.container}>
            <div className={styles.image_wrapper}>
                {props.data.customerImage !== "" ?
                    <Image src={props.data.customerImage} width={140} height={140} />
                :
                    <Image src="/images/profile.png" width={140} height={140} />
                }
            </div>
            <div className={styles.counsellor_name}>
                {props.data.customerName}
            </div>
            <div className={`mt-4 ${styles.call_status}`}>
                A new consultation oppurtunity is available
            </div>
            <div className="mt-5 d-flex justify-content-around w-100">
                <Button className='w-25' onClick={handleAcceptOpp} variant='success'>
                    Accept
                </Button>
                <Button className='w-25' onClick={handleIgnoreOpp} variant='danger'>
                    Ignore
                </Button>
            </div>
        </div>
    )
}

export default NewOppModalContent