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
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { Storage } from 'expo-storage';
export default function LoginScreen({ route }) {
    const dispatch = useDispatch();
    const params = route.params;
    const navigation = useNavigation();
    const isLogged = useSelector((state) => state.auth.isLogged);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfpassword, setCfPassword] = useState('');
    const [value, setValue] = useState('');
    const [isChangePassWord, setIsChangePassWord] = useState(false);
    const [eye, setEye] = useState(true);
    const [checked, setChecked] = React.useState(false);
    const [isForgot, setisForgot] = useState(false);
    const CELL_COUNT = 6;
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    useEffect(() => {
        const getAccount = async () => {
            const data = JSON.parse(await Storage.getItem({ key: `rememberAccount` }));
            if (data) {
                setChecked(true);
                setEmail(data.email);
                setPassword(data.password);
                console.log(data);
            }

            return data;
        };
        const data = getAccount();

        return console.log(getAccount());
        // console.log(getAccount());
    }, []);
    const [countDownDate, setCountDown] = useState(0);
    const [isDone, setIsDone] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - 1);
        }, 1000);
        console.log(countDownDate);
        if (countDownDate === 0) {
            clearInterval(interval);
            setIsDone(true);
        }
        return () => clearInterval(interval);
    }, [countDownDate]);
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
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
                    })
                    .finally(async () => {
                        if (checked) {
                            await Storage.setItem({
                                key: `rememberAccount`,
                                value: JSON.stringify({
                                    email: email,
                                    password: password,
                                }),
                            });
                        } else {
                            await Storage.removeItem({ key: 'rememberAccount' });
                        }
                    });
            } catch (error) {}
        }
    };
    const handleForgotPassWord = () => {
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
        if (alertStatus) {
            Alert.alert('Warning', alertMsg);
            console.log('alert');
        } else {
            dispatch(dispatchFecth());
            AuthApi.ForgotPassWord(email)
                .then((e) => {
                    Alert.alert('Success !', 'Vui lòng kiểm tra email của bạn !');
                    setIsChangePassWord(true);
                    setCountDown(60);
                })
                .catch((err) => {
                    Alert.alert(
                        'Error !',
                        'Vui lòng kiểm tra lại tài khoản của bạn hoặc tài khoản của bạn chưa được đăng ký .',
                    );
                    console.log(err);
                })
                .finally(() => dispatch(dispatchSuccess()));
        }
    };
    const handleSubmitForgotPassWord = () => {
        let alertStatus = false;
        let alertMsg = '';
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (password.length < 6) {
            alertMsg = alertMsg + 'Password is not correct , Password at least 5 character !';
            alertStatus = true;
        }
        if (password !== cfpassword) {
            alertMsg = alertMsg + 'Password and Confirm Password not match !';
            alertStatus = true;
        }
        if (value.length !== 6) {
            alertMsg = alertMsg + 'Your code need 6 character !';
            alertStatus = true;
        }
        if (alertStatus) {
            Alert.alert('Warning', alertMsg);
            console.log('alert');
        } else {
            dispatch(dispatchFecth());
            AuthApi.SubmitChangeForgotPassWord(email, password, cfpassword, value)
                .then((result) => {
                    Alert.alert('Changing PassWord Success .');
                    setisForgot(false);
                    setIsChangePassWord(false);
                })
                .catch(() => Alert.alert('Your code is wrong !'))
                .finally(() => {
                    dispatch(dispatchSuccess());
                });
        }
    };

    const RememberAccount = async () => {
        if (!checked) {
            await Storage.setItem({
                key: `rememberAccount`,
                value: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
        } else {
            await Storage.removeItem({ key: 'rememberAccount' });
        }
        setChecked(!checked);
    };
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.logo}>
                    <Icon name="home-city-outline" size={60} color="#3DC5B5" />
                    <Text style={styles.logotitle}>DIMS Manage</Text>
                </View>
            </View>

            <View style={styles.mid}>
                {isForgot ? (
                    <Text style={styles.title}>Forgot your password ?</Text>
                ) : (
                    <Text style={styles.title}>Login to Your Account</Text>
                )}
                {isChangePassWord ? (
                    <></>
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        left={<TextInput.Icon name="email"></TextInput.Icon>}
                        value={email}
                        onChangeText={(e) => setEmail(e)}
                    />
                )}
                {isForgot ? (
                    isChangePassWord ? (
                        <>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={eye}
                                placeholder="Password"
                                left={<TextInput.Icon name="lock"></TextInput.Icon>}
                                right={<TextInput.Icon name="eye" onPress={() => setEye(!eye)} />}
                                value={password}
                                onChangeText={(e) => setPassword(e)}
                            />
                            <TextInput
                                style={styles.input}
                                secureTextEntry={eye}
                                placeholder="Confirm Password"
                                left={<TextInput.Icon name="lock"></TextInput.Icon>}
                                right={<TextInput.Icon name="eye" onPress={() => setEye(!eye)} />}
                                value={cfpassword}
                                onChangeText={(e) => setCfPassword(e)}
                            />
                            <CodeField
                                ref={ref}
                                {...props}
                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}
                                    >
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                            <View>
                                <Text
                                    style={styles.forgotpassword}
                                    onPress={() => (countDownDate === 0 ? handleForgotPassWord() : undefined)}
                                >
                                    {countDownDate > 0 ? countDownDate + 's' : ''} Gửi lại
                                </Text>
                            </View>
                        </>
                    ) : (
                        <></>
                    )
                ) : (
                    <TextInput
                        style={styles.input}
                        secureTextEntry={eye}
                        placeholder="Password"
                        left={<TextInput.Icon name="lock"></TextInput.Icon>}
                        right={<TextInput.Icon name="eye" onPress={() => setEye(!eye)} />}
                        value={password}
                        onChangeText={(e) => setPassword(e)}
                    />
                )}

                {isChangePassWord ? (
                    <></>
                ) : (
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
                                RememberAccount();
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
                )}
            </View>
            <View style={styles.bottom}>
                {isForgot ? (
                    isChangePassWord ? (
                        <View>
                            <Button mode="contained" style={styles.loginbtn} onPress={handleSubmitForgotPassWord}>
                                Finish
                            </Button>
                            <TouchableOpacity
                                onPress={() => {
                                    setisForgot(false), setIsChangePassWord(false);
                                }}
                            >
                                <Text style={styles.forgotpassword}>Go back to Login</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <Button mode="contained" style={styles.loginbtn} onPress={handleForgotPassWord}>
                                Submit
                            </Button>
                            <TouchableOpacity onPress={() => setisForgot(false)}>
                                <Text style={styles.forgotpassword}>Go back to Login</Text>
                            </TouchableOpacity>
                        </View>
                    )
                ) : (
                    <View>
                        <Button mode="contained" style={styles.loginbtn} onPress={handleLogin}>
                            Log In
                        </Button>
                        <TouchableOpacity onPress={() => setisForgot(true)}>
                            <Text style={styles.forgotpassword}>Forgot the password ?</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
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
