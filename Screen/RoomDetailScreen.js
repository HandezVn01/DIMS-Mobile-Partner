import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Customer from '../Components/RoomScreen/Customer';
var { width, height } = Dimensions.get('window');
const RoomDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const roomName = route.params.roomName;
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
            cccd: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
        },
        {
            name: 'Hoàng Tuấn Anh',
            cccd: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
        },
        {
            name: 'Hoàng Tuấn Anh',
            cccd: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
        },
        {
            name: 'Hoàng Tuấn Anh Đẹp trai nhất làng',
            cccd: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
        },
        {
            name: 'Hoàng Tuấn Anh',
            cccd: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
        },
        {
            name: 'Hoàng Tuấn Anh',
            cccd: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
        },
        {
            name: 'Hoàng Tuấn Anh',
            cccd: '123123123',
            birthday: '18-07-2000',
            gen: 'male',
        },
    ];
    return (
        <View style={{ flex: 1, marginTop: 20 }}>
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
            <View style={styles.container}>
                <View style={styles.card}>
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
                    <ScrollView style={{ height: 200, width: '80%', marginTop: 10 }}>
                        {customerlist.map((customer, index) => {
                            return <Customer index={index} name={customer.name} cccd={customer.cccd}></Customer>;
                        })}
                    </ScrollView>
                    <TouchableOpacity onPress={() => console.log('Add More')}>
                        <View style={styles.addmorebtn}>
                            <Text style={{ color: '#2EC4B6' }}>Add More</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => console.log('checkout')}>
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
                </View>
            </View>
        </View>
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
        overflow: 'hidden',
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
