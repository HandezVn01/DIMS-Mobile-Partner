import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

var { width, height } = Dimensions.get('window');
const ViewStatusRoom = ({ route }) => {
    const title = route.params.title;
    const navigation = useNavigation();
    const handleRoom = ({ roomName, status }) => {
        navigation.navigate('RoomDetail', {
            roomName: roomName,
            status: status,
        });
    };
    return (
        <View style={{ flex: 1, marginTop: 20 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.back}>
                        <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                    </View>
                </TouchableOpacity>
                <Text style={styles.header_title}>{title}</Text>
            </View>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => handleRoom({ roomName: '101', status: '1' })}>
                    <Text>101</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRoom({ roomName: '102', status: '2' })}>
                    <Text>102</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
    header_title: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
        marginLeft: 15,
    },
    container: {
        flex: 17,
        backgroundColor: 'pink',
    },
    back: {
        height: 42,
        width: 42,
        borderColor: '#B2B2B2',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default ViewStatusRoom;
