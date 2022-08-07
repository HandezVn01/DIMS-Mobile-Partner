import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let today = new Date();
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

// Get User Used-Menu
export const getUsedMenu = async (bookingDetailId, token) => {
    const res = await axios.get(`api/HostManage/Get-User-Menu?BookingDetailID=${bookingDetailId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
// Add-Item-For-ExtraFee
export const AddUsedItem = async (itemList, token) => {
    const res = await axios.post(`api/HostManage/Add-Item-For-Extrafee`, itemList, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
// Add Problem for ExtraFee
export const AddExtraFee = async (itemList, token) => {
    const res = await axios.post(`api/HostManage/Add-Problem-Extra-Fee`, itemList, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
// Delete Item for Extra Fee
export const DeleteUsedItem = async (bookingDetailId, bookingDetailMenuId, token) => {
    const res = await axios.delete(
        `api/HostManage/Delete-Item-For-Extrafee?BookingDetailId=${bookingDetailId}&BookingDetailMenuId=${bookingDetailMenuId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res.data;
};
export const updateCustomerInBooking = async (hotelId, bookingID, customerlist, token) => {
    const res = await axios.put(
        `api/HostManage/Add-inbound-user-id`,
        {
            hotelId: hotelId,
            bookingId: bookingID,
            inboundUsers: customerlist,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res;
};

export const cleanRoom = async (roomId, token) => {
    const res = await axios.put(
        `api/HostManage/Update-Clean-Status?roomID=${roomId}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res;
};

export const CheckInAuto = async (hotelId, qrContent, token) => {
    const res = await axios.post(
        `api/QrsManage/Check-in-Main-Qr`,
        {
            hotelId: hotelId,
            qrContent: qrContent,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    return res.data;
};

export const CheckOut = async (hotelId, bookingId, token) => {
    const res = await axios.put(
        `api/HostManage/Checkout-Local?hotelId=${hotelId}&bookingID=${bookingId}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    return res.data;
};

export const CheckInRoom = async (
    roomId,
    hotelId,
    totalNight,
    userEmail,
    totalPrice,
    isPayment,
    deposit,
    customerlist,
    token,
) => {
    const res = await axios.post(
        'api/HostManage/Host-Local-Payment-final',
        {
            hotelId: hotelId,
            userId: 0,
            email: userEmail,
            arrivalDate: today,
            totalNight: totalNight,

            paymentCondition: isPayment,
            deposit: deposit,
            bookingDetails: [
                {
                    roomId: roomId,
                    totalRoomPrice: totalPrice,
                },
            ],
            inboundUsersUnknow: customerlist,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res.data;
};
export const CheckInRooms = async (
    listRoom,
    hotelId,
    totalNight,
    userEmail,
    isPayment,
    deposit,
    customerlist,
    token,
    userId,
) => {
    const res = await axios.post(
        'api/HostManage/Host-Local-Payment-final',
        {
            hotelId: hotelId,
            userId: userId,
            email: userEmail,
            arrivalDate: today,
            totalNight: totalNight,
            paymentCondition: isPayment,
            deposit: deposit,
            bookingDetails: listRoom,
            inboundUsersUnknow: customerlist,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res.data;
};
export const CheckRoomDateBooking = async (hotelId, roomId, totalNight, token) => {
    const res = await axios.post(
        'api/HostManage/Check-Room-Date-Booking',
        {
            hotelId: hotelId,
            arrivalDate: today,
            totalNight: totalNight,
            bookingDetails: [
                {
                    roomId: roomId,
                },
            ],
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res.data;
    return null;
};
export const getRoomInfo = async (roomId, token) => {
    const res = await axios.get('api/HostManage/Host-A-Detail-Room', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            RoomId: roomId,
            today: today,
        },
    });
    return res.data;
};
export const GetAllStatus = async (hotelId, token) => {
    console.log(today);
    const res = await axios.get('api/HostManage/Host-A-Hotel-All-Room-Status-Today', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelId: hotelId,
            today: today,
        },
    });
    console.log('getall Status');
    return res.data;
};

export const GetStatusCheckOut = async (hotelId, token) => {
    const res = await axios.get('api/HostManage/Host-A-Hotel-All-Room-Status-CheckOut', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelId: hotelId,
            today: today,
        },
    });
    return res.data;
};

export const GetStatusSearch = async (hotelId, totalNight, token) => {
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
export const GetBookingInfo = async (bookingId, token) => {
    const res = await axios.get(`api/HostManage/Get-A-Book-Full-Detail?bookingID=${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
