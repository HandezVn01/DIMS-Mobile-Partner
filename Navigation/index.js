import { View, Text } from 'react-native';
import React, { useState } from 'react';
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
import AutoScreen from '../Screen/AutoScreen';
import TabNavigation from './TabNavigation';
import ViewStatusRoom from '../Screen/HomeScreen/ViewStatusRoom';
import RoomDetailScreen from '../Screen/HomeScreen/RoomDetailScreen';
import PersonalScreen from '../Screen/ProfileScreen/PersonalScreen';
import RoomService from '../Screen/ProfileScreen/RoomService';
import SupportScreen from '../Screen/ProfileScreen/SupportScreen';
import ProfileScreen from '../Screen/ProfileScreen';
import GroupBookingScreen from '../Screen/HomeScreen/GroupBookingScreen';
import AutoScreenSayHi from '../Screen/AutoScreenSayHi';

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
                    .then(async (result) => {
                        if (result.role === 'HOST') {
                            await AuthApi.getAllHotel(user)
                                .then(async (result2) => {
                                    dispatch(dispatchLogin(result, `${result2[0].hotelId}`, user));
                                    dispatch(dispatchSuccess());
                                })
                                .catch((err) => {});
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
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                {isLogged ? (
                    <Stack.Screen name="Home" component={TabNavigation} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
                <Stack.Screen name="ViewStatus" component={ViewStatusRoom} />
                <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
                <Stack.Screen name="Person" component={PersonalScreen}></Stack.Screen>
                <Stack.Screen name="RoomService" component={RoomService}></Stack.Screen>
                <Stack.Screen name="Help" component={SupportScreen}></Stack.Screen>
                <Stack.Screen name="AutoScreen" component={AutoScreen}></Stack.Screen>
                <Stack.Screen name="ProfileScreen" component={ProfileScreen}></Stack.Screen>
                <Stack.Screen name="GroupBookingeScreen" component={GroupBookingScreen}></Stack.Screen>
                <Stack.Screen name="AutoScreenHello" component={AutoScreenSayHi}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
