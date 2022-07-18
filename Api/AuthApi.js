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
