import axios from "axios";

export const getCustomerDetails = (customerID) => {
    return axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+"customer/details/"+customerID);
}