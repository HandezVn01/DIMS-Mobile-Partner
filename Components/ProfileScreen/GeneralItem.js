import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { dispatchLogout } from '../../redux/actions/authAction';
const GeneralItem = ({ icon, title, action }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const handleAction = () => {
        if (action !== 'logout') {
            navigation.navigate(action, {
                logout: true,
            });
        } else {
            logout();
        }
    };
    const logout = () => {
        Alert.alert('Đăng Xuất', 'Bạn muốn đăng xuất ?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(dispatchLogout());
                },
            },
        ]);
    };
    return (
        <TouchableOpacity onPress={handleAction}>
            <View
                style={{
                    height: 42,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    marginBottom: 10,
                    marginTop: 10,
                }}
            >
                <View
                    style={{
                        height: 42,
                        width: 42,
                        backgroundColor: '#CBF2EA',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 16,
                        marginRight: 20,
                    }}
                >
                    <Icon name={icon} size={24} color={'#05C1B0'}></Icon>
                </View>
                <Text>{title}</Text>
                <View style={{ position: 'absolute', right: 15 }}>
                    <Icon name="menu-right" size={24} color={'#697B7A'}></Icon>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GeneralItem;
