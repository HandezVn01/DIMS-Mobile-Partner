import { View, Text } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Footer = ({ screen }) => {
    var { width, height } = Dimensions.get('window');
    const navigation = useNavigation();
    return (
        // <View
        //     style={{
        //         height: 72,
        //         width: '100%',
        //         backgroundColor: '#FFFFFF',
        //         position: 'absolute',
        //         top: height - 72,
        //         paddingBottom: 24,
        //         paddingTop: 24,
        //         paddingLeft: 32,
        //         paddingRight: 32,
        //     }}
        // >
        //     <View
        //         style={{
        //             backgroundColor: '#FFFFFF',
        //             height: '100%',
        //             width: '100%',
        //             flexDirection: 'row',
        //             justifyContent: 'space-around',
        //         }}
        //     >
        //         <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        //             <Icon
        //                 name="home-battery-outline"
        //                 size={24}
        //                 color={screen === 'Home' ? '#3DC5B5' : '#000000'}
        //             ></Icon>
        //         </TouchableOpacity>
        //         <TouchableOpacity onPress={() => navigation.navigate('Auto')}>
        //             <Icon name="login" size={24} color={screen === 'Auto' ? '#3DC5B5' : '#000000'}></Icon>
        //         </TouchableOpacity>
        //         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        //             <Icon name="account" size={24} color={screen === 'Profile' ? '#3DC5B5' : '#000000'}></Icon>
        //         </TouchableOpacity>
        //     </View>
        // </View>
        <View></View>
    );
};

export default Footer;
