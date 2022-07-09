import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Customer = ({ index, name, cccd, removeitem }) => {
    return (
        <View style={styles.customer} key={index}>
            <View style={{ width: '10%', alignItems: 'center' }}>
                <Text>{index + 1}</Text>
            </View>
            <View style={{ width: '50%', overflow: 'scroll' }}>
                <Text>{name}</Text>
            </View>
            <View>
                <Text>{cccd}</Text>
            </View>
            <View style={{ right: -5, position: 'absolute' }}>
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
    },
});
export default Customer;
