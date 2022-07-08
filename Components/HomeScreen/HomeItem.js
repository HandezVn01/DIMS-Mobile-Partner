import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const HomeItem = ({ title, icon, backgroundColor }) => {
    const navigation = useNavigation();
    const handleClick = () => {
        navigation.navigate('ViewStatus', {
            title: title,
        });
    };
    return (
        <TouchableOpacity onPress={handleClick}>
            <View style={[styles.items, styles.shadowProp, { backgroundColor: backgroundColor }]}>
                <Text style={styles.item_title}>{title}</Text>
                <Text>
                    <Icon name={icon} size={60} color="#FFF"></Icon>
                </Text>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    items: {
        height: 120,
        width: 310,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 50,
    },
    item_title: {
        color: '#FFF',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

export default HomeItem;
