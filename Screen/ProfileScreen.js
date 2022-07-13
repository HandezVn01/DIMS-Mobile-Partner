import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import GeneralItem from '../Components/ProfileScreen/GeneralItem';

export default function ProfileScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View
                style={{
                    flex: 3.5,
                    backgroundColor: '#2EC4B6',
                    borderBottomLeftRadius: 32,
                    borderBottomRightRadius: 32,
                    padding: 30,
                    paddingBottom: 0,
                }}
            >
                <View style={{ paddingTop: 20 }}>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>My Profile</Text>
                    </View>
                </View>
                <View style={{ width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: 82, width: 82, borderWidth: 1, borderRadius: 50, borderColor: '#fff' }}>
                        <Image
                            source={require('../assets/avatarDefault.png')}
                            resizeMethod="auto"
                            style={{ height: '100%', width: '100%', borderRadius: 50 }}
                        ></Image>
                    </View>
                    <View style={{ padding: 5 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Name</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 14, fontWeight: '300', color: '#fff' }}>Email</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 6.5 }}>
                <ScrollView style={styles.context}>
                    <View>
                        <View>
                            <Text style={styles.title}>General</Text>
                        </View>
                        <GeneralItem icon={'account'} title={'Personal Data'} action={'Person'}></GeneralItem>
                        <GeneralItem
                            icon={'room-service-outline'}
                            title={'Room Service'}
                            action={'RoomService'}
                        ></GeneralItem>
                    </View>
                    <View>
                        <Text style={styles.title}>Others</Text>
                    </View>
                    <GeneralItem icon={'help'} title={'Support'} action={'Help'}></GeneralItem>

                    <GeneralItem icon={'logout'} title={'Log Out'} action={'logout'}></GeneralItem>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    context: {
        padding: 20,
    },
});
