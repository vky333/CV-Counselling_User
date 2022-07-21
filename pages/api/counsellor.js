import axios from 'axios';
import { getUser } from '../../utils/auth';
import axiosJWT from '../../utils/axiosJWT';

export const login = (formData) => {
  return axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"counsellor/login", formData);
}

export const getProfileDetails = (counsellor_id) => {
  return axiosJWT.get(process.env.NEXT_PUBLIC_BACKEND_URL+"counsellor/profile-details/"+counsellor_id);
}

export const scrollToBottom = () => {
  document.getElementById("dummy-div").scrollIntoView();
}

export const getCounsellorChats = (counsellor_id) => {
  return axiosJWT.get(process.env.NEXT_PUBLIC_BACKEND_URL+"counsellor/chats/"+counsellor_id);
}

export const getChatMessages = (activeConsultationID, loadMessagesLimit) => {
  return axiosJWT.get(process.env.NEXT_PUBLIC_BACKEND_URL+"consultation/"+getUser()+"/"+activeConsultationID+"?lower_limit=0&upper_limit="+loadMessagesLimit);
}

export const readConsultation = (consultation) => {
  return axiosJWT.put(process.env.NEXT_PUBLIC_BACKEND_URL+"counsellor/chat/read", consultation);
}

export const loadMoreChatMessages = (activeConsultationID, lowerLimit, upperLimit) => {
  return axiosJWT.get(process.env.NEXT_PUBLIC_BACKEND_URL+"consultation/"+getUser()+"/"+activeConsultationID+"?lower_limit="+lowerLimit+"&upper_limit="+upperLimit);
}

export const sendMessage = (message) => {
  return axiosJWT.post(process.env.NEXT_PUBLIC_BACKEND_URL+"consultation/message", message);
}

export const sendBusyCallDeclined = (message) => {
  return axiosJWT.post(process.env.NEXT_PUBLIC_BACKEND_URL+"consultation/busy/system/insert", message);
}

export const sendMessagePingToSocket = (socketRef, receiverID, message) => {
  socketRef.current.emit("new-message", getUser(), receiverID, "CUSTOMER", message);
}