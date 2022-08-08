import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as RoomApi from '../Api/RoomApi';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFecth, dispatchLogout, dispatchSuccess } from '../redux/actions/authAction';
import Customer from '../Components/RoomScreen/Customer';
import { Audio } from 'expo-av';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function AutoScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const token = useSelector((state) => state.auth.token);
    const [datatmp, setDataTmp] = useState('');
    const [list, setList] = useState([]);
    const [list2, setList2] = useState([]);
    const [bookingId, setBookingId] = useState('');
    const [scanned, setScanned] = useState(false);
    const [sound, setSound] = React.useState();
    let count = 0;
    const [hasPermission, setHasPermission] = useState(null);
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/beep.mp3'));
        setSound(sound);

        await sound.playAsync();
    }
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    useEffect(() => {
        console.log('run');
        return () => {
            setHasPermission(false);
            console.log('auto close');
        };
    }, []);
    const [showScanCCCD, setShowScanCCCD] = useState(false);
    const [flag, setFlag] = useState(false);
    const handleBarCodeScanned = ({ type, data }) => {
        console.log(data);
        if (data !== datatmp) {
            alert(`Bar code with type ${type} and data ${data} has been scanned!`);
            setDataTmp(data);

            if (!showScanCCCD) {
                playSound();
                dispatch(dispatchFecth());
                RoomApi.CheckInAuto(hotelId, data, token)
                    .then((result) => {
                        alert('Mã phòng của bạn hợp lệ . Vui lòng show cccd của bạn để hoàn thành thủ tục Check In !');
                        setFlag(true);
                        setBookingId(result.bookingId);
                        setShowScanCCCD(true);
                        count = 0;
                    })
                    .catch((err) =>
                        alert('Mã phòng của bạn không hợp lệ . Có vẻ như bạn đã đi sai ngày hoặc sai khách sạn !'),
                    )
                    .finally(() => dispatch(dispatchSuccess()));
            } else {
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
                    const newList = list.filter((item, index) => index !== indexList);
                    let listtmp = [];
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
                Alert.alert(
                    'Bạn đã Check In Thành Công , Mã QR của bạn đã được kích hoạt !\n Hãy di chuyển lên phòng của mình , Chúc quý khách chuyến đi vui vẻ !',
                );
                count = 0;
                setList2([]);
                setList([]);
                setShowScanCCCD(false);
                navigation.goBack();
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Error ! ', 'Your QR Code is not Correct');
            })
            .finally(() => dispatch(dispatchSuccess()));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 2 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={styles.back}>
                            <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>Check In Auto</Text>
                </View>
            </View>
            <View style={{ flex: 9 }}>
                {hasPermission === null ? (
                    <Text>Requesting for camera permission</Text>
                ) : hasPermission === false ? (
                    <Text onPress={() => setHasPermission(true)}>Open Camera</Text>
                ) : (
                    <>
                        {hasPermission ? (
                            <BarCodeScanner
                                onBarCodeScanned={hasPermission ? handleBarCodeScanned : undefined}
                                style={StyleSheet.absoluteFillObject}
                            />
                        ) : (
                            <></>
                        )}
                        {showScanCCCD ? (
                            <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                                <View style={{ height: '50%', backgroundColor: 'white' }}>
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
                                    </View>
                                    <ScrollView style={{ paddingLeft: 10, paddingRight: 10 }}>
                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() => handleModifyAddCustomer()}
                                                style={{
                                                    padding: 10,
                                                    backgroundColor: '#2EC4B6',
                                                    width: 100,
                                                    borderRadius: 10,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View>
                                                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
                                                        Submit
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
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
                                    </ScrollView>
                                </View>
                            </View>
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    back: {
        height: 42,
        width: 42,
        borderColor: '#B2B2B2',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: { flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
    header_title: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
        marginLeft: 15,
    },
});
