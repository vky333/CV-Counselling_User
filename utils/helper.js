import axios from 'axios';

export const getCountry = () => {
    return axios.get("https://ipapi.co/json/");
}