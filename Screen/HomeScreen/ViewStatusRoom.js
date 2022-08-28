import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFailed, dispatchFecth, dispatchSuccess } from '../../redux/actions/authAction';
import * as RoomApi from '../../Api/RoomApi';
import { Button, Modal, Portal, Provider, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import InputCompunent from '../../Components/RoomScreen/CheckInNav/InputCompunent';
import { Checkbox } from 'react-native-paper';
var { width, height } = Dimensions.get('window');
const ViewStatusRoom = ({ route }) => {
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const token = useSelector((state) => state.auth.token);
    const userId = useSelector((state) => state.auth.userId);
    const title = route.params.title;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [datas, setDatas] = useState(route.params.data);
    const [datatmp, setDatatmp] = useState(route.params.data);
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const [totalNight, setTotalNight] = useState(1);
    const [searchRoom, setSearchRoom] = useState('');
    const [listBooking, setListBooking] = useState([]);
    const [selectMore, setSelectMore] = useState(false);
    const [listSelectMore, SetListSelectMore] = useState([]);
    // Create State for Check In
    const [isPayment, setisPayment] = useState(false);
    const [totalPrice, setTotalPrice] = useState(10000);
    const [deposit, setDeposit] = useState(0);
    const [userEmail, setUserEmail] = useState('');
    const colorData = [
        '#0000FF',
        '#006400',
        '#FF6600',
        '#FFFF00',
        '#A020F0',
        '#C0C0C0',
        '#964B00',
        '#808080',
        '#FFC0CB',
        '#808000',
        '#800000',
        '#8F00FF',
        '#36454F',
        '#FF00FF',
        '#CD7F32',
        '#FFFDD0',
        '#FFD700',
        '#D2B48C',
        '#008080',
        '#FFDB58',
        '#000080',
        '#FF7F50',
        '#800020',
        '#E6E6FA',
        '#E0b0FF',
        '#FFE5B4',
        '#B7410E',
        '#4B0082',
        '#E0115F',
        '#CC7357',
        '#00FFFF',
        '#007FFF',
        '#F5F5DC',
        '#FAF9F6',
        '#FFBF00',
    ];
    const refreshData = async () => {
        try {
            await RoomApi.GetAllStatus(hotelId, token)
                .then((data) => {
                    setDatas(data);
                })
                .catch((err) => console.log(err))
                .finally(() => null);
        } catch (error) {}
    };
    useEffect(() => {
        let isApiSubscribed = true;
        const unsubscribe = navigation.addListener('focus', async () => {
            if (route.params.index === 1) {
                await refreshData();
            }
        });
        if (isApiSubscribed) {
            unsubscribe;
        }
        return () => {
            isApiSubscribed = false;
            console.log('done');
        };
    }, []);
    useEffect(() => {
        const tmp = totalNight.toString();
        if (tmp.includes('NaN')) {
            setTotalNight(1);
        }
        return () => {
            console.log('ViewStatus Off');
        };
    }, [totalNight]);
    useEffect(() => {
        let datatmp = [];
        datas.forEach((element) => {
            if (datatmp.length < 1) {
                datatmp.push({
                    bookingId: element.bookingId,
                    count: 1,
                    roomId: [element.roomId],
                    roomName: [element.roomName],
                });
            } else {
                let flag = true;
                datatmp.forEach((data) => {
                    if (data.bookingId === element.bookingId) {
                        data.count = data.count + 1;
                        data.roomId = [...data.roomId, element.roomId];
                        data.roomName = [...data.roomName, element.roomName];
                        flag = false;
                    }
                });
                if (flag) {
                    datatmp.push({
                        bookingId: element.bookingId,
                        count: 1,
                        roomId: [element.roomId],
                        roomName: [element.roomName],
                    });
                }
            }
        });
        const filtertmp = datatmp.filter((data) => data.count > 1);
        setListBooking(filtertmp);
        return () => {
            console.log('done');
        };
    }, [datas]);
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
    const handleGroup = (e) => {
        navigation.navigate('GroupBookingeScreen', e);
    };
    const removeDulicate = (arr) => {
        const uniqueIds = [];
        const unique = arr.filter((element) => {
            const isDuplicate = uniqueIds.includes(element.id);

            if (!isDuplicate) {
                uniqueIds.push(element.id);

                return true;
            }

            return false;
        });
        return unique;
    };
    const handleCleanRoom = async () => {
        Alert.alert('Confirm', `Xác nhận đã dọn phòng ${cleanRoomName}`, [
            {
                text: 'Hủy',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Xác Nhận',
                onPress: async () => {
                    dispatch(dispatchFecth());
                    await RoomApi.cleanRoom(cleanRoomID, token)
                        .then((result) => {
                            refreshData(), hideModal();
                        })
                        .catch((err) => {
                            Alert.alert('Server Error !', 'Contact to supporter !');
                        })
                        .finally(() => dispatch(dispatchSuccess()));
                },
            },
        ]);
    };
    const [filterFloor, setFilterFloor] = useState(true);
    let floorlist = [];
    let categoryList = [];
    try {
        const filterRoom = () => {
            if (datas.length > 0) {
                datas.map((data) => {
                    floorlist.push({
                        id: data.floor,
                        floor: data.floor,
                    });
                    categoryList.push({
                        id: data.categoryId,
                        categoryName: data.categoryName,
                    });
                });
                floorlist = removeDulicate(floorlist);
                categoryList = removeDulicate(categoryList);
                const test = datas.filter((data) => {
                    return data.floor == floorlist[0].floor;
                });
            }
        };
        filterRoom();
    } catch (error) {}
    const handleSearch = () => {
        dispatch(dispatchFecth());
        RoomApi.GetStatusSearch(totalNight, token)
            .then((result) => setDatas(result))
            .catch((err) => console.log(err.respones))
            .finally(() => dispatch(dispatchSuccess()));
    };
    const handleFilterFloor = () => {
        setFilterFloor(true);
    };
    const handleFilterCategory = () => {
        setFilterFloor(false);
    };
    useEffect(() => {
        if (searchRoom.length > 0) {
            const news = datatmp.filter((e) => e.roomName.match(searchRoom));
            setDatas(news);
        } else {
            setDatas(datatmp);
        }
        return () => {
            console.log('done');
        };
    }, [searchRoom]);
    const handleSelectMore = () => {
        if (selectMore) {
        }
        setSelectMore(true);
        const newData = datas.filter((e) => e.allStatus !== 2);
        setDatas(newData);
    };
    const handleSelectMoreRoom = (roomId) => {
        const filter = listSelectMore.filter((e) => e === roomId);
        if (filter.length > 0) {
            const newData = listSelectMore.filter((e) => e !== roomId);
            SetListSelectMore(newData);
            console.log(newData);
        } else {
            SetListSelectMore([...listSelectMore, roomId]);
            console.log([...listSelectMore, roomId]);
        }
    };
    const handleCancelSelectMore = () => {
        setSelectMore(false);
        setDatas(datatmp);
        refreshData();
    };
    const handleSubmitSelectMore = () => {
        if (listSelectMore.length > 1) {
            setIsCheckIn(true);
        } else {
            Alert.alert(
                'Warning !',
                'Đây là tính năng check in nhiều phòng nên cần chọn ít nhất 2 phòng để thực hiện thao tác này .',
            );
        }
    };
    const [isCheckIn, setIsCheckIn] = useState(false);
    const handleSubmitcheckIn = () => {
        let listroom = [];
        listSelectMore.forEach((e) => {
            listroom.push({
                roomId: e,
                totalRoomPrice: totalPrice / listSelectMore.length,
            });
        });
        console.log(listroom);
        if (listroom.length > 0) {
            dispatch(dispatchFecth());
            RoomApi.CheckInRooms(listroom, hotelId, totalNight, userEmail, isPayment, deposit, [], token, userId)
                .then((result) => {
                    dispatch(dispatchSuccess());
                    console.log(result);
                    setDeposit(0);
                    setUserEmail('');
                    setIsCheckIn(!isCheckIn);
                    setTotalPrice(0);
                    setTotalNight(1);
                    refreshData();
                    setSelectMore(!selectMore);
                })
                .catch((err) => {
                    console.log(err.response), dispatch(dispatchFailed());
                });
        }
    };
    const [visible, setVisible] = useState(false);
    const hideModal = () => setVisible(false);
    const [qrCode, setQRcode] = useState('');
    const [cleanRoomID, setCleanRoomId] = useState('');
    const [cleanRoomName, setCleanRoomName] = useState('');
    const handleCleanRoomed = ({ roomName, roomId }) => {
        setVisible(true);
        setCleanRoomId(roomId);
        setCleanRoomName(roomName);
        setQRcode('');
    };
    const getCleanRoomQrCode = () => {
        dispatch(dispatchFecth());
        RoomApi.getCleanRoomQR(cleanRoomID, token)
            .then((result) => setQRcode(result.qrStaffUrl))
            .catch(() => {
                Alert.alert('Sorry!', 'Server is Error !');
            })
            .finally(() => dispatch(dispatchSuccess()));
    };
    return (
        <Provider>
            <View style={{ flex: 1, marginTop: 20 }}>
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={{
                            backgroundColor: 'white',
                            padding: 20,
                            width: width - 40,
                            marginLeft: 20,
                            marginRight: 20,
                        }}
                    >
                        {qrCode !== '' ? (
                            <Image
                                source={{
                                    uri: qrCode,
                                }}
                                borderRadius={24}
                                style={{ width: '100%', height: width - 40 }}
                            />
                        ) : (
                            <View>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Room {cleanRoomName}</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-around',
                                    }}
                                >
                                    <Text>QR Code Clean Room :</Text>
                                    <Icon
                                        name="qrcode-scan"
                                        size={30}
                                        color={'#000'}
                                        onPress={() => getCleanRoomQrCode()}
                                    ></Icon>
                                </View>
                                <View style={{ marginTop: 15, alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => handleCleanRoom()}>
                                        <Button mode="contained" icon={'broom'} style={{ width: '50%' }}>
                                            Cleaned
                                        </Button>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Modal>
                </Portal>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={styles.back}>
                            <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>{title}</Text>
                </View>
                <View style={styles.container}>
                    <ScrollView>
                        {(filterFloor ? floorlist : categoryList).map((floor, index) => {
                            return (
                                <View style={{ height: 100 }} key={index}>
                                    <ScrollView horizontal={true}>
                                        <View style={{ padding: 10 }}>
                                            <View>
                                                <Text style={{ fontSize: 16, fontWeight: '700', paddingLeft: 15 }}>
                                                    {filterFloor ? `Lầu${floor.floor + 1} ` : floor.categoryName}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    paddingRight: 20,
                                                    paddingLeft: 20,
                                                    paddingTop: 5,
                                                }}
                                            >
                                                {datas.map((data, index) => {
                                                    if (
                                                        filterFloor
                                                            ? data.floor === floor.floor
                                                            : data.categoryId === floor.id
                                                    ) {
                                                        return (
                                                            <View
                                                                key={data + index}
                                                                style={
                                                                    selectMore
                                                                        ? listSelectMore.find((e) => e === data.roomId)
                                                                            ? {
                                                                                  borderWidth: 1,
                                                                                  marginLeft: 10,
                                                                                  marginRight: 10,
                                                                                  borderColor: '#2EC4B6',
                                                                              }
                                                                            : {
                                                                                  borderWidth: 1,
                                                                                  marginLeft: 10,
                                                                                  marginRight: 10,
                                                                              }
                                                                        : { marginLeft: 5, marginRight: 5 }
                                                                }
                                                            >
                                                                {selectMore ? (
                                                                    listSelectMore.find((e) => e === data.roomId) ? (
                                                                        <Icon
                                                                            name="checkbox-outline"
                                                                            size={16}
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: -10,
                                                                                left: 0,
                                                                                backgroundColor: '#F1F3F0',
                                                                                color: '#2EC4B6',
                                                                            }}
                                                                        ></Icon>
                                                                    ) : (
                                                                        <Icon
                                                                            name="checkbox-blank-outline"
                                                                            size={16}
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: -10,
                                                                                left: 0,
                                                                                backgroundColor: '#F1F3F0',
                                                                            }}
                                                                        ></Icon>
                                                                    )
                                                                ) : (
                                                                    <></>
                                                                )}

                                                                <TouchableOpacity
                                                                    style={[
                                                                        {
                                                                            paddingRight: 15,
                                                                            paddingLeft: 15,
                                                                            alignItems: 'center',
                                                                        },
                                                                    ]}
                                                                    onPress={() => {
                                                                        if (!selectMore) {
                                                                            let flag = true;
                                                                            listBooking.map((e, indexBooking) => {
                                                                                if (
                                                                                    e.bookingId === data.bookingId &&
                                                                                    e.count > 1 &&
                                                                                    e.bookingId !== null
                                                                                ) {
                                                                                    handleGroup(e);
                                                                                    flag = false;
                                                                                }
                                                                            });
                                                                            if (flag) {
                                                                                if (data.allStatus == 3) {
                                                                                    handleCleanRoomed({
                                                                                        roomName: data.roomName,
                                                                                        roomId: data.roomId,
                                                                                    });
                                                                                } else {
                                                                                    handleRoom({
                                                                                        roomName: data.roomName,
                                                                                        status: data.allStatus,
                                                                                        roomId: data.roomId,
                                                                                    });
                                                                                }
                                                                            }
                                                                        } else {
                                                                            if (
                                                                                data.allStatus === 1 ||
                                                                                data.allStatus === 3
                                                                            ) {
                                                                                handleSelectMoreRoom(data.roomId);
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    {listBooking.map((e, indexBooking) => {
                                                                        if (
                                                                            e.bookingId === data.bookingId &&
                                                                            e.count > 1 &&
                                                                            e.bookingId !== null
                                                                        ) {
                                                                            return (
                                                                                <View
                                                                                    style={{
                                                                                        position: 'absolute',
                                                                                        top: 0,
                                                                                        right: 5,
                                                                                    }}
                                                                                    key={`${e.bookingId}-${index}`}
                                                                                >
                                                                                    <Icon
                                                                                        name="bookmark"
                                                                                        size={16}
                                                                                        style={{
                                                                                            color: colorData[
                                                                                                indexBooking
                                                                                            ],
                                                                                        }}
                                                                                    ></Icon>
                                                                                </View>
                                                                            );
                                                                        }
                                                                    })}

                                                                    <Icon
                                                                        name="home"
                                                                        size={24}
                                                                        color={
                                                                            data.allStatus == 2
                                                                                ? '#3DC5B5'
                                                                                : data.allStatus == 3
                                                                                ? '#E31717'
                                                                                : data.allStatus == 1
                                                                                ? '#000'
                                                                                : '#F9A000'
                                                                        }
                                                                    ></Icon>
                                                                    <Text>{data.roomName}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })}
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            );
                        })}
                    </ScrollView>
                    {route.params.index === 2 ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                paddingBottom: 5,
                                paddingTop: 5,
                            }}
                        >
                            <TouchableOpacity onPress={handleFilterFloor}>
                                <View
                                    style={{
                                        height: 36,
                                        width: 160,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#3DC5B5',
                                        borderRadius: 24,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>Lọc theo lầu</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleFilterCategory}>
                                <View
                                    style={{
                                        height: 36,
                                        width: 160,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'orange',
                                        borderRadius: 24,
                                    }}
                                >
                                    <Text>Lọc theo loại phòng</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <></>
                    )}
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        marginBottom: 10,
                    }}
                >
                    {selectMore ? (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            <TouchableOpacity
                                style={{
                                    width: 120,
                                    height: 32,
                                    backgroundColor: '#d34127',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                }}
                                onPress={() => handleCancelSelectMore()}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 120,
                                    height: 32,
                                    backgroundColor: '#0d6efd',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                }}
                                onPress={() => handleSubmitSelectMore()}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>Check In</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={{
                                width: 140,
                                height: 32,
                                backgroundColor: '#0d6efd',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                            }}
                            onPress={() => handleSelectMore()}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>Chọn nhiều phòng</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.search}>
                    <TextInput
                        mode="outlined"
                        label="Search"
                        right={<TextInput.Icon name="magnify" />}
                        style={{ width: '80%', height: 24, top: -3 }}
                        value={searchRoom}
                        onChangeText={(e) => setSearchRoom(e)}
                    ></TextInput>
                </View>
                <View style={styles.footer}>
                    {route.params.index === 2 ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                height: '100%',
                                width: '100%',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text>Total Night:</Text>
                                <Picker
                                    style={{ width: 100 }}
                                    selectedValue={totalNight}
                                    onValueChange={(e) => setTotalNight(e)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((element) => {
                                        return (
                                            <Picker.Item
                                                label={`${element} Đêm`}
                                                value={element}
                                                key={element}
                                            ></Picker.Item>
                                        );
                                    })}
                                </Picker>
                            </View>
                            <TouchableOpacity onPress={handleSearch}>
                                <View
                                    style={{
                                        height: 36,
                                        width: 160,
                                        borderRadius: 24,
                                        backgroundColor: '#3DC5B5',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Search</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : route.params.index === 1 ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <TouchableOpacity onPress={handleFilterFloor}>
                                <View
                                    style={{
                                        height: 36,
                                        width: 160,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#3DC5B5',
                                        borderRadius: 24,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>Lọc theo lầu</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleFilterCategory}>
                                <View
                                    style={{
                                        height: 36,
                                        width: 160,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'orange',
                                        borderRadius: 24,
                                    }}
                                >
                                    <Text>Lọc theo loại phòng</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <></>
                    )}
                </View>
                <View
                    style={{
                        position: 'absolute',
                        height: height - ((height * 2) / 20 + (Platform.OS === 'android' ? 210 : 270)),
                        width: width,
                        bottom: 0,
                        zIndex: isCheckIn ? 1 : -100,
                    }}
                >
                    {isCheckIn ? (
                        <View
                            style={{
                                height: '100%',
                                width: '100%',
                                position: 'absolute',
                                backgroundColor: '#fff',
                                borderColor: '#3DC5B5',
                                borderWidth: 2,
                                borderTopRightRadius: 15,
                                borderTopLeftRadius: 15,
                                borderBottomWidth: 0,
                                flex: 1,
                            }}
                        >
                            <View style={{ height: '100%', width: '100%' }}>
                                <View
                                    style={{
                                        padding: 10,
                                        paddingRight: 20,
                                        paddingLeft: 20,
                                        borderBottomColor: '#D5F3F0',
                                        borderBottomWidth: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flex: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: '600',
                                        }}
                                    >
                                        Check In
                                    </Text>
                                    <Text>
                                        <TouchableOpacity onPress={() => setIsCheckIn(!isCheckIn)}>
                                            <Icon name="close-outline" size={24}></Icon>
                                        </TouchableOpacity>
                                    </Text>
                                </View>
                                <View style={{ flex: 9 }}>
                                    <ScrollView
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            paddingTop: 5,
                                            paddingLeft: 15,
                                            paddingRight: 20,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.fontText}>Total Night:</Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginLeft: 30,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        totalNight > 1 ? setTotalNight(parseInt(totalNight) - 1) : '';
                                                    }}
                                                >
                                                    <Icon name="arrow-down" size={36}></Icon>
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={{
                                                        height: 40,
                                                        width: 60,
                                                        borderRadius: 20,
                                                        borderColor: '#000',
                                                        borderWidth: 1,
                                                        textAlign: 'center',
                                                    }}
                                                    keyboardType="numeric"
                                                    defaultValue={`${totalNight}`}
                                                    value={`${totalNight}`}
                                                    onChangeText={(e) => {
                                                        setTotalNight(parseInt(e));
                                                    }}
                                                    onBlur={() => {
                                                        if (totalNight < 1) {
                                                            setTotalNight(1);
                                                        }
                                                    }}
                                                ></TextInput>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setTotalNight(totalNight + 1);
                                                    }}
                                                >
                                                    <Icon name="arrow-up" size={36}></Icon>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <InputCompunent
                                            title={'Tổng Tiền Phòng'}
                                            placeholder={'Example : 200'}
                                            sub={'VNĐ'}
                                            keyboardType="numeric"
                                            setInput={setTotalPrice}
                                        ></InputCompunent>
                                        <InputCompunent
                                            title={'Email:'}
                                            placeholder={'Email of customer'}
                                            sub={''}
                                            setInput={setUserEmail}
                                        ></InputCompunent>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Checkbox
                                                status={isPayment ? 'checked' : 'unchecked'}
                                                onPress={() => setisPayment(!isPayment)}
                                            ></Checkbox>
                                            <Text style={styles.fontText}>Đã Thanh Toán</Text>
                                        </View>
                                        <InputCompunent
                                            title={'Đã Nhận'}
                                            placeholder={'Số Tiền Đã Nhận'}
                                            sub={'VNĐ'}
                                            setInput={setDeposit}
                                            keyboardType={'numeric'}
                                        ></InputCompunent>
                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                style={{
                                                    width: 160,
                                                    height: 38,
                                                    backgroundColor: '#2EC4B6',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 10,
                                                    marginBottom: 10,
                                                }}
                                                onPress={() => handleSubmitcheckIn()}
                                            >
                                                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <></>
                    )}
                </View>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    fontText: {
        fontSize: 16,
        fontWeight: '600',
    },
    search: {
        flex: 1,
        borderTopColor: '#3DC5B5',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    header: { flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
    header_title: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
        marginLeft: 15,
    },
    container: {
        flex: 14,
    },
    footer: {
        flex: 2,
        borderTopColor: '#3DC5B5',
        borderTopWidth: 1,
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
});
export default ViewStatusRoom;
