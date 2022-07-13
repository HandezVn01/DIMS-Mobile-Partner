import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import Footer from '../Components/Footer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeItem from '../Components/HomeScreen/HomeItem';
var { width, height } = Dimensions.get('window');
export default function HomeScreen() {
    const auth = useSelector((state) => state.auth);

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <View>
                    <Text style={styles.header_SayHi}>
                        Hi {auth.user.userName || ''}
                        <Icon name="hand-wave-outline" size={24} color="rgba(249, 164, 0, 0.74);"></Icon>
                    </Text>
                </View>
                <View>
                    <Text style={styles.header_letgo}>
                        <Text>
                            Let go to manages your <Text style={styles.header_hotel}>hotel !</Text>
                        </Text>
                    </Text>
                </View>
            </View>
            <View style={styles.inner}>
                <HomeItem
                    icon="home-city-outline"
                    title="View Status Room"
                    backgroundColor="#2EC4B6"
                    index={1}
                ></HomeItem>
                <HomeItem icon="login" title="Check In Room" backgroundColor="#CCCCEE" index={2}></HomeItem>
                <HomeItem
                    icon="logout"
                    title="Check Out Room"
                    backgroundColor="rgba(244, 137, 137, 0.96)"
                    index={3}
                ></HomeItem>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: height * 0.07,
        left: 25,
    },
    items: {
        height: 120,
        width: 310,
        borderRadius: 20,
        backgroundColor: '#2EC4B6',
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
    inner: {
        position: 'absolute',
        top: height * 0.18,
        width: '100%',
        left: 0,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    header_SayHi: {
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
    },
    header_letgo: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: '#697B7A',
    },
    header_hotel: {
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: '#2EC4B6',
    },
});
