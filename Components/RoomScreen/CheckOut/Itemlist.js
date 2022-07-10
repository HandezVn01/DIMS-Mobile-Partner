import { View, Text, TextInput } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Itemlist = ({ itemName, itemType, itemPrice, handleSum, itemUse }) => {
    const iconName = itemType === 'water' ? 'bottle-soda' : 'noodles';

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
            }}
        >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text>
                    <Icon name={iconName} size={30}></Icon>
                </Text>
                <Text>{itemName} :</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <TextInput
                    defaultValue={itemUse}
                    style={{
                        borderColor: '#000',
                        borderWidth: 1,
                        height: 30,
                        width: 70,
                        borderRadius: 20,
                        textAlign: 'center',
                    }}
                    onChangeText={(e) => handleSum(e)}
                    keyboardType="numeric"
                ></TextInput>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                <Text>{itemPrice}k/ 1</Text>
            </View>
        </View>
    );
};

export default Itemlist;
