import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const AutoScreenSayHi = () => {
    const navigation = useNavigation();
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text>Hướng Dẫn Check In Auto</Text>
            <Text>B1: Show mã QR của bạn vào camera</Text>
            <Text>B2: Show mã QR của trên CCCD của bạn </Text>
            <Text>B3: Nhấn nút Submit để hoàn tất thủ tục check it</Text>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('AutoScreen');
                }}
                style={{ padding: 10, backgroundColor: '#3DC5B5' }}
            >
                <Text style={{ color: 'white', fontWeight: '500' }}>Click Here To Check In</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AutoScreenSayHi;
