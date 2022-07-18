import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { getCustomerList } from '../../Api/ServicesApi';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFecth, dispatchSuccess } from '../../redux/actions/authAction';
import Customer from '../../Components/RoomScreen/Customer';
import axios from 'axios';
const PersonalScreen = () => {
    const navigation = useNavigation();
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const [customers, setCustomers] = useState([]);
    const dispatch = useDispatch();
    const [prompt, setPrompt] = useState(false);
    const [inputText, setInputText] = useState('');
    useEffect(() => {
        dispatch(dispatchFecth());
        getCustomerList(hotelId)
            .then((result) => {
                setCustomers(result);
            })
            .catch((err) => Alert.alert('Error ', 'Server is busy . Please try again later ! '))
            .finally(() => dispatch(dispatchSuccess()));
        return console.log('done');
    }, []);
    const handleSubmit = () => {
        axios
            .post(`https://mailsenddemo.herokuapp.com/sendEmail`, {
                list: customers,
                email: inputText,
            })
            .then((data) => {
                Alert.alert('Success !', 'Đã gửi danh sách về email của bạn !'), setPrompt(false);
            })
            .catch((err) => {
                Alert.alert('Sorry ! Have Some Thing Wrong, Please try again late.'), setPrompt(false);
            });
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={styles.back}>
                            <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.header_content}>
                        <Text style={styles.header_title}>Customer List</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 17, justifyContent: 'center', padding: 20 }}>
                <ScrollView>
                    <Customer index={'STT'} name={'Name'} cccd={'Number ID Card'} display={true}></Customer>
                    {customers.map((customer, index) => {
                        return (
                            <Customer
                                index={index + 1}
                                name={customer.userName}
                                cccd={customer.userIdCard}
                                display={true}
                                key={index}
                            ></Customer>
                        );
                    })}
                </ScrollView>
            </View>
            <View style={{ flex: 2 }}>
                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setPrompt(!prompt);
                            // Alert.prompt('oke ', 'Input Your Email', [
                            //     {
                            //         text: 'Submit',
                            //         onPress: (text) => console.log('alo 2'),
                            //         //
                            //     },
                            //     {
                            //         text: 'Cancel',
                            //     },
                            // ]);
                        }}
                    >
                        <View
                            style={{
                                width: 120,
                                height: 36,
                                borderRadius: 24,
                                backgroundColor: '#3DC5B5',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text>Export Data</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {prompt ? (
                <View style={styles.confirmPrompt}>
                    <View
                        style={{
                            height: '25%',
                            width: '70%',
                            backgroundColor: '#FFF',
                            padding: 5,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            zIndex: 1,
                        }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Export Data</Text>
                        </View>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: '#000',
                                width: '90%',
                                borderRadius: 24,
                                paddingLeft: 10,
                            }}
                        >
                            <TextInput
                                placeholder="Input your email"
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                value={inputText}
                                onChangeText={(e) => setInputText(e)}
                            ></TextInput>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <TouchableOpacity onPress={handleSubmit}>
                                <View
                                    style={{
                                        height: 30,
                                        width: 100,
                                        borderRadius: 24,
                                        backgroundColor: '#3DC5B5',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFF' }}>Submit</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPrompt(false)}>
                                <View
                                    style={{
                                        height: 30,
                                        width: 100,
                                        borderRadius: 24,
                                        backgroundColor: 'orange',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000',
                            opacity: 0.5,
                        }}
                    ></View>
                </View>
            ) : (
                <></>
            )}
        </View>
    );
};

export default PersonalScreen;
const styles = StyleSheet.create({
    confirmPrompt: {
        height: '100%',
        width: '100%',
        position: 'absolute',

        justifyContent: 'center',
        alignItems: 'center',
    },
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
        height: '70%',
        width: '90%',
        opacity: 1,
        borderRadius: 20,
        zIndex: 1,
    },
    PopupSplash: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#ebeaea',
        opacity: 0.5,
    },
    itemRow: {
        flex: 1,
        flexDirection: 'row',
    },
    itemColRight: {
        flex: 6.66,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#000',
        borderRightWidth: 1,
    },
    itemCol: {
        flex: 3.33,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    itemListHeader: {
        marginTop: 5,
        marginBottom: 5,
        borderBottomColor: 'orange',
        borderBottomWidth: 2,
    },
    header: {
        flex: 3,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 20,
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
});
