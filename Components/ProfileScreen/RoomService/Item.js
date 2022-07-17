import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const Item = ({ title, price, handle }) => {
    return (
        <TouchableOpacity onPress={handle}>
            <View style={styles.itemRow}>
                <View style={styles.itemColRight}>
                    <Text>{title}</Text>
                </View>

                <View style={styles.itemCol}>
                    <Text>{price}.000 VNĐ</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    itemRow: {
        flex: 1,
        flexDirection: 'row',
    },
    itemColRight: {
        flex: 6.66,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#000',
        borderRightWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
    itemCol: {
        flex: 3.33,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
});
export default Item;
