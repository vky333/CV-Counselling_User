import axios from "axios";
import jwt_decode from "jwt-decode";
import { getAccessToken, refreshAccessTokens } from "./auth";

const axiosJWT = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        Authorization: "Bearer " + getAccessToken()
    }
});

axiosJWT.interceptors.request.use(async req => {
    let currentDate = new Date();
    const decodedToken = jwt_decode(getAccessToken());

    if(decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshAccessTokens();
        if(data) {
            req.headers.Authorization = "Bearer " + data.accessToken;
        }
    }
    else {
        req.headers.Authorization = "Bearer " + getAccessToken();
    }

    return req;
});

export default axiosJWT;