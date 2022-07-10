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
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Customer from '../Components/RoomScreen/Customer';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
var { width, height } = Dimensions.get('window');
const RoomDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [datatmp, setDataTmp] = useState('');
    const [sound, setSound] = React.useState();
    const [checkOutShow, setCheckOutShow] = useState(false);
    const roomName = route.params.roomName;
    const checkoutShowRef = useRef(new Animated.Value(0)).current;
    const data = {
        checkindate: '08-07-2022',
        checkoutdate: '09-07-2022',
        Type: 'Check In Local',
        Createby: 'Handez',
        Status: '3',
        StatusMsg: 'Đã Trả Trước ',
        Paid: '100000',
    };
    const customerlist = [
        {
            name: 'Hoàng Tuấn Anh',
            number: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
            address: 'value[5]',
        },
        {
            name: 'Hoàng Tuấn Anh',
            number: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
            address: 'value[5]',
        },
    ];
    const [list, setList] = useState(customerlist);
    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('../assets/beep.mp3'));
        setSound(sound);

        console.log('Playing Sound');
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
                console.log(data);
            }

            playSound();
        }
    };
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
    return (
        <SafeAreaView style={{ flex: 1, marginTop: 20, overflow: 'hidden' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.back}>
                        <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                    </View>
                </TouchableOpacity>
                <View style={styles.header_content}>
                    <Icon name="home" size={24} color="#3DC5B5"></Icon>
                    <Text style={styles.header_title}>Room {roomName}</Text>
                </View>
            </View>
            <View style={[styles.container]}>
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
                                    { color: data.Status == 1 ? '#D72C36' : data.Status == 2 ? '#53A1FD' : '#F9A000' },
                                ]}
                            >
                                {data.StatusMsg}
                                {data.Status == 3 ? (
                                    <Text>
                                        <Text style={{ color: '#53A1FD' }}> {data.Paid}</Text> VNĐ
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
                            <Text style={styles.price_number}>200,000 </Text>
                            <Text style={styles.price_currency}>VNĐ / Days</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        position: 'relative',
                        height: height - ((height * 3) / 20 + 210),
                        width: '100%',
                    }}
                >
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
                            <Text>Check Out</Text>
                            <TouchableOpacity onPress={handleCheckOut}>
                                <Icon name="close-outline" size={24}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 7 }}>
                            <ScrollView>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>

                                <Text>Hello Handez</Text>
                                <Text>Hello Handez</Text>
                            </ScrollView>
                        </View>
                        <View style={{ flex: 2 }}></View>
                    </Animated.View>

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
                                console.log(customer);
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

                <Animated.View style={[styles.footer, { opacity: checkOutShow === false ? 1 : 0 }]}>
                    <TouchableOpacity onPress={handleCheckOut}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="logout" size={36} color={'#2EC4B6'}></Icon>
                            <Text
                                style={{
                                    color: '#2EC4B6',
                                    fontSize: 18,
                                    fontWeight: '500',
                                    letterSpacing: 1,
                                }}
                            >
                                Check Out
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={[styles.footer, { opacity: checkOutShow === true ? 1 : 0 }]}>
                    <TouchableOpacity onPress={handleCheckOut}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="logout" size={36} color={'#2EC4B6'}></Icon>
                            <Text
                                style={{
                                    color: '#2EC4B6',
                                    fontSize: 18,
                                    fontWeight: '500',
                                    letterSpacing: 1,
                                }}
                            >
                                Next
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 58,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#2EC4B6',
        borderTopWidth: 3,
        zIndex: 1,
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
        flex: 17,
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
