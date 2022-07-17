import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFailed, dispatchFecth, dispatchSuccess } from '../../redux/actions/authAction';
import * as RoomStatusAPI from '../../Api/RoomApi';
const HomeItem = ({ title, icon, backgroundColor, index }) => {
    const hotelId = 0;
    const navigation = useNavigation();
    const [token, setToken] = useState('');
    const dispatch = useDispatch();
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const gettoken = async () => {
        const user = await AsyncStorage.getItem('@user');
        return user;
    };
    const get = gettoken();
    get.then((data) => setToken(data));
    const handleClick = () => {
        const test = async () => {
            const go = (data) => {
                navigation.navigate('ViewStatus', {
                    title: title,
                    index: index,
                    data: data,
                });
            };
            dispatch(dispatchFecth());
            if (index == 1) {
                await RoomStatusAPI.GetAllStatus(hotelId)
                    .then((data) => {
                        go(data);
                    })
                    .catch((err) => console.log(err));
            }
            if (index == 2) {
                await RoomStatusAPI.GetStatusSearch(hotelId, 1)
                    .then((data) => {
                        go(data);
                    })
                    .catch((err) => console.log(err));
            }
            if (index == 3) {
                await RoomStatusAPI.GetStatusCheckOut(hotelId)
                    .then((data) => {
                        go(data);
                    })
                    .catch((err) => console.log(err));
            }
            dispatch(dispatchSuccess());
        };
        test();
    };
    return (
        <TouchableOpacity onPress={handleClick}>
            <View style={[styles.items, styles.shadowProp, { backgroundColor: backgroundColor }]}>
                <Text style={styles.item_title}>{title}</Text>
                <Text>
                    <Icon name={icon} size={60} color="#FFF"></Icon>
                </Text>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    items: {
        height: 120,
        width: 310,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 50,
    },
    item_title: {
        color: '#FFF',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

export default HomeItem;
