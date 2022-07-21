import { Downgraded, useState } from '@hookstate/core';
import moment from 'moment';
import Image from 'next/image';
import { Button, Col, Row, Stack } from 'react-bootstrap';
import { MdCall, MdVideocam } from 'react-icons/md';
import store from '../../../../../utils/store';

import styles from './ChatHeader.module.css';

const ChatHeader = (props) => {

    const globalStore = useState(store);

    function handleCall(type) {
        if(moment(props.startTime).valueOf() <= moment().valueOf()) {
            if(globalStore.currentCounsellorAvailability.get()) {
                if(type === "video") {
                    window.location.href = "/consultation/"+props.videoRoomID+"?type=video&customer_id="+globalStore.activeConsultation.attach(Downgraded).get().customer_id;
                }
                else {
                    window.location.href = "/consultation/"+props.videoRoomID;
                }
            }
            else {
                iziToast.warning({
                    title: "Unavailable",
                    message: `${props.userName} is currently unavailable for a call.`,
                    timeout: 2000,
                    position: "topRight",
                });
            }
        }
        else {
            iziToast.warning({
                title: "Consultation Inactive",
                message: `This consultation will become active at ${moment(props.startTime).format('lll')}`,
                timeout: 2000,
                position: "topRight",
            });
        }
    }

    return (
        <div className={`${styles.chat_header_main} border-bottom`}>
            <Row className={`align-items-center`}>
                <Col xs="6">
                    <Stack direction='horizontal' gap={3}>
                        <div style={{borderRadius: "30px", overflow: "hidden", height: "40px", width: "40px"}}>
                            {props.userImage !== "" ?
                                <Image src={props.userImage} height={40} width={40} layout="responsive" />
                                :
                                <Image src="/images/profile.png" height={40} width={40} layout="responsive" />
                            }
                        </div>
                        <div>
                            {props.userName}
                            <p style={{fontSize: "12px", display: "flex", alignItems: "center"}} className='mb-0'><span style={{height: "5px", width: "5px", borderRadius: "50%", backgroundColor: "green", display: "inline-block"}}></span>&nbsp;Online</p>
                        </div>
                    </Stack>
                </Col>
                <Col xs="6">
                    <div>
                        {globalStore.activeConsultation.attach(Downgraded).get().finished ? 
                        <Stack direction='horizontal' gap={3}>
                            <span className='ms-auto' style={{color: "#14bef0", cursor: "pointer"}}>Help</span>
                        </Stack>
                        :
                        <Stack direction='horizontal' gap={3}>
                            <Button onClick={() => handleCall("audio")} className={`${styles.header_icon} ms-auto`}>
                                <MdCall />
                            </Button>
                            <Button onClick={() => handleCall("video")} className={`${styles.header_icon}`}>
                                <MdVideocam />
                            </Button>
                            <span style={{color: "#14bef0", cursor: "pointer"}}>Help</span>
                        </Stack>
                        }
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default ChatHeader;