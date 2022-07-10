import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';

const InputCompunent = ({ title, placeholder, sub, keyboardType }) => {
    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={styles.fontText}>{title} :</Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TextInput
                    style={{
                        height: 40,
                        width: 254,
                        borderRadius: 20,
                        borderColor: '#000',
                        borderWidth: 1,
                        marginTop: 5,
                        marginBottom: 5,
                        paddingLeft: 25,
                    }}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                ></TextInput>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    fontText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
export default InputCompunent;
