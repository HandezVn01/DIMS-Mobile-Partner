import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as RoomApi from '../../Api/RoomApi';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFailed, dispatchFecth, dispatchSuccess } from '../../redux/actions/authAction';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import Customer from '../../Components/RoomScreen/Customer';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import Itemlist from '../../Components/RoomScreen/CheckOut/Itemlist';
const GroupBookingScreen = ({ route }) => {
    const navigation = useNavigation();
    const params = route.params;
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const [data, setDatas] = useState([]);
    const [list, setList] = useState([]);
    const [list2, setList2] = useState([]);
    const [showAddItem, setShowAddItem] = useState(false);
    const getInfo = () => {
        RoomApi.GetBookingInfo(params.bookingId, token).then((result) => {
            setDatas(result);
            setList(result.inboundUsers);
            let priceTmp = 0;
            result.bookingDetails.forEach((e) => {
                priceTmp = priceTmp + e.averagePrice;
            });
            setRoomsPrice(priceTmp);
        });
    };
    const MenuList = useState(useSelector((state) => state.menuReducer.data) || []);
    const getItemList = (data) => {
        let list = [];
        MenuList[0].forEach((item, index) => {
            list.push({
                itemName: item.menuName,
                itemType: item.menuType,
                itemPrice: item.menuPrice,
                itemTYPE: item.menuType === 'WATER' ? 1 : item.menuType === 'SERVICE' ? 3 : 2,
                quantity: '0',
                itemStatus: item.menuStatus,
                itemid: item.menuId,
                bookingDetailMenuId: '',
            });
        });
        try {
            if (data.length > 0) {
                list.forEach((item, index) => {
                    data.forEach((used) => {
                        if (item.itemid === used.menuId) {
                            item.quantity = used.bookingDetailMenuQuanity;
                            item.bookingDetailMenuId = used.bookingDetailMenuId;
                        }
                    });
                });
                data.forEach((used) => {
                    if (used.menuId === null) {
                        list.push({
                            itemName: used.bookingDetailMenuName,
                            itemType: '',
                            itemPrice: used.bookingDetailMenuPrice,
                            itemTYPE: '',
                            quantity: used.bookingDetailMenuQuanity,
                            itemStatus: false,
                            itemid: null,
                            bookingDetailMenuId: used.bookingDetailMenuId,
                        });
                    }
                });
            }
        } catch (error) {}

        list.sort(function (a, b) {
            return a.itemTYPE - b.itemTYPE;
        });
        return list;
    };
    const [itemListUse, setItemListUse] = useState(MenuList[0]);
    const [extraFee, setExtraFee] = useState(0);
    const [reasonExtra, setReasonExtra] = useState('');
    const [RoomsPrice, setRoomsPrice] = useState('');

    const AddItem = (data, bookingDetailId) => {
        // console.log(data);
        const newlist = getItemList(data);
        setItemListUse(newlist);
        setShowAddItem(true);
        setBookingDetailId(bookingDetailId);
    };
    useEffect(() => {
        getInfo();
        return () => {
            console.log('done');
        };
    }, []);
    const [sound, setSound] = React.useState();
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/beep.mp3'));
        setSound(sound);
        await sound.playAsync();
    }
    const handleAddUsedItem = () => {
        setShowAddItem(true);
    };
    const [hasPermission, setHasPermission] = useState(false);
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
    const handleAddCustomer = () => {
        setHasPermission(!hasPermission);
    };
    const [datatmp, setDataTmp] = useState('');
    const [bookingDetailId, setBookingDetailId] = useState('');
    const handleBarCodeScanned = ({ type, data }) => {
        if (data !== datatmp) {
            alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
    };
    const handleModifyAddCustomer = async () => {
        dispatch(dispatchFecth());
        await RoomApi.updateCustomerInBooking(hotelId, params.bookingId, list2, token)
            .then((result) => {
                Alert.alert('Update Success!');
                setHasPermission(false);
                getInfo();
            })
            .catch((err) => {
                Alert.alert('Error ! ', 'Token your account is expired! Please Login Again ! ');
                dispatch(dispatchLogout());
            })
            .finally(() => dispatch(dispatchSuccess()));
    };
    const handleSubmitUsedItem = () => {
        setShowAddItem(false);

        let usedItem = [];
        itemListUse.map((item) => {
            if (item.itemid !== null) {
                usedItem.push({
                    bookingDetailId: bookingDetailId,
                    menuId: item.itemid,
                    bookingDetailMenuQuanity: item.quantity,
                });
            }
        });
        if (usedItem.length > 0) {
            dispatch(dispatchFecth());
            RoomApi.AddUsedItem(usedItem, token)
                .then((result) => {
                    getInfo();
                    dispatch(dispatchSuccess());
                })
                .catch((err) => {
                    console.log(err.response);
                    dispatch(dispatchFailed());
                });
        }
        if (extraFee > 0) {
            try {
                RoomApi.AddExtraFee(
                    [
                        {
                            bookingDetailId: bookingDetailId,
                            problemDetailMenuName: reasonExtra,
                            price: extraFee,
                        },
                    ],
                    token,
                )
                    .then((result) => {
                        setExtraFee(0);
                        setReasonExtra('');
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => dispatch(dispatchSuccess()));
            } catch (error) {}
        }
    };
    const handleSumTotal = ({ quantity, price, itemName }) => {
        itemListUse.map((item) => {
            return item.itemName === itemName ? (item.quantity = quantity) : '';
        });
    };
    const handleRemoveItemUsed = (bookingDetailMenuId, bookingDetailId) => {
        Alert.alert('Delete', 'Bạn muốn xóa ?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(dispatchFecth());
                    RoomApi.DeleteUsedItem(bookingDetailId, bookingDetailMenuId, token)
                        .then((result) => getInfo())
                        .catch((err) => console.log(err))
                        .finally(() => dispatch(dispatchSuccess()));
                },
            },
        ]);
    };
    const handleCheckOut = () => {
        Alert.alert('Check Out', `Xác nhận Check Out !`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(dispatchFecth());
                    RoomApi.CheckOut(hotelId, data.bookingId, token)
                        .then((result) => {
                            Alert.alert('Success', 'Đã Check Out Thành Công!');
                            dispatch(dispatchSuccess());
                            navigation.goBack();
                        })
                        .catch((err) => Alert.alert('Error', 'Xin Lỗi Server đang lỗi !'))
                        .finally(() => {
                            dispatch(dispatchSuccess());
                        });
                },
            },
        ]);
    };
    return (
        <SafeAreaView style={{ flex: 1, marginTop: 20, overflow: 'hidden' }}>
            {showAddItem ? (
                <View style={styles.showPopup}>
                    <View style={styles.PopupContainer}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 20,
                                paddingTop: 5,
                                paddingBottom: 5,
                                borderBottomWidth: 1,
                                alignItems: 'center',
                                flex: 1,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#3DC5B5' }}>Used Item </Text>
                            <TouchableOpacity onPress={() => setShowAddItem(!showAddItem)}>
                                <Icon name="close" size={30}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 9,
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingTop: 10,
                                paddingBottom: 20,
                            }}
                        >
                            <ScrollView>
                                {itemListUse.map((item, index) => {
                                    if (item.itemStatus) {
                                        return (
                                            <Itemlist
                                                itemName={item.itemName}
                                                itemPrice={item.itemPrice}
                                                itemType={item.itemType}
                                                itemUse={item.quantity}
                                                key={`a${index}b`}
                                                handleSum={(e) =>
                                                    handleSumTotal({
                                                        quantity: e,
                                                        price: item.itemPrice,
                                                        itemName: item.itemName,
                                                    })
                                                }
                                            ></Itemlist>
                                        );
                                    }
                                    return <></>;
                                })}
                            </ScrollView>
                        </View>
                        <View
                            style={{
                                flex: 2.5,
                                paddingLeft: 20,
                                paddingRight: 20,
                            }}
                        >
                            {/* Extra Fee */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Text>Extra Fee :</Text>
                                <TextInput
                                    style={{
                                        height: 36,
                                        width: 120,
                                        borderColor: '#000',
                                        borderWidth: 1,
                                        borderRadius: 24,
                                        paddingLeft: 15,
                                    }}
                                    value={extraFee}
                                    placeholder={'Extra Fee'}
                                    keyboardType={'numeric'}
                                    onChangeText={(e) => setExtraFee(e)}
                                ></TextInput>
                                <Text>VNĐ</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <Text>Reason :</Text>
                                <TextInput
                                    style={{
                                        height: 36,
                                        width: 250,
                                        borderColor: '#000',
                                        borderWidth: 1,
                                        borderRadius: 24,
                                        paddingLeft: 15,
                                    }}
                                    value={reasonExtra}
                                    placeholder={'Reason of Extra Fee '}
                                    onChangeText={(e) => setReasonExtra(e)}
                                ></TextInput>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1.5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopColor: '#3DC5B5',
                                borderTopWidth: 1,
                            }}
                        >
                            <TouchableOpacity onPress={handleSubmitUsedItem}>
                                <View
                                    style={{
                                        height: 36,
                                        width: 120,
                                        backgroundColor: '#3DC5B5',
                                        borderRadius: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text>Submit</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <></>
            )}
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
                    <View
                        style={{
                            paddingLeft: 30,
                            paddingBottom: 10,
                            width: '100%',
                            borderBottomWidth: 1,
                            borderBottomColor: '#938D8D',
                        }}
                    >
                        <View style={styles.customerlist_header}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#3DC5B5',
                                }}
                            >
                                List Room
                            </Text>
                        </View>

                        {data.bookingDetails ? (
                            <ScrollView horizontal>
                                {data.bookingDetails.map((item) => {
                                    return (
                                        <View key={item.bookingDetailId}>
                                            <TouchableOpacity
                                                style={[
                                                    {
                                                        paddingRight: 20,
                                                        paddingLeft: 20,
                                                        alignItems: 'center',
                                                    },
                                                ]}
                                            >
                                                <Icon name="home" size={24} color={'#3DC5B5'}></Icon>

                                                {params.roomId.map((e, index) => {
                                                    if (e == item.roomId) {
                                                        return (
                                                            <Text key={`asdasdasd${index}`}>
                                                                {' '}
                                                                {params.roomName[index]}
                                                            </Text>
                                                        );
                                                    }
                                                })}
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        ) : (
                            <></>
                        )}
                    </View>
                    <View style={styles.card_content}>
                        <Text style={styles.card_content_text}>
                            CheckIn Date:{' '}
                            <Text style={styles.card_data}>
                                {moment(data.qrCheckUp ? data.qrCheckUp.checkIn : undefined).format(
                                    'HH:MM , DD-MM-YYYY',
                                )}
                            </Text>
                        </Text>
                        <Text style={styles.card_content_text}>
                            CheckOut Date:{' '}
                            <Text style={styles.card_data}>{moment(data.endDate).format('DD-MM-YYYY')}</Text>
                        </Text>
                        <Text style={styles.card_content_text}>
                            Type: <Text style={styles.card_data}>{data.paymentMethod}</Text>
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
                            Room Price:
                            <Text style={styles.price_number}>
                                <NumberFormat
                                    value={RoomsPrice * 1000}
                                    thousandSeparator={true}
                                    displayType={'text'}
                                    renderText={(value) => (
                                        <Text>
                                            {' '}
                                            {value}{' '}
                                            <Text style={[styles.price_currency, { color: '#53A1FD' }]}> VNĐ</Text>
                                        </Text>
                                    )}
                                ></NumberFormat>
                            </Text>
                        </Text>
                        <Text style={styles.card_content_text}>
                            ExtraFee:
                            <Text style={styles.price_number}>
                                <NumberFormat
                                    value={(data.totalPrice - RoomsPrice) * 1000}
                                    thousandSeparator={true}
                                    displayType={'text'}
                                    renderText={(value) => (
                                        <Text>
                                            {' '}
                                            {value}{' '}
                                            <Text style={[styles.price_currency, { color: '#53A1FD' }]}> VNĐ</Text>
                                        </Text>
                                    )}
                                ></NumberFormat>
                            </Text>
                        </Text>
                        <Text style={styles.card_content_text}>
                            Total:
                            <Text style={styles.price_number}>
                                <NumberFormat
                                    value={(data.totalPrice - data.deposit) * 1000}
                                    thousandSeparator={true}
                                    displayType={'text'}
                                    renderText={(value) => (
                                        <Text>
                                            {' '}
                                            {value}{' '}
                                            <Text style={[styles.price_currency, { color: '#53A1FD' }]}> VNĐ</Text>
                                        </Text>
                                    )}
                                ></NumberFormat>
                            </Text>
                        </Text>
                    </View>
                    {hasPermission === true ? (
                        Platform.OS === 'ios' ? (
                            <Camera
                                style={{
                                    height: 300,
                                    width: '100%',
                                }}
                                type="back"
                                onBarCodeScanned={handleBarCodeScanned}
                                focusDepth={1}
                            ></Camera>
                        ) : (
                            <View
                                style={{
                                    height: 300,
                                    width: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: 500,
                                        width: '100%',
                                    }}
                                >
                                    <BarCodeScanner
                                        onBarCodeScanned={handleBarCodeScanned}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                </View>
                            </View>
                        )
                    ) : (
                        <View />
                    )}
                    <View style={styles.customerlist}>
                        <ScrollView
                            style={{
                                width: '90%',
                                marginTop: 10,
                                marginBottom: 5,
                            }}
                        >
                            <View style={styles.customerlistContainer}>
                                <View style={styles.customerlist_header}>
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
                                {hasPermission === false ? (
                                    <View style={styles.addmorebtn}>
                                        <TouchableOpacity onPress={() => handleAddCustomer()}>
                                            <Text style={{ color: '#2EC4B6' }}>Add Customer</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.bookingDetails}>
                        <ScrollView
                            style={{
                                width: '90%',
                                marginTop: 10,
                                marginBottom: 5,
                            }}
                        >
                            <View style={styles.customerlistContainer}>
                                <View style={styles.customerlist_header}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: '#3DC5B5',
                                        }}
                                    >
                                        List Used Item
                                    </Text>
                                </View>
                                {data.bookingDetails ? (
                                    data.bookingDetails.map((item) => {
                                        return params.roomId.map((e, index) => {
                                            if (e == item.roomId) {
                                                return (
                                                    <View
                                                        key={`usedItem ${item.bookingDetailId}`}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <View style={{ alignItems: 'center' }}>
                                                            <Text
                                                                style={{
                                                                    paddingTop: 10,
                                                                    borderBottomColor: '#938D8D',
                                                                    borderBottomWidth: 1,
                                                                    marginBottom: 10,
                                                                }}
                                                            >
                                                                Room {params.roomName[index]} | Total: {item.extraFee}
                                                            </Text>
                                                            {item.bookingDetailMenus.length > 0 ? (
                                                                item.bookingDetailMenus.map((used) => {
                                                                    return (
                                                                        <View
                                                                            style={{
                                                                                width: '100%',
                                                                                flexDirection: 'row',
                                                                                borderBottomWidth: 1,
                                                                                borderBottomColor: '#D9D9D9',
                                                                            }}
                                                                        >
                                                                            <View style={{ flex: 5 }}>
                                                                                <Text>
                                                                                    {used.bookingDetailMenuName}
                                                                                </Text>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 3,

                                                                                    alignItems: 'center',
                                                                                }}
                                                                            >
                                                                                <Text>
                                                                                    Price: {used.bookingDetailMenuPrice}
                                                                                    k
                                                                                </Text>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,

                                                                                    alignItems: 'center',
                                                                                }}
                                                                            >
                                                                                <Text>
                                                                                    x {used.bookingDetailMenuQuanity}
                                                                                </Text>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,

                                                                                    alignItems: 'center',
                                                                                }}
                                                                            >
                                                                                <Icon
                                                                                    name="close"
                                                                                    size={24}
                                                                                    onPress={() =>
                                                                                        handleRemoveItemUsed(
                                                                                            used.bookingDetailMenuId,
                                                                                            used.bookingDetailId,
                                                                                        )
                                                                                    }
                                                                                ></Icon>
                                                                            </View>
                                                                        </View>
                                                                    );
                                                                })
                                                            ) : (
                                                                <></>
                                                            )}
                                                            <View style={styles.addmorebtn}>
                                                                <TouchableOpacity
                                                                    onPress={() =>
                                                                        AddItem(
                                                                            item.bookingDetailMenus,
                                                                            item.bookingDetailId,
                                                                        )
                                                                    }
                                                                >
                                                                    <Text style={{ color: '#2EC4B6' }}>Add Item</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            }
                                        });
                                    })
                                ) : (
                                    <></>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 1.8, flexDirection: 'row', alignItems: 'center' }}>
                {hasPermission ? (
                    <View
                        style={{
                            height: '100%',
                            width: '100%',
                            borderWidth: 2,
                            borderColor: '#2EC4B6',
                            backgroundColor: '#FFF',
                            borderBottomWidth: 0,
                            borderTopWidth: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                handleModifyAddCustomer();
                            }}
                        >
                            <View
                                style={{
                                    width: 160,
                                    height: 40,
                                    backgroundColor: '#3DC5B5',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>Submit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                        style={{
                            height: '100%',
                            width: '100%',
                            borderWidth: 2,
                            borderColor: '#2EC4B6',
                            backgroundColor: '#FFF',
                            borderBottomWidth: 0,
                            borderTopWidth: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                handleCheckOut();
                            }}
                        >
                            <View
                                style={{
                                    width: 160,
                                    height: 40,
                                    backgroundColor: '#3DC5B5',
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>Check Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    showPopup: {
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    price_currency: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
    },
    // price_number: {
    //     fontSize: 16,
    //     fontWeight: '600',
    //     lineHeight: 24,
    //     color: '#53A1FD',
    // },
    PopupContainer: {
        position: 'relative',
        backgroundColor: '#FFF',
        height: '85%',
        width: '90%',
        opacity: 1,
        borderRadius: 20,
        zIndex: 1,
    },
    bookingDetails: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        borderTopColor: '#938D8D',
        borderTopWidth: 1,
    },
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
    customerlist: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        borderTopColor: '#938D8D',
        borderTopWidth: 1,
    },
    customerlistContainer: {
        width: '100%',
        alignItems: 'center',
    },
    customerlist_header: {
        height: 30,
        width: '90%',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#938D8D',
        borderBottomWidth: 1,
    },
});
export default GroupBookingScreen;
