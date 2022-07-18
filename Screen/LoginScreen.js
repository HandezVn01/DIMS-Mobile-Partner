import React, { useEffect, useState } from 'react';
import { View, Text, Linking, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import * as AuthApi from '../Api/AuthApi';
import { useDispatch, useSelector } from 'react-redux';
import {
    dispatchFailed,
    dispatchFecth,
    dispatchLogin,
    dispatchLogout,
    dispatchSuccess,
} from '../redux/actions/authAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ServicesApi from '../Api/ServicesApi';
export default function LoginScreen({ route }) {
    const dispatch = useDispatch();
    const params = route.params;
    const navigation = useNavigation();
    const isLogged = useSelector((state) => state.auth.isLogged);
    if (params) {
        if (params.logout === true) {
            console.log('run');
            dispatch(dispatchLogout());
        }
    }
    const handleLogin = async () => {
        let alertStatus = false;
        let alertMsg = '';
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (email.length < 1) {
            alertStatus = true;
            alertMsg = alertMsg + 'Email is Empty \n';
        }
        if (reg.test(email) === false) {
            alertStatus = true;
            alertMsg = alertMsg + 'Email is not correct \n';
        }
        if (password.length < 5) {
            alertStatus = true;
            alertMsg = alertMsg + 'Password is not correct \n';
        }
        if (alertStatus) {
            Alert.alert('Warning', alertMsg);
            console.log('alert');
        } else {
            try {
                dispatch(dispatchFecth());
                await AuthApi.LoginUser({ email, password })
                    .then((data) => {
                        AuthApi.GetUser(data.token)
                            .then(async (result) => {
                                if (result.role === 'HOST') {
                                    await AsyncStorage.setItem('@user', data.token);
                                    await AuthApi.getAllHotel(data.token)
                                        .then(async (result2) => {
                                            await AsyncStorage.setItem('@hotelid', `${result2[0].hotelId}`);

                                            dispatch(dispatchLogin(result, `${result2[0].hotelId}`, data.token));
                                            dispatch(dispatchSuccess());
                                            navigation.navigate('Home');
                                        })
                                        .catch((err) => {});
                                } else {
                                    Alert.alert('Warning', 'Tài khoản của bạn không phải là tài khoản của Partner !');
                                    dispatch(dispatchFailed('NotAdmin'));
                                }
                            })
                            .catch((error) => dispatch(dispatchFailed(error)));
                    })
                    .catch((err) => {
                        Alert.alert('Warning', 'Vui Lòng Kiểm Tra Lại Mật Khẩu Hoặc Tài Khoản!');
                        dispatch(dispatchFailed(err));
                    });
            } catch (error) {}
        }
    };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [eye, setEye] = useState(true);
    const [checked, setChecked] = React.useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.logo}>
                    <Icon name="home-city-outline" size={60} color="#3DC5B5" />
                    <Text style={styles.logotitle}>DIMS Manage</Text>
                </View>
            </View>
            <View style={styles.mid}>
                <Text style={styles.title}>Login to Your Account</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    left={<TextInput.Icon name="email"></TextInput.Icon>}
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={eye}
                    placeholder="Password"
                    left={<TextInput.Icon name="lock"></TextInput.Icon>}
                    right={<TextInput.Icon name="eye" onPress={() => setEye(!eye)} />}
                    value={password}
                    onChangeText={(e) => setPassword(e)}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                    />
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 16,
                            fontWeight: '500',
                            letterSpacing: 0.6,
                            marginLeft: 5,
                        }}
                    >
                        Remember Me
                    </Text>
                </View>
            </View>
            <View style={styles.bottom}>
                <Button mode="contained" style={styles.loginbtn} onPress={handleLogin}>
                    Log In
                </Button>
                <TouchableOpacity onPress={() => console.log('Dang bao tri')}>
                    <Text style={styles.forgotpassword}>Forgot the password ?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    forgotpassword: {
        textAlign: 'center',
        marginTop: 20,
        color: '#3DC5B5',
    },
    loginbtn: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: 20,
        backgroundColor: '#3DC5B5',
        marginTop: 25,
    },
    container: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    top: {
        flex: 4,
        justifyContent: 'flex-end',
    },
    mid: { flex: 4, justifyContent: 'space-between' },
    bottom: { flex: 4 },
    logo: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    logotitle: {
        color: '#3DC5B5',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    input: {
        width: 300,
        height: 50,
        backgroundColor: 'rgba(9,39,36,0.12)',
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    title: {
        fontWeight: '500',
        fontSize: 24,
        color: '#000000',
        textAlign: 'center',
    },
});
