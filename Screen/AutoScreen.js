import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as RoomApi from '../Api/RoomApi';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFecth, dispatchSuccess } from '../redux/actions/authAction';
import Customer from '../Components/RoomScreen/Customer';
export default function AutoScreen() {
    const dispatch = useDispatch();
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const token = useSelector((state) => state.auth.token);
    const [datatmp, setDataTmp] = useState('');
    const [list, setList] = useState([]);
    const [list2, setList2] = useState([]);
    const [bookingId, setBookingId] = useState('');
    let count = 0;
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/beep.mp3'));
        setSound(sound);

        await sound.playAsync();
    }
    const [flag, setFlag] = useState(false);
    const handleBarCodeScanned = ({ type, data }) => {
        count++;
        if (count === 1) {
            alert(`${data}`);
            dispatch(dispatchFecth());
            RoomApi.CheckInAuto(hotelId, data, token)
                .then((result) => {
                    alert('Mã phòng của bạn hợp lệ . Vui lòng show cccd của bạn để hoàn thành thủ tục Check In !');
                    setFlag(true);
                    setBookingId(result.bookingId);
                })
                .catch((err) => (count = 0))
                .finally(() => dispatch(dispatchSuccess()));
            setDataTmp(datatmp);
        }
        if (flag) {
            if (data !== datatmp) {
                alert(`${data}`);
                setDataTmp(data);
                const value = data.split('|');
                const new_data = {
                    userName: value[2],
                    userSex: value[4],
                    userIdCard: value[0],
                    userBirthday: value[3],
                    userAddress: value[5],
                };

                setList([...list, new_data]);
                setList2([...list2, `${value[5]}|${value[3]}|${value[0]}|${value[2]}|${value[4]}`]);
                playSound();
            }
        }
    };
    const removeItemHandle = ({ indexList }) => {
        Alert.alert('Delete', 'Bạn muốn xóa ?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    setChangeState(true);
                    const newList = list.filter((item, index) => index !== indexList);
                    let listtmp = [];
                    // const new_data = {
                    //     userName: value[2],
                    //     userSex: value[4],
                    //     userIdCard: value[0],
                    //     userBirthday: value[3],
                    //     userAddress: value[5],
                    // };
                    newList.forEach((element) => {
                        listtmp.push(
                            `${element.userAddress}|${moment(element.userBirthday).format(
                                'DDMMYYYY',
                            )}|${element.userIdCard.trim()}|${element.userName}|${element.userSex}`,
                        );
                    });
                    setList2(listtmp);
                    setList(newList);
                },
            },
        ]);
    };
    const handleModifyAddCustomer = async () => {
        dispatch(dispatchFecth());
        await RoomApi.updateCustomerInBooking(hotelId, bookingId, list2, token)
            .then((result) => {
                Alert.alert('Update Success!');
                setHasPermission(false);
                setChangeState(false);
            })
            .catch((err) => {
                Alert.alert('Error ! ', 'Token your account is expired! Please Login Again ! ');
                dispatch(dispatchLogout());
            })
            .finally(() => dispatch(dispatchSuccess()));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Text>Check In Auto</Text>
            </View>
            <View style={{ flex: 5 }}>
                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
            </View>
            <View style={{ flex: 4 }}>
                <View
                    style={{
                        height: 30,
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderBottomColor: '#938D8D',
                        borderBottomWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: '#3DC5B5',
                        }}
                    >
                        Customer List
                    </Text>
                    <View>
                        <Text>Submit</Text>
                    </View>
                </View>
                {list.map((customer, index) => {
                    return (
                        <Customer
                            index={index + 1}
                            name={customer.userName}
                            cccd={customer.userIdCard}
                            key={index}
                            removeitem={() => removeItemHandle({ indexList: index })}
                        ></Customer>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}
