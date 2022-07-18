import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as RoomApi from '../Api/RoomApi';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFecth, dispatchSuccess } from '../redux/actions/authAction';
export default function AutoScreen() {
    const dispatch = useDispatch();
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const token = useSelector((state) => state.auth.token);
    const [datatmp, setDataTmp] = useState('');
    const handleBarCodeScanned = ({ type, data }) => {
        if (data !== datatmp) {
            alert(`${data}`);
            dispatch(dispatchFecth());
            RoomApi.CheckInAuto(hotelId, data, token)
                .then((result) => console.log(result))
                .catch((err) => console.log(err));
            setDataTmp(datatmp);
            dispatch(dispatchSuccess());
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Text>Check In Auto</Text>
            </View>
            <View style={{ flex: 9 }}>
                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
            </View>
        </SafeAreaView>
    );
}
