import { ListGroup } from 'react-bootstrap';
import { MdOutlineWatchLater } from 'react-icons/md';
import { Image } from 'primereact/image';
import { IoMdDocument } from 'react-icons/io';
import { HiOutlineDownload } from 'react-icons/hi';
import moment from 'moment';

import styles from './ChatMessage.module.css';

const ChatMessage = (props) => {
    return (
        props.message.category === 'text' ?
        <ListGroup ref={props.refOption} as="li" className={`${styles.convesation_box_main} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
            <div className={`${styles.convesation_box} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
                <p className={`mb-2`}>{props.message.msg}</p>
                <p className={`small mb-0 text-end`}>
                    <span><MdOutlineWatchLater /></span>&nbsp;
                    <span>{moment(props.message.time).format('LT')}</span>
                </p>
            </div>
        </ListGroup>
        :
        props.message.category === 'image' ?
        <ListGroup ref={props.refOption} as="li" className={`${styles.convesation_box_main} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
            <div className={`${styles.convesation_box} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
                <Image className='mb-2' imageStyle={{objectFit: "cover"}} src={props.message.media} height={160} width={260} preview={true} downloadable={true} />
                <p className={`mb-2`}>{props.message.msg}</p>
                <p className={`small mb-0 text-end`}>
                    <span><MdOutlineWatchLater /></span>&nbsp;
                    <span>{moment(props.message.time).format('LT')}</span>
                </p>
            </div>
        </ListGroup>
        :
        props.message.category === 'chat-prompt' ?
        <ListGroup ref={props.refOption} as="li" className={`${styles.convesation_box_main} ${styles.chat_prompt}`} >
            <div className={`${styles.convesation_box} ${styles.chat_prompt}`}>
                <p className={`mb-0`}>{props.message.msg}</p>
            </div>
        </ListGroup>
        :
        props.message.category === 'document' ?
        <ListGroup ref={props.refOption} as="li" className={`${styles.convesation_box_main} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
            <div className={`${styles.convesation_box} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
                <div className='d-flex mb-2' style={{width: "260px", alignItems: "center", justifyContent: "space-between", background: "white", padding: "8px", borderRadius: "3px"}}>
                    <span className='d-flex'>
                        <IoMdDocument color="#14bef0" fontSize={32} />
                        <span className='d-flex' style={{flexDirection: "column", marginLeft: "4px"}}>
                            <h6 style={{margin: "0", display: "inline-block", color: "#444444"}}>{props.message.media.split("/").pop().length > 14 ? props.message.media.split("/").pop().substring(0, 15)+"..." : props.message.media.split("/").pop() }</h6>
                            <span style={{color: "#444444"}} className='mb-0 small'>{props.message.media.split(".").pop().toUpperCase()}</span>
                        </span>
                    </span>
                    <a href={props.message.media} download>
                        <HiOutlineDownload style={{cursor: "pointer"}} fontSize={30} color="#14bef0" />
                    </a>
                </div>
                <p className={`mb-2`}>{props.message.msg}</p>
                <p className={`small mb-0 text-end`}>
                    <span><MdOutlineWatchLater /></span>&nbsp;
                    <span>{moment(props.message.time).format('LT')}</span>
                </p>
            </div>
        </ListGroup>
        :
        props.message.category === 'video' ?
        <ListGroup ref={props.refOption} as="li" className={`${styles.convesation_box_main} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
            <div className={`${styles.convesation_box} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
                <video src={props.message.media} controls width={300} height={200} />
                <p className={`small mb-0 text-end`}>
                    <span><MdOutlineWatchLater /></span>&nbsp;
                    <span>{moment(props.message.time).format('LT')}</span>
                </p>
            </div>
        </ListGroup>
        :
        <ListGroup ref={props.refOption} as="li" className={`${styles.convesation_box_main} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
            <div className={`${styles.convesation_box} ${props.message.sender_type === 'COUNSELLOR' ? styles.sent : null}`}>
                <audio src={props.message.media} controls />
                <p className={`small mb-0 text-end`}>
                    <span><MdOutlineWatchLater /></span>&nbsp;
                    <span>{moment(props.message.time).format('LT')}</span>
                </p>
            </div>
        </ListGroup>
    );
}

export default ChatMessage;