import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const gettoken = async () => {
    const user = await AsyncStorage.getItem('@user');
    return user;
};
let token = '';
gettoken().then((result) => {
    token = result;
    console.log(token);
    return token;
});
let today = new Date();
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
export const getRoomInfo = async (roomId) => {
    const res = await axios.get('api/HostManage/Host-A-Detail-Room', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            RoomId: roomId,
            today: today,
        },
    });
    return res.data;
};
export const GetAllStatus = async (token, today, hotelId) => {
    const res = await axios.get('api/HostManage/Host-A-Hotel-All-Room-Status-Today', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelId: hotelId,
            today: today,
        },
    });
    return res.data;
};

export const GetStatusCheckOut = async (token, today, hotelId) => {
    const res = await axios.get('api/HostManage/Host-A-Hotel-All-Room-Status-CheckOut', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelId: hotelId,
            today: today,
        },
    });
    return res.data;
};

export const GetStatusSearch = async (token, today, hotelId, totalNight) => {
    const res = await axios.get('api/HostManage/Host-A-Hotel-All-Room-Status-Search', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelId: hotelId,
            ArrivalDate: today,
            totalnight: totalNight,
        },
    });
    return res.data;
};
