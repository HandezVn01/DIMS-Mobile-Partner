import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    Animated,
    Alert,
    SafeAreaView,
    TextInput,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Customer from '../../Components/RoomScreen/Customer';
import ItemUsed from '../../Components/RoomScreen/ItemUsed';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
import Itemlist from '../../Components/RoomScreen/CheckOut/Itemlist';
import Footer from '../../Components/RoomScreen/Footer';
import InputCompunent from '../../Components/RoomScreen/CheckInNav/InputCompunent';
import { Checkbox } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import * as RoomApi from '../../Api/RoomApi';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFailed, dispatchFecth, dispatchLogout, dispatchSuccess } from '../../redux/actions/authAction';
var { width, height } = Dimensions.get('window');
const RoomDetailScreen = ({ route }) => {
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(false);
    const [datatmp, setDataTmp] = useState('');
    const [sound, setSound] = React.useState();
    const [checkOutShow, setCheckOutShow] = useState(false);
    const [changeState, setChangeState] = useState(false);
    // Get infomation from params
    const roomName = route.params.roomName;
    const [status, setStatus] = useState(route.params.status);
    const roomid = route.params.roomId;
    const [data, setData] = useState(route.params.data);
    const [usedItem, setUsedItem] = useState(route.params.usedItem || []);
    const MenuList = useState(useSelector((state) => state.menuReducer.data) || []);
    // Create State for Check In
    const [isPayment, setisPayment] = useState(false);
    const [totalNight, setTotalNight] = useState(1);
    const [totalPrice, setTotalPrice] = useState(10000);
    const [deposit, setDeposit] = useState(0);
    const [userEmail, setUserEmail] = useState('');
    // Create State for Add ExtraFee
    const [extraFee, setExtraFee] = useState(0);
    const [reasonExtra, setReasonExtra] = useState('');
    // API Get Data
    const checkoutShowRef = useRef(new Animated.Value(0)).current;
    const [total, setTotal] = useState(parseInt(data.totalPrice) - parseInt(data.deposit));
    const totalTmp =
        data.paymentCondition === 'True' ? 0 : parseInt(data.totalPrice - usedItem.extraFee) - parseInt(data.deposit);
    const checkInSuccess = async () => {
        await RoomApi.getRoomInfo(roomid, token)
            .then((result) => {
                console.log(result);
                setData(result);
            })
            .catch((err) => {});
    };
    let itemList = [];
    const getItemList = () => {
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
            if (usedItem.bookingDetailMenus.length > 0) {
                list.forEach((item, index) => {
                    usedItem.bookingDetailMenus.forEach((used) => {
                        if (item.itemid === used.menuId) {
                            item.quantity = used.bookingDetailMenuQuanity;
                            item.bookingDetailMenuId = used.bookingDetailMenuId;
                        }
                    });
                });
                usedItem.bookingDetailMenus.forEach((used) => {
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
    itemList = getItemList();
    const [list, setList] = useState(data.lsCustomer || []);
    const [list2, setList2] = useState([]);
    const [itemListUse, setItemListUse] = useState(itemList);
    const [actionName, setActionName] = useState(status == 1 ? 'Next' : 'Submit');
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/beep.mp3'));
        setSound(sound);

        await sound.playAsync();
    }
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
    const handleCheckIn = () => {
        let alertStatus = false;
        let alertMsg = '';
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (userEmail.length < 1) {
            alertStatus = true;
            alertMsg = alertMsg + 'Email is Empty ! \n Please input Email for customer receive key qr code ! \n';
        }
        if (reg.test(userEmail) === false) {
            alertStatus = true;
            alertMsg = alertMsg + 'Email is not correct \n';
        }
        if (alertStatus) {
            Alert.alert('Warning', alertMsg);
        } else {
            // setActionName('Next');
            dispatch(dispatchFecth());
            try {
                const check = RoomApi.CheckRoomDateBooking(hotelId, roomid, totalNight, token);
                check
                    .then((result) => {
                        dispatch(dispatchSuccess());
                        setHasPermission(!hasPermission); // Camera On
                        setCheckOutShow(!checkOutShow); // Popup Show off
                    })
                    .catch((err) => {
                        dispatch(dispatchFailed());
                        Alert.alert('Error', err);
                    });
            } catch (error) {}
        }
    };
    const handleCheckInSubmit = async () => {
        setHasPermission(!hasPermission); // Camera Off

        dispatch(dispatchFecth());
        await RoomApi.CheckInRoom(roomid, hotelId, totalNight, userEmail, totalPrice, isPayment, deposit, list2, token)
            .then((result) => {
                Alert.alert('Success', 'Checkin Success');
                checkInSuccess();
                setStatus(2);
            })
            .catch((errors) => {});
        dispatch(dispatchSuccess());
    };
    const handleCheckOutSubmit = async () => {
        Alert.alert('Check Out', 'Xác nhận hoàn tất thủ tục check out !', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'OK', onPress: () => checkout() },
        ]);
        const checkout = async () => {
            dispatch(dispatchFecth());
            await handleSubmitUsedItem();
            await RoomApi.CheckOut(hotelId, data.bookingId, token)
                .then((result) => {
                    Alert.alert('Success', 'Đã Check Out Thành Công!');
                    navigation.goBack();
                })
                .catch((err) => Alert.alert('Error', 'Xin Lỗi Server đang lỗi !'));
            setCheckOutShow(!checkOutShow);
            dispatch(dispatchSuccess());
        };
    };
    const handleShowUp = () => {
        if (checkOutShow) {
            Animated.timing(checkoutShowRef, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(checkoutShowRef, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
        setCheckOutShow(!checkOutShow);
    };
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
        })();
    }, []);
    const handleAddCustomer = () => {
        setHasPermission(!hasPermission);
    };
    const handleModifyAddCustomer = async () => {
        dispatch(dispatchFecth());
        await RoomApi.updateCustomerInBooking(hotelId, data.bookingId, list2, token)
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
                    console.log(listtmp);
                    setList2(listtmp);
                    setList(newList);
                },
            },
        ]);
    };
    const handleSumTotal = ({ quantity, price, itemName }) => {
        itemListUse.map((item) => {
            return item.itemName === itemName ? (item.quantity = quantity) : '';
        });
        let sum = 0;
        itemListUse.forEach((item) => {
            sum = sum + item.itemPrice * item.quantity;
        });
        setTotal(totalTmp + sum + parseInt(extraFee || 0));
    };
    useEffect(() => {
        let sum = 0;
        itemListUse.forEach((item) => {
            sum = sum + item.itemPrice * item.quantity;
        });
        sum = parseInt(sum) + parseInt(extraFee || 0);
        setTotal(totalTmp + sum);
    }, [extraFee]);
    const [showAddItem, setShowAddItem] = useState(false);
    const handleAddUsedItem = () => {
        setShowAddItem(true);
    };
    const handleSubmitUsedItem = () => {
        setShowAddItem(false);
        let usedItem = [];
        itemListUse.map((item) => {
            if (item.itemid !== null) {
                usedItem.push({
                    bookingDetailId: data.bookingDetailId,
                    menuId: item.itemid,
                    bookingDetailMenuQuanity: item.quantity,
                });
            }
        });
        if (usedItem.length > 0) {
            try {
                dispatch(dispatchFecth());
                RoomApi.AddUsedItem(usedItem, token)
                    .then((result) => dispatch(dispatchSuccess()))
                    .catch((err) => {
                        console.log(err);
                        dispatch(dispatchFailed());
                    });
            } catch (error) {}
        }
        if (extraFee > 0) {
            try {
                RoomApi.AddExtraFee(
                    [
                        {
                            bookingDetailId: data.bookingDetailId,
                            problemDetailMenuName: reasonExtra,
                            price: extraFee,
                        },
                    ],
                    token,
                )
                    .then((result) => {
                        setItemListUse([
                            ...itemListUse,
                            {
                                itemName: reasonExtra,
                                itemType: '',
                                itemPrice: extraFee,
                                itemTYPE: '',
                                quantity: 1,
                                itemStatus: false,
                                itemid: null,
                                bookingDetailMenuId: '',
                            },
                        ]);
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
    const handleRemoveUseItem = (number, bookingDetailMenuId) => {
        Alert.alert('Delete', 'Bạn muốn xóa ?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(dispatchFecth());
                    RoomApi.DeleteUsedItem(data.bookingDetailId, bookingDetailMenuId, token)
                        .then((result) => {
                            const newList = itemListUse.filter((item, index) => index !== number);
                            setItemListUse(newList);
                        })
                        .catch((err) => console.log(err))
                        .finally(() => dispatch(dispatchSuccess()));
                },
            },
        ]);
    };
    return (
        <SafeAreaView style={{ flex: 1, marginTop: 20, overflow: 'hidden' }}>
            {/* Show Add Item Popup */}
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
                                                key={`a${index}`}
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
                <View style={styles.header_content}>
                    <Icon name="home" size={24} color={status == 2 ? '#3DC5B5' : '#000'}></Icon>
                    <Text style={styles.header_title}>Room {roomName}</Text>
                </View>
            </View>

            <View style={[styles.container]}>
                <KeyboardAwareScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.card}>
                            <View style={{ zIndex: 1 }}>
                                {hasPermission === true ? (
                                    Platform.OS === 'ios' ? (
                                        <Camera
                                            style={styles.camera}
                                            type="back"
                                            onBarCodeScanned={handleBarCodeScanned}
                                            focusDepth={1}
                                        ></Camera>
                                    ) : (
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
                                    )
                                ) : (
                                    <View />
                                )}
                            </View>
                            <Image
                                source={require('../../assets/Card.png')}
                                borderRadius={24}
                                style={{ height: '100%', width: '100%' }}
                            />
                            <View style={styles.card_content}>
                                <Text style={styles.card_content_text}>
                                    CheckIn Date:{' '}
                                    <Text style={styles.card_data}>{moment(data.createDate).format('YYYY-MM-DD')}</Text>
                                </Text>
                                <Text style={styles.card_content_text}>
                                    CheckOut Date:{' '}
                                    <Text style={styles.card_data}>{moment(data.endDate).format('YYYY-MM-DD')}</Text>
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
                                            value={(data.totalPrice - usedItem.extraFee) * 1000}
                                            thousandSeparator={true}
                                            displayType={'text'}
                                            renderText={(value) => (
                                                <Text>
                                                    {' '}
                                                    {value}{' '}
                                                    <Text style={[styles.price_currency, { color: 'orange' }]}>
                                                        {' '}
                                                        VNĐ
                                                    </Text>
                                                </Text>
                                            )}
                                        ></NumberFormat>
                                    </Text>
                                </Text>
                            </View>

                            {/* <View style={styles.card_content_price}>
                                {data.totalPrice !== undefined ? (
                                    
                                ) : (
                                    <View></View>
                                )}
                            </View> */}
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'relative',
                            height: height - ((height * 5) / 20 + (Platform.OS === 'android' ? 210 : 270)),
                            width: width,
                        }}
                    >
                        {checkOutShow ? (
                            <Animated.View
                                style={[
                                    {
                                        height: '100%',
                                        width: '100%',
                                        position: 'absolute',
                                        backgroundColor: '#fff',
                                        zIndex: checkoutShowRef,
                                        borderColor: '#3DC5B5',
                                        borderWidth: 2,
                                        borderTopRightRadius: 15,
                                        borderTopLeftRadius: 15,
                                        borderBottomWidth: 0,
                                        flex: 1,
                                    },
                                    { opacity: checkoutShowRef },
                                ]}
                            >
                                {status == 1 || status == 4 ? (
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
                                                Room {roomName} : Check In
                                            </Text>
                                            <Text>
                                                <TouchableOpacity onPress={handleShowUp}>
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
                                                                totalNight > 1 ? setTotalNight(totalNight - 1) : '';
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
                                                                setTotalNight(e);
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
                                            </ScrollView>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ height: '100%', width: '100%' }}>
                                        <View
                                            style={{
                                                paddingRight: 20,
                                                paddingLeft: 20,
                                                borderBottomColor: '#D5F3F0',
                                                borderBottomWidth: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <View style={{ flex: 3 }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#3DC5B5' }}>
                                                    Check Out{' '}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 6 }}>
                                                <Text>
                                                    Total:
                                                    <NumberFormat
                                                        value={total * 1000}
                                                        thousandSeparator={true}
                                                        displayType={'text'}
                                                        renderText={(value) => <Text>{value}</Text>}
                                                    ></NumberFormat>{' '}
                                                    VNĐ
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <TouchableOpacity onPress={handleShowUp}>
                                                    <Icon name="close-outline" size={24}></Icon>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flex: 9 }}>
                                            <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    <Text>Extra Fee:</Text>
                                                    <TextInput
                                                        placeholder="Example: 200"
                                                        style={{
                                                            borderColor: '#000',
                                                            borderWidth: 1,
                                                            height: 30,
                                                            width: 160,
                                                            borderRadius: 20,
                                                            paddingLeft: 15,
                                                        }}
                                                        value={extraFee}
                                                        keyboardType="numeric"
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
                                                <View>
                                                    <Text>Item Fee:</Text>
                                                </View>
                                                {itemListUse.map((item, index) => {
                                                    if (item.itemStatus) {
                                                        return (
                                                            <Itemlist
                                                                itemName={item.itemName}
                                                                itemPrice={item.itemPrice}
                                                                itemType={item.itemType}
                                                                itemUse={item.quantity}
                                                                key={`${index}+${item.itemid}`}
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
                                        {/* <View style={{ flex: 2, alignItems: 'center' }}>
                                            <TouchableOpacity>
                                                <View
                                                    style={{
                                                        height: 40,
                                                        width: 150,
                                                        backgroundColor: '#2EC4B6',
                                                        borderRadius: 20,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: '#fff',
                                                            fontSize: 20,
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        Submit
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View> */}
                                    </View>
                                )}
                            </Animated.View>
                        ) : (
                            <View></View>
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
                                            Item Used List
                                        </Text>
                                    </View>
                                    {itemListUse.map((item, index) => {
                                        if (item.quantity > 0) {
                                            return (
                                                <ItemUsed
                                                    index={index}
                                                    name={item.itemName}
                                                    quantity={item.quantity}
                                                    price={item.itemPrice}
                                                    key={`${item.itemName} + ${index}`}
                                                    removeitem={() =>
                                                        handleRemoveUseItem(index, item.bookingDetailMenuId)
                                                    }
                                                ></ItemUsed>
                                            );
                                        }
                                    })}
                                    <View style={styles.addmorebtn}>
                                        <TouchableOpacity onPress={() => handleAddUsedItem()}>
                                            <Text style={{ color: '#2EC4B6' }}>Add Used Item</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
                                                <Text style={{ color: '#2EC4B6' }}>Add More</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View></View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <View style={{ flex: 1.8, flexDirection: 'row', alignItems: 'center' }}>
                {checkOutShow === true ? (
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
                                status == 1 ? handleCheckIn() : handleCheckOutSubmit();
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
                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>{actionName}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Animated.View style={[styles.footer, { opacity: checkOutShow === false ? 1 : 0 }]}>
                        {hasPermission ? (
                            <TouchableOpacity
                                onPress={() => (status == 2 ? handleModifyAddCustomer() : handleCheckInSubmit())}
                            >
                                <View>
                                    <Text
                                        style={{
                                            color: '#2EC4B6',
                                            fontSize: 18,
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Finish
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : changeState ? (
                            <TouchableOpacity onPress={() => handleModifyAddCustomer()}>
                                <View>
                                    <Text
                                        style={{
                                            color: '#2EC4B6',
                                            fontSize: 18,
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Save
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={handleShowUp}>
                                <Footer status={status}></Footer>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
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
    PopupContainer: {
        position: 'relative',
        backgroundColor: '#FFF',
        height: '85%',
        width: '90%',
        opacity: 1,
        borderRadius: 20,
        zIndex: 1,
    },
    fontText: {
        fontSize: 16,
        fontWeight: '600',
    },
    customer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        paddingBottom: 5,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        paddingTop: 5,
    },
    camera: {
        height: '100%',
        width: '100%',
    },
    footer: {
        height: 58,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#2EC4B6',
        borderTopWidth: 3,
    },
    addmorebtn: {
        height: 32,
        width: 100,
        borderRadius: 20,
        borderColor: '#2EC4B6',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    header: { flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
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
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#938D8D',
        borderBottomWidth: 1,
    },
    card: {
        height: Platform.OS === 'ios' ? 250 : 200,
        width: Platform.OS === 'ios' ? 412.5 : 330,
        borderRadius: Platform.OS === 'ios' ? 30 : 24,
        position: 'relative',
        overflow: 'hidden',
    },
    price_number: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24,
        color: '#53A1FD',
    },
    price_currency: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
    },
    card_content_price: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    card_content: {
        position: 'absolute',
        padding: 30,
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
    circleTopLeft: {
        height: 150,
        width: 150,
        backgroundColor: '#D5F3F0',
    },
    header_title: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
        marginLeft: 15,
    },
    header_content: {
        alignItems: 'center',
    },
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
});
export default RoomDetailScreen;
