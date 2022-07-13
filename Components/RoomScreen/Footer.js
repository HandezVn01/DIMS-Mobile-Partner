import { View, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Footer = ({ status }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={status == 2 ? 'logout' : 'login'} size={36} color={'#2EC4B6'}></Icon>
            <Text
                style={{
                    color: '#2EC4B6',
                    fontSize: 18,
                    fontWeight: '500',
                    letterSpacing: 1,
                }}
            >
                {status == 2 ? 'Check Out' : 'Check In'}
            </Text>
        </View>
    );
};

export default Footer;
