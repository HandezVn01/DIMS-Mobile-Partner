import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const timestamp = new Date().getTime();
const today = new Date(timestamp + 7 * 3600 * 1000);
// Get Customer List
export const getCustomerList = async (hotelId, token) => {
    const res = await axios.get('api/HostManage/Get-All-Inbound-User-Booking-info', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelID: hotelId,
        },
    });
    return res.data;
};
// Get
export const getMenuList = async (hotelId, token) => {
    const res = await axios.get('api/HostManage/Get-list-Menu', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelID: hotelId,
        },
    });
    return res.data;
};
// Post
export const AddItemMenu = async (itemList, token) => {
    const res = await axios.post(`api/HostManage/Add-Item-Menu`, itemList, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const AddExtraFee = async (token) => {
    const res = await axios.post(
        `api/HostManage/Add-Item-For-Extrafee`,
        [
            {
                bookingDetailId: 0,
                menuId: 0,
                bookingDetailMenuQuanity: 0,
            },
        ],
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    return res.data;
};

// Put
export const UpdateItemMenu = async (hotelId, menuId, menuName, menuPrice, menuType, token) => {
    const res = await axios.put(
        `api/HostManage/Update-Item-Menu?MenuID=${menuId}`,
        {
            hotelId: hotelId,
            menuName: menuName,
            menuPrice: menuPrice,
            menuType: menuType,
            menuStatus: true,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res;
};

export const RemoveItemMenu = async (hotelId, menuId, menuName, menuPrice, menuType, menuStatus, token) => {
    const res = await axios.put(
        `api/HostManage/Update-Item-Menu?MenuID=${menuId}`,
        {
            hotelId: hotelId,
            menuName: menuName,
            menuPrice: menuPrice,
            menuType: menuType,
            menuStatus: menuStatus,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    return res;
};
