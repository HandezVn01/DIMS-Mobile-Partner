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
import * as RoomApi from '../../Api/RoomStatus';
import NumberFormat from 'react-number-format';
var { width, height } = Dimensions.get('window');
const RoomDetailScreen = ({ route }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(false);
    const [datatmp, setDataTmp] = useState('');
    const [sound, setSound] = React.useState();
    const [checkOutShow, setCheckOutShow] = useState(false);

    // Get infomation from params
    const roomName = route.params.roomName;
    const status = route.params.status;
    const roomid = route.params.roomId;
    const data = route.params.data;

    // API Get Data
    const checkoutShowRef = useRef(new Animated.Value(0)).current;
    const [extraFee, setExtraFee] = useState(0);
    // const data =
    //     status == 2
    //         ? {
    //               checkindate: '08-07-2022',
    //               checkoutdate: '09-07-2022',
    //               totalNight: 1,
    //               Type: 'Check In Local',
    //               Createby: 'Handez',
    //               Status: '3',
    //               StatusMsg: 'Đã Trả Trước ',
    //               Paid: 100,
    //               Price: 200,
    //           }
    //         : {};
    const [total, setTotal] = useState(parseInt(data.totalPrice) - parseInt(data.deposit));
    console.log(data);
    const totalTmp = parseInt(data.totalPrice) - parseInt(data.deposit);
    const customerlist = [];
    const [isPayment, setisPayment] = useState(false);
    const [totalNight, setTotalNight] = useState(1);
    var itemList = [
        {
            itemName: ' String',
            itemType: 'water',
            itemPrice: '15',
            quantity: '0',
        },
        {
            itemName: 'Coca',
            itemType: 'water',
            itemPrice: '15',
            quantity: '0',
        },
        {
            itemName: ' String',
            itemType: 'water',
            itemPrice: '15',
            quantity: '0',
        },
        {
            itemName: 'Coca',
            itemType: 'water',
            itemPrice: '15',
            quantity: '0',
        },
        {
            itemName: ' Pepsi',
            itemType: 'water',
            itemPrice: '15',
            quantity: '0',
        },
        {
            itemName: ' Nước Suối',
            itemType: 'water',
            itemPrice: '10',
            quantity: '0',
        },
        {
            itemName: ' Bò Húc',
            itemType: 'water',
            itemPrice: '15',
            quantity: '0',
        },
        {
            itemName: 'Mì Ly',
            itemType: 'noodle',
            itemPrice: '15',
            quantity: '0',
        },
        {
            itemName: 'Cơm Chiên',
            itemType: 'noodle',
            itemPrice: '25',
            quantity: '0',
        },
    ];
    const [list, setList] = useState(customerlist);
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
            const check = data.indexOf('|');
            if (check != -1) {
                const value = data.split('|');
                const new_data = {
                    address: value[5],
                    birthday: value[3],
                    gen: value[4],
                    number: value[0],
                    name: value[2],
                };
                setList([...list, new_data]);
            } else {
                const values = data.split('\n');
                const new_data = {
                    address: values[4],
                    birthday: values[2],
                    gen: '',
                    number: values[0],
                    name: values[1],
                };
                setList([...list, new_data]);
            }

            playSound();
        }
    };
    const handleCheckIn = () => {
        setActionName('Next');
        setHasPermission(!hasPermission);
        setCheckOutShow(!checkOutShow);
    };
    const handleCheckInSubmit = () => {
        setHasPermission(!hasPermission);
    };
    const handleCheckOutSubmit = () => {
        setCheckOutShow(!checkOutShow);
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
        setTotal(totalTmp + sum);
    };
    useEffect(() => {
        let sum = 0;
        itemListUse.forEach((item) => {
            sum = sum + item.itemPrice * item.quantity;
        });
        sum = parseInt(sum) + parseInt(extraFee || 0);
        setTotal(totalTmp + sum);
    }, [extraFee]);

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 20, overflow: 'hidden' }}>
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
                <KeyboardAwareScrollView enableAutomaticScroll={true}>
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
                                                            data.paymentCondition === true
                                                                ? '#53A1FD'
                                                                : data.deposit > 0
                                                                ? '#F9A000'
                                                                : '#D72C36',
                                                    },
                                                ]}
                                            >
                                                {data.paymentCondition === true ? (
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
                            </View>
                            <View style={styles.card_content_price}>
                                {data.totalPrice !== undefined ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.card_content_text}>TotalPrice: </Text>
                                        <Text style={styles.price_number}>
                                            <NumberFormat
                                                value={data.totalPrice * 1000}
                                                thousandSeparator={true}
                                                displayType={'text'}
                                                renderText={(value) => <Text>{value}</Text>}
                                            ></NumberFormat>
                                        </Text>
                                        <Text style={styles.price_currency}>VNĐ</Text>
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                            </View>
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
                                {status == 1 ? (
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
                                                ></InputCompunent>
                                                <InputCompunent
                                                    title={'Email:'}
                                                    placeholder={'Email of customer'}
                                                    sub={''}
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
                                                <Text>Total: {total},000 VNĐ</Text>
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
                                                        keyboardType="numeric"
                                                        onChangeText={(e) => setExtraFee(e)}
                                                    ></TextInput>
                                                    <Text>VNĐ</Text>
                                                </View>
                                                <View>
                                                    <Text>Item Fee:</Text>
                                                </View>
                                                {itemList.map((item, index) => {
                                                    return (
                                                        <Itemlist
                                                            itemName={item.itemName}
                                                            itemPrice={item.itemPrice}
                                                            itemType={item.itemType}
                                                            itemUse={item.quantity}
                                                            key={index}
                                                            handleSum={(e) =>
                                                                handleSumTotal({
                                                                    quantity: e,
                                                                    price: item.itemPrice,
                                                                    itemName: item.itemName,
                                                                })
                                                            }
                                                        ></Itemlist>
                                                    );
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
                            <ScrollView style={{ maxHeight: 200, width: '80%', marginTop: 10, marginBottom: 5 }}>
                                {list.map((customer, index) => {
                                    return (
                                        <Customer
                                            index={index}
                                            name={customer.name}
                                            cccd={customer.number}
                                            key={index}
                                            removeitem={() => removeItemHandle({ indexList: index })}
                                        ></Customer>
                                    );
                                })}
                            </ScrollView>

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
                                onPress={() => (status == 2 ? handleAddCustomer() : handleCheckInSubmit())}
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
    },
    header: { flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
    customerlist: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        borderTopColor: '#938D8D',
        borderTopWidth: 1,
    },
    customerlist_header: {
        height: 30,
        width: '80%',
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
