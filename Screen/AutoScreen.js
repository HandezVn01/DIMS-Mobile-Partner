import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
export default function AutoScreen() {
    const [datatmp, setDataTmp] = useState('');
    const handleBarCodeScanned = ({ type, data }) => {
        if (data !== datatmp) {
            alert(`Bar code with type ${type} and data ${data} has been scanned!`);
            setDataTmp(datatmp);
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
