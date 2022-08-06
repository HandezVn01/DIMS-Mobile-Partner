import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as RoomApi from '../../Api/RoomApi';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFailed, dispatchFecth, dispatchSuccess } from '../../redux/actions/authAction';
import moment from 'moment';
import NumberFormat from 'react-number-format';
const GroupBookingScreen = ({ route }) => {
    const navigation = useNavigation();
    const params = route.params;
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const [data, setDatas] = useState([]);
    useEffect(() => {
        RoomApi.GetBookingInfo(params.bookingId, token).then((result) => {
            setDatas(result);
            console.log(result);
        });
        return console.log('hello');
    }, []);
    const handleRoom = async ({ roomName, status, roomId }) => {
        const go = (data, usedItem) => {
            navigation.navigate('RoomDetail', {
                roomName: roomName,
                status: status,
                roomId: roomId,
                data: data || {},
                usedItem: usedItem || [],
            });
        };
        if (status === 2) {
            try {
                dispatch(dispatchFecth());
                await RoomApi.getRoomInfo(roomId, token)
                    .then((data) => {
                        RoomApi.getUsedMenu(data.bookingDetailId, token)
                            .then((result) => go(data, result))
                            .catch((error) => dispatch(dispatchFailed()));
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch(dispatchFailed());
                    });
                dispatch(dispatchSuccess());
                // Get API roomInfo
            } catch (error) {}
        } else {
            go();
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, marginTop: 20, overflow: 'hidden' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.back}>
                        <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                    </View>
                </TouchableOpacity>
                <Text style={styles.header_title}>Booking :{params.bookingId}</Text>
            </View>
            <View style={[styles.container]}>
                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.card_content}>
                        <Text style={styles.card_content_text}>
                            CheckIn Date:{' '}
                            <Text style={styles.card_data}>
                                {moment(data.qrCheckUp.checkIn).format('HH:MM ,DD-MM-YYYY')}
                            </Text>
                        </Text>
                        <Text style={styles.card_content_text}>
                            CheckOut Date:{' '}
                            <Text style={styles.card_data}>{moment(data.endDate).format('DD-MM-YYYY')}</Text>
                        </Text>
                        <Text style={styles.card_content_text}>
                            Type: <Text style={styles.card_data}>{data.paymentMethod}</Text>
                        </Text>
                        <Text style={styles.card_content_text}>
                            Created by: <Text style={styles.card_data}>{data.userFullName}</Text>
                        </Text>

                        <View style={{ overflow: 'scroll', flexWrap: 'wrap' }}>
                            <Text style={styles.card_content_text}>
                                Status:{' '}
                                {data.paymentCondition !== undefined ? (
                                    <Text
                                        style={[
                                            styles.card_data,
                                            {
                                                color:
                                                    data.paymentCondition === 'True'
                                                        ? '#53A1FD'
                                                        : data.deposit > 0
                                                        ? '#F9A000'
                                                        : '#D72C36',
                                            },
                                        ]}
                                    >
                                        {data.paymentCondition === 'True' ? (
                                            <Text>Đã Thanh Toán</Text>
                                        ) : data.deposit < 1 ? (
                                            <Text>Chưa Thanh Toán</Text>
                                        ) : (
                                            <Text>
                                                Đã Thanh Toán{' '}
                                                <Text style={{ color: '#53A1FD' }}>
                                                    <NumberFormat
                                                        value={data.deposit * 1000}
                                                        thousandSeparator={true}
                                                        displayType={'text'}
                                                        renderText={(value) => <Text>{value}</Text>}
                                                    ></NumberFormat>
                                                </Text>
                                                VNĐ
                                            </Text>
                                        )}
                                    </Text>
                                ) : (
                                    <View></View>
                                )}
                            </Text>
                        </View>
                        <Text style={styles.card_content_text}>
                            RoomPrice:
                            <Text style={styles.price_number}>
                                <NumberFormat
                                    value={data.totalPrice * 1000}
                                    thousandSeparator={true}
                                    displayType={'text'}
                                    renderText={(value) => (
                                        <Text>
                                            {' '}
                                            {value}{' '}
                                            <Text style={[styles.price_currency, { color: 'orange' }]}> VNĐ</Text>
                                        </Text>
                                    )}
                                ></NumberFormat>
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 1.8, flexDirection: 'row', alignItems: 'center' }}></View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    header_title: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
        marginLeft: 15,
    },
    header: { flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
    container: {
        flex: 15,
        alignItems: 'center',
        position: 'relative',
    },
    back: {
        height: 42,
        width: 42,
        borderColor: '#B2B2B2',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card_content: {
        paddingLeft: 30,
    },
    card_content_text: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 24,
        marginBottom: Platform.OS === 'ios' ? 5 : 0,
        // overflow: 'hidden',
    },
    card_data: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
    },
});
export default GroupBookingScreen;
