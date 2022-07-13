import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/HomeScreen';
import ProfileScreen from '../Screen/ProfileScreen';
import AutoScreen from '../Screen/AutoScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#3DC5B5' }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="home-battery-outline" size={24} color={color}></Icon>,
                }}
            />
            <Tab.Screen
                name="Auto"
                component={AutoScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="login" size={24} color={color}></Icon>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="account" size={24} color={color}></Icon>,
                }}
            />
        </Tab.Navigator>
    );
}

export default function TabNavigation() {
    return <MyTabs />;
}
