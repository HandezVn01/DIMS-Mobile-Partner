import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Item from '../../Components/ProfileScreen/RoomService/Item';
const RoomService = () => {
    const navigation = useNavigation();
    const [addItem, setAddItem] = useState(false);
    const handleAddItem = () => {
        setAddItem(!addItem);
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.back}>
                        <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                    </View>
                </TouchableOpacity>
                <View style={styles.header_content}>
                    <Text style={styles.header_title}>Room Service</Text>
                </View>
            </View>
            <View style={{ flex: 17 }}>
                <ScrollView style={{ height: '100%', width: '100%', padding: 20 }}>
                    <View>
                        <View style={styles.itemListHeader}>
                            <Text style={{ color: 'orange', fontSize: 16, fontWeight: '500' }}>
                                Food List <Icon name="noodles" size={24}></Icon>
                            </Text>
                        </View>

                        <View>
                            <View style={styles.itemRow}>
                                <View style={[styles.itemColRight]}>
                                    <View
                                        style={{
                                            borderBottomColor: 'orange',
                                            borderBottomWidth: 1,
                                            width: '50%',
                                            position: 'absolute',
                                            bottom: 0,
                                        }}
                                    ></View>
                                    <Text>Food Name</Text>
                                </View>

                                <View style={styles.itemCol}>
                                    <View
                                        style={{
                                            borderBottomColor: 'orange',
                                            borderBottomWidth: 1,
                                            width: '50%',
                                            position: 'absolute',
                                            bottom: 0,
                                        }}
                                    ></View>
                                    <Text>Price</Text>
                                </View>
                            </View>
                            <Item title={'Cơm Chiên Trứng'} price={50}></Item>
                            <Item title={'Bánh Mì'} price={20}></Item>
                            <Item title={'Cơm Chiên Trứng Với Bò'} price={70}></Item>
                            <Item title={'Mì Ly'} price={10}></Item>
                            <Item title={'Nuôi xào'} price={20}></Item>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 2 }}>
                <TouchableOpacity onPress={handleAddItem}>
                    <View
                        style={{
                            borderTopColor: 'orange',
                            borderTopWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <View
                            style={{
                                height: 36,
                                width: 120,
                                backgroundColor: 'orange',
                                borderRadius: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Add</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RoomService;
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
    },
    itemCol: {
        flex: 3.33,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    itemListHeader: {
        marginTop: 5,
        marginBottom: 5,
        borderBottomColor: 'orange',
        borderBottomWidth: 2,
    },
    header: {
        flex: 3,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 20,
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
    header_title: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
        marginLeft: 15,
    },
    header_content: {
        alignItems: 'center',
    },
});
