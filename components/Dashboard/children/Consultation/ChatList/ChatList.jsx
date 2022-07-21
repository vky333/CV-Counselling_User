import { Downgraded, useState } from '@hookstate/core';
import { useEffect } from 'react';
import { Col, Form, FormControl, InputGroup, ListGroup, Row } from 'react-bootstrap';

import { getCounsellorChats, readConsultation } from '../../../../../pages/api/counsellor';
import { getUser } from '../../../../../utils/auth';
import store from '../../../../../utils/store';
import ChatListItem from '../ChatListItem/ChatListItem';
import styles from './ChatList.module.css';

const ChatList = () => {

    const globalStore = useState(store);

    useEffect(() => {
        getCounsellorChats(getUser()).then((response) => {
            globalStore.currentChatList.set(response.data.description);
        });
    }, []);

    return (
        <div style={{padding: '30px 20px 0'}}>
            <Row>
                <Col>
                    <div className="mb-3 d-flex align-items-center" style={{justifyContent: "space-between"}}>
                        <h5 className="mb-0 fw-bold">Ongoing consultations</h5>
                    </div>
                    <Form>
                        <InputGroup className="mb-3">
                            <FormControl className="shadow-none cv-input-field" placeholder="Search..." />
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className={styles.chat_list}>
                        <ListGroup className={styles.chat_list_group}>
                            {globalStore.currentChatList.attach(Downgraded).get().sort((a, b) => {
                                return Date.parse(JSON.parse(b.lastMessageDetails)[0].lastMessageTime) - Date.parse(JSON.parse(a.lastMessageDetails)[0].lastMessageTime);
                            }).map(consultation => 
                                <ChatListItem key={consultation.id} onClick={() => { 
                                    readConsultation({"counsellor_id": getUser(), "consultation_id": consultation.id}).then(() => {
                                        getCounsellorChats(getUser()).then((response) => {
                                            globalStore.currentChatList.set(response.data.description);
                                        });
                                    });
                                    globalStore.lowerLimit.set(1);
                                    globalStore.upperLimit.set(100);
                                    globalStore.activeConsultation.set(consultation);
                                }
                            } unread={JSON.parse(consultation.lastMessageDetails).unread} consultation={consultation}  />
                            )}
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ChatList;