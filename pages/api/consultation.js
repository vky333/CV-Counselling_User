import axios from "axios";

export const verifyConsultation = (counsellorID, customerID, roomID, roomType) => {
    return axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+"consulation/live/verify/now?counsellor_id="+counsellorID+"&customer_id="+customerID+"&room_id="+roomID+"&room_type="+roomType);
}