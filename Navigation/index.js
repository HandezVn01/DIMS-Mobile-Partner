import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/HomeScreen';
import LoginScreen from '../Screen/LoginScreen';
import { useEffect } from 'react';
import {
    dispatchLogin,
    dispatchLogout,
    dispatchFecth,
    dispatchSuccess,
    dispatchFailed,
} from '../redux/actions/authAction';
import * as AuthApi from '../Api/AuthApi';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from '../Screen/ProfileScreen';
import AutoScreen from '../Screen/AutoScreen';
import TabNavigation from './TabNavigation';
import ViewStatusRoom from '../Screen/ViewStatusRoom';
import RoomDetailScreen from '../Screen/RoomDetailScreen';
import CameraScreen from '../Screen/CameraScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Navigation = () => {
    const isLogged = useSelector((state) => state.auth.isLogged);
    const dispatch = useDispatch();
    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await AsyncStorage.getItem('@user');
                dispatch(dispatchFecth());
                await AuthApi.GetUser(user)
                    .then((result) => {
                        if (result.role === 'HOST') {
                            dispatch(dispatchSuccess(result));
                            dispatch(dispatchLogin(result));
                        } else {
                            Alert.alert('Warning', 'Vui Lòng Đăng Nhập Lại !');
                            dispatch(dispatchFailed('NotAdmin'));
                            dispatch(dispatchLogout());
                        }
                    })
                    .catch((err) => {
                        dispatch(dispatchFailed(err));
                    });
            } catch (error) {}
        };
        checkUser();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                {isLogged ? (
                    <Stack.Screen name="Home" component={TabNavigation} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
                <Stack.Screen name="ViewStatus" component={ViewStatusRoom} />
                <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
                <Stack.Screen name="CameraScreen" component={CameraScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
