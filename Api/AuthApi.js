import axios from 'axios';
// const url = 'http://mydims.hopto.org/';
export const LoginUser = async ({ email, password }) => {
    const res = await axios.post(`/api/Auth/login-user`, { email, password });
    return res.data;
};

export const GetUser = async (token) => {
    const res = await axios.get('api/UserManage/self-info', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const getAllHotel = async (token) => {
    const res = await axios.get('https://dims-system.herokuapp.com/api/HostManage/Host-All-Hotel', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
export const ForgotPassWord = async (email) => {
    const res = await axios.post(`api/Auth/forgot-code-mail`, {
        email: email,
    });
    return res.data;
};
export const SubmitChangeForgotPassWord = async (email, password, confirmPassword, unlockKey) => {
    const res = await axios.post(`api/Auth/forgot-pass-change`, {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        unlockKey: unlockKey,
    });
    return res.data;
};
