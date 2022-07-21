import { Col, ListGroup, Row } from "react-bootstrap";
import Image from "next/image";
import { Downgraded, useState } from "@hookstate/core";
import moment from 'moment';
import { IoMdDocument, IoMdImage } from "react-icons/io";
import { MdVideocam } from "react-icons/md";

import styles from "./ChatListItem.module.css";
import store from "../../../../../utils/store";

const ChatListItem = (props) => {

    const globalStore = useState(store);

    return (
        <ListGroup.Item onClick={props.onClick} className={`${styles.chat_list_item} ${globalStore.activeConsultation.attach(Downgraded).get().id === props.consultation.id ? styles.active_chat : ''}`}>
            <Row className="align-items-center">
                <Col xs="2" className="p-0">
                    <div style={{borderRadius: "30px", overflow: "hidden", height: "40px", width: "40px"}}>
                        {props.consultation.image !== "" ?
                            <Image src={props.consultation.image} height={40} width={40} layout="responsive" />
                            :
                            <Image src="/images/profile.png" height={40} width={40} layout="responsive" />
                        }
                    </div>
                </Col>
                <Col xs="10" className={`${JSON.parse(props.consultation.lastMessageDetails)[0].unread && JSON.parse(props.consultation.lastMessageDetails)[0].sender_type !== "COUNSELLOR" ? styles.unread_chat : ''} ps-0`}>
                    <div className="d-flex align-items-baseline" style={{justifyContent: "space-between"}}>
                        <h6 className={`${styles.userName} mb-1 fw-bold`}>{props.consultation.name.length > 19 ? props.consultation.name.substring(0, 20)+"..." : props.consultation.name}</h6>
                        <span className={`${styles.msgTime} ${JSON.parse(props.consultation.lastMessageDetails)[0].sender_type !== "COUNSELLOR" && JSON.parse(props.consultation.lastMessageDetails)[0].unread ? styles.msgTime_unread : ''}`}>{moment(JSON.parse(props.consultation.lastMessageDetails)[0].lastMessageTime).fromNow()}</span>
                    </div>
                    <p className={`${styles.userMsg} mb-0 ${JSON.parse(props.consultation.lastMessageDetails)[0].unread && JSON.parse(props.consultation.lastMessageDetails)[0].sender_type !== "COUNSELLOR" ? styles.unread_chat_msg : ''}`}>{JSON.parse(props.consultation.lastMessageDetails)[0].lastMessage.length > 39 ? JSON.parse(props.consultation.lastMessageDetails)[0].lastMessage.substring(0, 40)+"..." : JSON.parse(props.consultation.lastMessageDetails)[0].lastMessage !== "" ? JSON.parse(props.consultation.lastMessageDetails)[0].lastMessage : JSON.parse(props.consultation.lastMessageDetails)[0].category === "image" ? <span style={{fontWeight: "bold"}}><IoMdImage /> {JSON.parse(props.consultation.lastMessageDetails)[0].category}</span> : JSON.parse(props.consultation.lastMessageDetails)[0].category === "video" ? <span style={{fontWeight: "bold"}}><MdVideocam /> {JSON.parse(props.consultation.lastMessageDetails)[0].category}</span> : <span style={{fontWeight: "bold"}}><IoMdDocument /> {JSON.parse(props.consultation.lastMessageDetails)[0].category}</span>}</p>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

export default ChatListItem;