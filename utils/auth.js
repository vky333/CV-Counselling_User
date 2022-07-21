import axios from "axios";
import cookie from "js-cookie";

export const getUser = () => {
    const userStr = cookie.get('user');

    if(userStr)
        return JSON.parse(userStr);
    else
        return null;
}

export const getAccessToken = () => {
    const accessTokenStr = cookie.get('accessToken');

    if(accessTokenStr)
        return accessTokenStr;
    else
        return null;
}

export const getRefreshAccessToken = () => {
    const refreshAccessTokenStr = cookie.get('refreshAccessToken');

    if(refreshAccessTokenStr)
        return refreshAccessTokenStr;
    else
        return null;
}

export const refreshAccessTokens = async () => {
    try {
        let formData = new FormData();
        formData.append("refreshAccessToken", getRefreshAccessToken())

        const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"counsellor/token/refresh", formData);
        cookie.set('accessToken', res.data.accessToken);
        cookie.set('refreshAccessToken', res.data.refreshAccessToken);

        return res.data;
    }
    catch(e) {
        cookie.remove('user');
        cookie.remove('accessToken');
        cookie.remove('refreshAccessToken');

        iziToast.error({
            title: "Session expired",
            message: "Your session has expired. Please login again.",
            timeout: 2000,
            onClosing: () => {
                window.location.href = '/';
            }
        });
    }
}

export const setUserAuth = (user, accessToken, refreshAccessToken) => {
    cookie.set('user', JSON.stringify(user));
    cookie.set('accessToken', accessToken);
    cookie.set('refreshAccessToken', refreshAccessToken);
}

export const removeUserAuth = (e) => {

    e.preventDefault();

    let formData = new FormData();
    formData.append("refreshAccessToken", getRefreshAccessToken());

    axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"counsellor/logout", formData)
    .then(() => {
        cookie.remove('user');
        cookie.remove('accessToken');
        cookie.remove('refreshAccessToken');

        iziToast.success({
            title: "Logout successful",
            message: "You have been successfully logged out",
            timeout: 2000,
            position: "topRight",
            onClosing: () => {
                window.location.href = "/";
            }
        });
    });
}

export const isAuthenticated = () => {
    if(getUser() && getAccessToken() && getRefreshAccessToken()) {
        return true;
    }
    return false;
}