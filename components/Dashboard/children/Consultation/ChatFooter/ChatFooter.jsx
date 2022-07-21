import { Downgraded, useState } from '@hookstate/core';
import { Button, Col, Form, FormControl, Row, Spinner } from 'react-bootstrap';
import { FaArrowUp, FaMicrophone, FaRegStopCircle, FaTimes } from 'react-icons/fa';
import { ImAttachment, ImCancelCircle } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { generate } from 'shortid';
import { AiOutlinePlus } from 'react-icons/ai';
import { Image } from 'primereact/image';
import { IoMdDocument } from 'react-icons/io';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { BsFillRecordCircleFill } from 'react-icons/bs';
import { useEffect, useRef } from 'react';

import axiosJWT from '../../../../../utils/axiosJWT';
import styles from './ChatFooter.module.css';
import { getUser } from '../../../../../utils/auth';
import store from '../../../../../utils/store';
import { getCounsellorChats, scrollToBottom, sendMessage, sendMessagePingToSocket } from '../../../../../pages/api/counsellor';

const ReactMic = dynamic(
    () => import('react-mic').then((mod) => mod.ReactMic),
    {
        ssr: false
    }
);

const ChatFooter = (props) => {

    const audioUIRef = useRef(null);

    const globalStore = useState(store);
    const sendingAttachments = useState(false);
    const sendingAudio = useState(false);
    const isAudioRecording = useState(false);
    const recordingUIShown = useState(false);

    const showSendAudioUI = useState(false);
    const audioPlayerRef = useRef(null);

    const audioBlob = useState(null);

    const validationSchema = Yup.object({
        message: Yup.string().required('Please type a message')
    });

    const formik = useFormik({
        initialValues: {
            message: "",
            caption: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            formik.handleReset();

            let formData = new FormData();
            formData.append("counsellor_id", getUser());
            formData.append("consultation_id", globalStore.activeConsultation.attach(Downgraded).get().id);
            formData.append("category", "text");
            formData.append("sender_type", "COUNSELLOR");
            formData.append("message", values.message);
            formData.append("media", "");

            sendMessage(formData).then(() => {
                let message = {
                    id: generate(),
                    category: "text",
                    sender_type: "COUNSELLOR",
                    msg: values.message,
                    media: ""
                }

                sendMessagePingToSocket(globalStore.socketRef.attach(Downgraded).get(), props.customerID, message);

                globalStore.currentChatMessages.set([...globalStore.currentChatMessages.attach(Downgraded).get(), message]);
                getCounsellorChats(getUser()).then((response) => {
                    globalStore.currentChatList.set(response.data.description);
                });
                scrollToBottom();
            })
            .catch(() => {
                iziToast.error({
                    title: "Message not sent",
                    message: "Your message couldn't be sent. Please try again.",
                    timeout: 2000
                });
            });
        }
    });

    function sendAttachments() {
        sendingAttachments.set(true);

        globalStore.currentChatAttachments.attach(Downgraded).get().forEach(async (attachment, index) => {
            const { url } = await axiosJWT.get(process.env.NEXT_PUBLIC_BACKEND_URL+"s3URL?object=chat-doc&type="+attachment.media.name.split(".").pop()).then((res) => res.data);
            axios.put(url, attachment.media)
            .then(() => {
                const finalMedia = url.split("?")[0];

                const category = attachment.media.type === "image/jpg" || attachment.media.type === "image/jpeg" || attachment.media.type === "image/png" || attachment.media.type === "image/gif" ? 'image' : attachment.media.type === "video/mp4" || attachment.media.type === "video/mov" ? 'video' : 'document';

                let formData = new FormData();
                formData.append("counsellor_id", getUser());
                formData.append("consultation_id", globalStore.activeConsultation.attach(Downgraded).get().id);
                formData.append("category", category);
                formData.append("sender_type", "COUNSELLOR");
                formData.append("message", formik.values.caption);
                formData.append("media", finalMedia);

                sendMessage(formData).then(() => {
                    let message = {
                        id: attachment.id,
                        category: category,
                        sender_type: "COUNSELLOR",
                        msg: formik.values.caption,
                        media: finalMedia
                    }

                    sendMessagePingToSocket(globalStore.socketRef.attach(Downgraded).get(), props.customerID, message);

                    globalStore.currentChatMessages.set([...globalStore.currentChatMessages.attach(Downgraded).get(), message]);
                    getCounsellorChats(getUser()).then((response) => {
                        globalStore.currentChatList.set(response.data.description);
                    });
                    scrollToBottom();

                    if(index === globalStore.currentChatAttachments.attach(Downgraded).get().length - 1) {
                        globalStore.currentChatAttachments.set([]);
                        sendingAttachments.set(false);
                    }
                })
                .catch(() => {
                    iziToast.error({
                        title: "Message not sent",
                        message: "Your message couldn't be sent. Please try again.",
                        timeout: 2000
                    });

                    if(index === globalStore.currentChatAttachments.attach(Downgraded).get().length - 1) {
                        globalStore.currentChatAttachments.set([]);
                        sendingAttachments.set(false);
                    }
                });
            })
        });
    }

    async function sendAudio() {
        sendingAudio.set(true);

        const { url } = await axiosJWT.get(process.env.NEXT_PUBLIC_BACKEND_URL+"s3URL?object=chat-doc&type=mp3").then((res) => res.data);
        
        axios.put
        (url, audioBlob.attach(Downgraded).get().blob)
        .then(() => {
            const finalMedia = url.split("?")[0];
            
            const category = "audio";

            let formData = new FormData();
            formData.append("counsellor_id", getUser());
            formData.append("consultation_id", globalStore.activeConsultation.attach(Downgraded).get().id);
            formData.append("category", category);
            formData.append("sender_type", "COUNSELLOR");
            formData.append("message", "");
            formData.append("media", finalMedia);

            sendMessage(formData).then(() => {
                let message = {
                    id: generate(),
                    category: category,
                    sender_type: "COUNSELLOR",
                    msg: formik.values.caption,
                    media: finalMedia
                }

                sendMessagePingToSocket(globalStore.socketRef.attach(Downgraded).get(), props.customerID, message);

                globalStore.currentChatMessages.set([...globalStore.currentChatMessages.attach(Downgraded).get(), message]);
                getCounsellorChats(getUser()).then((response) => {
                    globalStore.currentChatList.set(response.data.description);
                });
                scrollToBottom();

                sendingAudio.set(false);
                showSendAudioUI.set(false);
            })
            .catch(() => {
                iziToast.error({
                    title: "Message not sent",
                    message: "Your message couldn't be sent. Please try again.",
                    timeout: 2000
                });
            });
        });
    }

    function addDocument(media) {
        globalStore.currentChatAttachments.set([...globalStore.currentChatAttachments.attach(Downgraded).get(), {id: generate(), media: media}]);
    }

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target) && !isAudioRecording.get()) {
                    recordingUIShown.set(false);
                }
            }
            
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    useOutsideAlerter(audioUIRef);

    const handleAudioBlob = (audioB) => {
        recordingUIShown.set(false);
        showSendAudioUI.set(true);
        audioPlayerRef.current.src = audioB.blobURL;

        audioBlob.set(audioB);
    }

    return (
        globalStore.activeConsultation.attach(Downgraded).get().finished ?
        <Button className='cv-btn-primary w-100 fw-bold' style={{padding: "1.1rem"}}>
            Reopen Consultation
        </Button>
        :
        <div style={{padding: "10px 25px"}}>
            <Row>
                <Col xs="12">
                    <input type="file" id='attach-file' style={{display: "none"}} onChange={(e) => {
                        formik.setErrors({message: null});

                        const media = e.target.files[0];
                        if(media.size > 100000000) {
                            e.target.value = null;
                            formik.setErrors({message: "Document size cannot exceed 100MB"});
                            iziToast.error({
                                title: "Maximum size exceeded",
                                message: "Document size cannot exceed 100MB",
                                position: "topRight",
                                timeout: 2000
                            });
                            return;
                        }
                        addDocument(media);
                        e.target.value = null;
                    }} />
                    <div style={{display: showSendAudioUI.get() ? "flex" : "none"}} className={styles.audioWrapper}>
                        <Button disabled={sendingAttachments.get()} onClick={() => showSendAudioUI.set(false)} variant='danger' className='me-2'><ImCancelCircle fontSize={22} /></Button>
                        <audio style={{width: '-webkit-fill-available'}} ref={audioPlayerRef} controls/>
                        {!sendingAudio.get() ?
                        <Button onClick={() => sendAudio()} className='cv-btn-primary ms-2'><FaArrowUp fontSize={22} /></Button>
                        :
                        <Button className='cv-btn-primary ms-2'><Spinner animation='border' size='sm' /></Button>
                        }
                    </div>
                    {globalStore.currentChatAttachments.attach(Downgraded).get().length === 0 ?
                    showSendAudioUI.get() ?
                    null
                    :
                    <Form onSubmit={formik.handleSubmit}>
                        <div className='position-relative'>
                            <span ref={audioUIRef} style={{position: "relative"}} onClick={() => recordingUIShown.set(true)}>
                                <FaMicrophone fontSize={18} color='#14bef0' style={{position: "absolute", top: "12px", left: "12px", cursor: "pointer"}} />
                                {recordingUIShown.get() ?
                                <div className={styles.audio_record}>
                                    <div style={{marginLeft: "8px"}}>
                                        {isAudioRecording.get() ?
                                        <FaRegStopCircle onClick={() => isAudioRecording.set(false)} style={{cursor: "pointer"}} fontSize={24} color={"#000"} />
                                        :
                                        <BsFillRecordCircleFill onClick={() => isAudioRecording.set(true)} style={{cursor: "pointer"}} fontSize={24} color={"#9f3bff"} />
                                        }
                                    </div>
                                    <ReactMic 
                                        record={isAudioRecording.get()}
                                        backgroundColor="#F5F6F6"
                                        strokeColor="#14bef1"
                                        className={styles.audioPlayer}
                                        echoCancellation={true}
                                        mimeType="audio/mp3"
                                        onStop={handleAudioBlob}
                                    />
                                </div>
                                :
                                null
                                }
                            </span>
                            <FormControl name='message' 
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            isInvalid={!!formik.errors.message}
                            className={`shadow-none ${styles.chatbox}`} placeholder='Message' />
                            <div className={`${styles.icon_holder}`}>
                                <ImAttachment onClick={() => document.getElementById('attach-file').click()} style={{cursor: "pointer"}} fontSize={14} />
                                <MdSend onClick={() => formik.submitForm()} className={`${styles.send_btn}`} />
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.message}
                            </Form.Control.Feedback>
                        </div>
                    </Form>
                    :
                    <div className={styles.attachmentWrapper}>
                        {globalStore.currentChatAttachments.attach(Downgraded).get().map(attachment => {
                            if(attachment.media.type === "image/jpeg" || attachment.media.type === 'image/jpg'  || attachment.media.type === 'image/png'  || attachment.media.type === 'image/gif') {
                                return (
                                    <div key={attachment.id} className='d-flex' style={{position: "relative"}}>
                                        <div onClick={() => { if(!sendingAttachments.get()) globalStore.currentChatAttachments.set(globalStore.currentChatAttachments.attach(Downgraded).get().filter(x => x.id !== attachment.id)) }} className={styles.attachmentClose}>
                                            <FaTimes fontSize={13} style={{opacity: "0.64"}} />
                                        </div>
                                        <Image className={styles.attachmentMedia} src={URL.createObjectURL(attachment.media)} alt="" height={90} width={90} preview={true}/>
                                    </div>
                                );
                            }
                            else if(attachment.media.type === "video/mp4" || attachment.media.type === "video/mov") {
                                return (
                                    <div key={attachment.id} className='d-flex' style={{position: "relative"}}>
                                        <div onClick={() => { if(!sendingAttachments.get()) globalStore.currentChatAttachments.set(globalStore.currentChatAttachments.attach(Downgraded).get().filter(x => x.id !== attachment.id)) }} className={styles.attachmentClose}>
                                            <FaTimes fontSize={13} style={{opacity: "0.64"}} />
                                        </div>
                                        <video className={styles.attachmentMedia} autoPlay={true} muted={true} src={URL.createObjectURL(attachment.media)} alt="" height={90} width={90} />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div key={attachment.id} className='d-flex' style={{position: "relative"}}>
                                        <div onClick={() => { if(!sendingAttachments.get()) globalStore.currentChatAttachments.set(globalStore.currentChatAttachments.attach(Downgraded).get().filter(x => x.id !== attachment.id)) }} className={styles.attachmentClose}>
                                            <FaTimes fontSize={13} style={{opacity: "0.64"}} />
                                        </div>
                                        <div className={styles.attachmentDocument}>
                                            <IoMdDocument color="#14bef0" fontSize={54} />
                                            <div style={{fontSize: "10px", position: "absolute", bottom: "20px", left: "5px"}}>{attachment.media.name.length > 9 ? attachment.media.name.substring(0, 10)+"..." : attachment.media.name}</div>
                                            <span style={{fontSize: "12px", position: "absolute", bottom: "2px", left: "5px"}}>{attachment.media.name.split(".").pop().toUpperCase()}</span>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        <div onClick={() => { if(!sendingAttachments.get()) document.getElementById('attach-file').click() }} style={{cursor: "pointer", display: "flex", height: "90px", width: "90px", background: "#fafafa", marginTop: "15px", border: "2px dashed #aab7b8", borderRadius: "8px", justifyContent: "center", alignItems: "center"}}>
                            <AiOutlinePlus color='#aab7b8' fontSize={40}/>
                        </div>
                        <div className='d-flex w-100 mt-3 justify-content-between'>
                            <Button disabled={sendingAttachments.get()} onClick={() => globalStore.currentChatAttachments.set([])} variant='danger' className='me-2'><ImCancelCircle fontSize={22} /></Button>
                            <FormControl name='caption' value={formik.values.caption}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.caption}
                                placeholder='Add a caption'
                                className={`shadow-none`} />
                            {!sendingAttachments.get() ?
                            <Button onClick={() => sendAttachments()} className='cv-btn-primary ms-2'><FaArrowUp fontSize={22} /></Button>
                            :
                            <Button className='cv-btn-primary ms-2'><Spinner animation='border' size='sm' /></Button>
                            }
                        </div>
                    </div>
                    }
                </Col>
            </Row>
        </div>
    )
}

export default ChatFooter;