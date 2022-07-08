import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginScreen from './Screen/LoginScreen';
import { View } from 'react-native';
import Spinning from './Components/Loading';
import * as AuthApi from './Api/AuthApi';
import Navigation from './Navigation';
export default function MainScreen() {
    const loading = useSelector((state) => state.loadingReducer.loading);
    return (
        <View style={{ flex: 1 }}>
            <Navigation></Navigation>
            {loading && <Spinning />}
        </View>
    );
}
