import { Downgraded, useState } from '@hookstate/core';
import React, { useEffect, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';

import ChatList from '../../components/Dashboard/children/Consultation/ChatList/ChatList';
import ConsultationWrapper from '../../components/Dashboard/children/Consultation/ConsultationWrapper/ConsultationWrapper';
import DashboardWrapper from '../../components/Dashboard/DashboardWrapper/DashboardWrapper';
import { getUser, isAuthenticated } from '../../utils/auth';
import store from '../../utils/store';
import Image from 'next/image';
import ChatWrapper from '../../components/Dashboard/children/Consultation/ChatWrapper';
import ChatHeader from '../../components/Dashboard/children/Consultation/ChatHeader/ChatHeader';
import ChatBody from '../../components/Dashboard/children/Consultation/ChatBody/ChatBody';
import ChatFooter from '../../components/Dashboard/children/Consultation/ChatFooter/ChatFooter';

const Consultations = () => {

    const router = useRouter();

    const globalStore = useState(store);
    const [authenticated, setAuthenticated] = React.useState(false);

    useEffect(() => {
        if(isAuthenticated()) {
            globalStore.activeSidebarItem.set("consultations");
            setAuthenticated(true);
        }
        else {
            router.push("/");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        globalStore.pathname.set("/consultations");
    }, []);

    useEffect(() => {
        if(globalStore.socketRef.attach(Downgraded).get()) {
            globalStore.socketRef.attach(Downgraded).get().current.emit("get-availablity", getUser(), "COUNSELLOR", globalStore.activeConsultation.attach(Downgraded).get().customer_id, "CUSTOMER");
        }
    }, [globalStore.socketRef.attach(Downgraded).get(), globalStore.activeConsultation.attach(Downgraded).get()]);

    return (
        <>
        {authenticated ?
            <DashboardWrapper>
                <ConsultationWrapper>
                    <Row>
                        <Col sm="4">
                            <ChatList />
                        </Col>
                        <Col sm="8">
                            {globalStore.activeConsultation.attach(Downgraded).get().id !== -1 ?
                                <ChatWrapper>
                                    <ChatHeader customerID={globalStore.activeConsultation.attach(Downgraded).get().customer_id} userImage={globalStore.activeConsultation.attach(Downgraded).get().image} userName={globalStore.activeConsultation.attach(Downgraded).get().name} videoRoomID={globalStore.activeConsultation.attach(Downgraded).get().video_room_id} audioRoomID={globalStore.activeConsultation.attach(Downgraded).get().audio_room_id} startTime={globalStore.activeConsultation.attach(Downgraded).get().start_time} />
                                    <ChatBody />
                                    <ChatFooter customerID={globalStore.activeConsultation.attach(Downgraded).get().customer_id} />
                                </ChatWrapper>
                                :
                                <ChatWrapper>
                                    <div className="d-flex align-items-center" style={{height: "inherit", justifyContent: "center", flexDirection: "column"}}>
                                        <Image src="/images/chat.png" width={150} height={150} />
                                        <h4 className="mt-3 mb-2 fw-bold">Choose a consultation</h4>
                                        <h6>Select a chat to see your previous messages</h6>
                                    </div>
                                </ChatWrapper>
                            }
                        </Col>
                    </Row>
                </ConsultationWrapper>
            </DashboardWrapper>
        :
            null
        }
        </>
    )
}

export default Consultations;