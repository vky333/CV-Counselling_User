import { Downgraded, useState } from '@hookstate/core';
import { useCallback, useEffect, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';

import { getChatMessages, loadMoreChatMessages, scrollToBottom } from '../../../../../pages/api/counsellor';
import store from '../../../../../utils/store';
import ChatMessage from '../ChatMessage/ChatMessage';
import styles from './ChatBody.module.css';

const ChatBody = () => {

    const globalStore = useState(store);

    const loadMessagesLimit = useState(100);

    const observer = useRef();
    const lastChatMessageRef = useCallback(node => {
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting) {
                loadMoreChatMessages(globalStore.activeConsultation.attach(Downgraded).get().id, globalStore.lowerLimit.get(), globalStore.upperLimit.get())
                .then((response) => {
                    if(response.data.description.length > 0 && globalStore.lowerLimit.get() > 0 && globalStore.upperLimit.get() > 10) {
                        globalStore.currentChatMessages.set(Array.from(new Set(response.data.description.reverse().concat(globalStore.currentChatMessages.attach(Downgraded).get()))));
                        globalStore.lowerLimit.set(globalStore.lowerLimit.get() + loadMessagesLimit.get());
                        globalStore.upperLimit.set(globalStore.upperLimit.get() + loadMessagesLimit.get());
                    }
                })
            }
        })
        if(node) observer.current.observe(node);
    }, []);

    useEffect(() => {
        if(globalStore.activeConsultation.attach(Downgraded).get().id !== -1) {
            
            let activeConsultationID = globalStore.activeConsultation.attach(Downgraded).get().id;

            getChatMessages(activeConsultationID, loadMessagesLimit.get()).then((response) => {
                globalStore.currentChatMessages.set(response.data.description.reverse())
                scrollToBottom();

                globalStore.lowerLimit.set(globalStore.lowerLimit.get() + loadMessagesLimit.get());
                globalStore.upperLimit.set(globalStore.upperLimit.get() + loadMessagesLimit.get());
            });
        }
    }, [globalStore.activeConsultation.attach(Downgraded).get()]);

    return (
        <div className={`${styles.chat_body}`}>
            <ListGroup as="ul">
                {globalStore.currentChatMessages.attach(Downgraded).get().map((message, index) => {
                    if(index === 0) {
                        return <ChatMessage key={message.id} message={message} refOption={lastChatMessageRef} />
                    }
                    else {
                        return <ChatMessage key={message.id} message={message} />
                    }
                })}
                <div id="dummy-div" />
            </ListGroup>
        </div>
    );
}
  
  export default ChatBody;