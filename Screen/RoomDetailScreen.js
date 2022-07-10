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
import Customer from '../Components/RoomScreen/Customer';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
import Itemlist from '../Components/RoomScreen/CheckOut/Itemlist';
import Footer from '../Components/RoomScreen/Footer';
import InputCompunent from '../Components/RoomScreen/CheckInNav/InputCompunent';
import { Checkbox } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var { width, height } = Dimensions.get('window');
const RoomDetailScreen = ({ route }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [datatmp, setDataTmp] = useState('');
    const [sound, setSound] = React.useState();
    const [checkOutShow, setCheckOutShow] = useState(false);
    // Get infomation from params
    const roomName = route.params.roomName;
    const status = route.params.status;
    //

    const checkoutShowRef = useRef(new Animated.Value(0)).current;
    const [extraFee, setExtraFee] = useState(0);
    const data =
        status == 1
            ? {
                  checkindate: '08-07-2022',
                  checkoutdate: '09-07-2022',
                  totalNight: 1,
                  Type: 'Check In Local',
                  Createby: 'Handez',
                  Status: '3',
                  StatusMsg: 'Đã Trả Trước ',
                  Paid: 100,
                  Price: 200,
              }
            : {};
    const roomData = {};
    const [total, setTotal] = useState(data.Price * data.totalNight - data.Paid);
    const totalTmp = data.Price * data.totalNight - data.Paid;
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
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/beep.mp3'));
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
    const handleCheckIn = () => {};

    const handleCheckOut = () => {
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
        console.log(sum);
    }, [extraFee]);
    // console.log(topPadding, bottomPadding);
    return (
        <SafeAreaView style={{ flex: 1, marginTop: 20, overflow: 'hidden' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.back}>
                        <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                    </View>
                </TouchableOpacity>
                <View style={styles.header_content}>
                    <Icon name="home" size={24} color={status == 1 ? '#3DC5B5' : '#000'}></Icon>
                    <Text style={styles.header_title}>Room {roomName}</Text>
                </View>
            </View>

            <View style={[styles.container]}>
                <KeyboardAwareScrollView scrollToOverflowEnabled={true} scrollEnabled={false}>
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
                                source={require('../Asset/Card.png')}
                                borderRadius={24}
                                style={{ height: '100%', width: '100%' }}
                            />
                            <View style={styles.card_content}>
                                <Text style={styles.card_content_text}>
                                    CheckIn Date: <Text style={styles.card_data}>{data.checkindate}</Text>
                                </Text>
                                <Text style={styles.card_content_text}>
                                    CheckOut Date: <Text style={styles.card_data}>{data.checkoutdate}</Text>
                                </Text>
                                <Text style={styles.card_content_text}>
                                    Type: <Text style={styles.card_data}>{data.Type}</Text>
                                </Text>
                                <Text style={styles.card_content_text}>
                                    Created by: <Text style={styles.card_data}>{data.Createby}</Text>
                                </Text>
                                <Text style={styles.card_content_text}>
                                    Status:{' '}
                                    <Text
                                        style={[
                                            styles.card_data,
                                            {
                                                color:
                                                    data.Status == 1
                                                        ? '#D72C36'
                                                        : data.Status == 2
                                                        ? '#53A1FD'
                                                        : '#F9A000',
                                            },
                                        ]}
                                    >
                                        {data.StatusMsg}
                                        {data.Status == 3 ? (
                                            <Text>
                                                <Text style={{ color: '#53A1FD' }}> {data.Paid},000</Text> VNĐ
                                            </Text>
                                        ) : (
                                            ''
                                        )}
                                    </Text>
                                </Text>
                            </View>
                            <View style={styles.card_content_price}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.card_content_text}>Price: </Text>
                                    <Text style={styles.price_number}>{data.Price},000 </Text>
                                    <Text style={styles.price_currency}>VNĐ / Days</Text>
                                </View>
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
                                        flex: 1,
                                    },
                                    { opacity: checkoutShowRef },
                                ]}
                            >
                                {status == 2 ? (
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
                                                <TouchableOpacity onPress={handleCheckOut}>
                                                    <Icon name="close-outline" size={24}></Icon>
                                                </TouchableOpacity>
                                            </Text>
                                        </View>
                                        <View style={{ flex: 7 }}>
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
                                        <View style={{ flex: 2, alignItems: 'center' }}>
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
                                                <Text>Check Out </Text>
                                            </View>
                                            <View style={{ flex: 6 }}>
                                                <Text>Total: {total},000 VNĐ</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <TouchableOpacity onPress={handleCheckOut}>
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

                            <View style={styles.addmorebtn}>
                                <TouchableOpacity onPress={() => handleAddCustomer()}>
                                    {hasPermission === true ? (
                                        <Text> Finish </Text>
                                    ) : (
                                        <Text style={{ color: '#2EC4B6' }}>Add More</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                {checkOutShow === true ? (
                    <View></View>
                ) : (
                    <Animated.View style={[styles.footer, { opacity: checkOutShow === false ? 1 : 0 }]}>
                        <TouchableOpacity onPress={handleCheckOut}>
                            <Footer status={status}></Footer>
                        </TouchableOpacity>
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
        height: 200,
        width: 330,
        borderRadius: 24,
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
