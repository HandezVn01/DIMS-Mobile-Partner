import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Customer = ({ index, name, cccd, removeitem, display, room }) => {
    return (
        <View style={styles.customer} key={index}>
            <View style={{ width: '10%', alignItems: 'center' }}>
                <Text>{index}</Text>
            </View>
            <View style={{ width: '38%', overflow: 'scroll' }}>
                <Text>{name}</Text>
            </View>
            <View style={{ width: '40%', overflow: 'scroll' }}>
                <Text>{cccd}</Text>
            </View>
            <View style={{ width: '12%', overflow: 'scroll', alignItems: 'center' }}>
                <Text>{room}</Text>
            </View>
            <View style={{ right: -5, position: 'absolute', display: display ? 'none' : 'flex' }}>
                <TouchableOpacity onPress={removeitem}>
                    <Icon name="close" size={24}></Icon>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    customer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        paddingBottom: 5,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        paddingTop: 5,
        width: '100%',
    },
});
export default Customer;
