import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'izitoast/dist/css/iziToast.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'swiper/css';
import 'swiper/css/pagination';
import 'react-pro-sidebar/dist/css/styles.css';
import { Modal, SSRProvider } from 'react-bootstrap';
import NextNProgress from "nextjs-progressbar";
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

import { getCounsellorChats, scrollToBottom } from './api/counsellor';
import { getUser, isAuthenticated } from '../utils/auth';
import { Downgraded, useState } from '@hookstate/core';
import store from '../utils/store';
import CallModalContent from '../components/Consultation/modals/CallModalContent';
import BusyCallModalContent from '../components/Consultation/modals/BusyCallModalContent';
import NewOppModalContent from '../components/Consultation/modals/NewOppModalContent';

function MyApp({ Component, pageProps }) {

  const socketRef = useRef();
  const globalStore = useState(store);

  const modalContent = useState(null);
  const modalOppContent = useState(null);
  const showModal = useState(false);
  const showBusyModal = useState(false);
  const showOppModal = useState(false);

  let callAudio = null;
  let newOppAudio = null;

  function stopCallAudio() {
    callAudio.pause();
    callAudio.currentTime = 0;
  }

  function stopNewOppAudio() {
    newOppAudio.pause();
    newOppAudio.currentTime = 0;
  }

  useEffect(() => {
    callAudio = new Audio("/audios/new-call-notification.mp3");
    callAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);

    newOppAudio = new Audio("/audios/new-oppurtunity-notification.mp3");
    newOppAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);

      if(isAuthenticated()) {
        socketRef.current = io.connect(process.env.NEXT_PUBLIC_CHAT_SERVER_URL);
        socketRef.current.emit("new-chat-socket", getUser(), "COUNSELLOR");
        
        globalStore.socketRef.set(socketRef);

        socketRef.current.on("incoming-message", (senderID, message) => {
          if(globalStore.pathname.get().includes("consultations")) {
            if(globalStore.activeConsultation.attach(Downgraded).get().customer_id === senderID) {
              globalStore.currentChatMessages.set([...globalStore.currentChatMessages.attach(Downgraded).get(), message]);
              scrollToBottom();
            }
            getCounsellorChats(getUser()).then((response) => {
                globalStore.currentChatList.set(response.data.description);
            });
          }
          else {
            var audio = new Audio("/audios/new-message-notification.mp3");
            audio.play();

            iziToast.info({
              title: "New message",
              message: "You have received a new message from a customer",
              position: "topRight",
              timeout: false
            });
          }
        });

        socketRef.current.on("set-availability", (availability) => {
          globalStore.currentCounsellorAvailability.set(availability);
          if(globalStore.pathname.get().includes("/consultation")) {
            globalStore.directLinkVideoCallAvailability.set(availability);
          }
        });

        socketRef.current.on("call-not-placed", () => {
          console.log("not placed");
        });

        socketRef.current.on("incoming-call", (requesterName, requesterImage, callType, callID, customerID) => {
          if(globalStore.isIdle.get()) {
            callAudio.play();
            setupModal("incoming-call", {name: requesterName, image: requesterImage, type: callType, room_id: callID, customer_id: customerID});
          }
          else {
            setupModal("busy-incoming-call", {name: requesterName, image: requesterImage, customer_id: customerID});
          }
        });

        socketRef.current.on("destroy-call-notification", (callerName) => {
          stopCallAudio();
          iziToast.warning({
            title: "Missed call",
            message: "You have a missed call from "+callerName,
            position: "topRight",
            timeout: false
          });
          showModal.set(false);
          showBusyModal.set(false);
        });

        socketRef.current.on("new-consultation-oppurtunity", (oppurtunityID, customerID, customerName, customerImage, specializationID, razorpayPaymentID) => {
          if(globalStore.isIdle.get()) {
            newOppAudio.play();
            setupModal("new-consultation-opp", {oppurtunityID: oppurtunityID, customerID: customerID, customerName: customerName, customerImage: customerImage, specializationID: specializationID, razorpayPaymentID: razorpayPaymentID})
          }
        });
      }
  }, [isAuthenticated]);

  function CallModal(props) {
    return (
      <Modal {...props}
      size="md"
      backdrop="static"
      centered>
        {modalContent.attach(Downgraded).get()}
      </Modal>
    )
  }

  function CustomCallModal(props) {
    return (
      <Modal {...props}
      size="md"
      backdrop="static"
      dialogClassName='busy-call-modal'
      centered={false}>
        {modalContent.attach(Downgraded).get()}
      </Modal>
    )
  }

  function ConOppModal(props) {
    return (
      <Modal {...props}
      size="md"
      backdrop="static"
      centered>
        {modalOppContent.attach(Downgraded).get()}
      </Modal>
    )
  }

  function setupModal(key, data) {
    if(key === "incoming-call") {
      modalContent.set(<CallModalContent stopCallAudio={stopCallAudio} closeModal={() => showModal.set(false)} data={data} />);
      showModal.set(true);
    }
    else if(key === "busy-incoming-call") {
      modalContent.set(<BusyCallModalContent closeModal={() => showBusyModal.set(false)} data={data} />);
      showBusyModal.set(true);
    }
    else if(key === "new-consultation-opp") {
      modalOppContent.set(<NewOppModalContent stopNewOppAudio={stopNewOppAudio} closeModal={() => showOppModal.set(false)} data={data} />);
      showOppModal.set(true);
    }
  }

  return (
    <SSRProvider>
      <NextNProgress
        color='#14bef1'
      />
      <Component {...pageProps} />
      <ConOppModal show={showOppModal.get()} onHide={() => showOppModal.set(false)} />
      <CustomCallModal show={showBusyModal.get()} onHide={() => showBusyModal.set(false)} />
      <CallModal show={showModal.get()} onHide={() => showModal.set(false)} />
    </SSRProvider>
  )
}

export default MyApp;
