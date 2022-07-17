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

// Get
export const getMenuList = async (hotelID) => {
    const res = await axios.get('api/HostManage/Get-list-Menu', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            hotelID: hotelID,
        },
    });
    return res.data;
};
// Post
export const AddItemMenu = async (itemList) => {
    console.log(itemList);
    const res = await axios.post(`api/HostManage/Add-Item-Menu`, itemList, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const AddExtraFee = async () => {
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
export const UpdateItemMenu = async (menuId, hotelID, menuName, menuPrice, menuType) => {
    const res = await axios.put(
        `api/HostManage/Update-Item-Menu?MenuID=${menuId}`,
        {
            hotelId: hotelID,
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

export const RemoveItemMenu = async (menuId, hotelID, menuName, menuPrice, menuType, menuStatus) => {
    const res = await axios.put(
        `api/HostManage/Update-Item-Menu?MenuID=${menuId}`,
        {
            hotelId: hotelID,
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
