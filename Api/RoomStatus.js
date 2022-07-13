import axios from 'axios';

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
