import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFailed, dispatchFecth, dispatchSuccess } from '../../redux/actions/authAction';
import * as RoomApi from '../../Api/RoomStatus';

var { width, height } = Dimensions.get('window');
const ViewStatusRoom = ({ route }) => {
    const title = route.params.title;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [datas, setDatas] = useState(route.params.data);
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // useEffect(()=>{
    //     await RoomStatusAPI.GetAllStatus(token, today, 0)
    //                 .then((data) => {
    //                     go(data);
    //                 })
    //                 .catch((err) => console.log(err));
    // },[])
    const handleRoom = async ({ roomName, status, roomId }) => {
        const go = (data) => {
            navigation.navigate('RoomDetail', {
                roomName: roomName,
                status: status,
                roomId: roomId,
                data: data || {},
            });
        };
        if (status === 2) {
            try {
                dispatch(dispatchFecth());
                await RoomApi.getRoomInfo(roomId)
                    .then((data) => go(data))
                    .catch((err) => {
                        console.log(err);
                        dispatch(dispatchFailed());
                    });
                // Get API roomInfo

                dispatch(dispatchSuccess());
            } catch (error) {}
        } else {
            go();
        }
    };

    const removeDulicate = (arr) => {
        const uniqueIds = [];
        const unique = arr.filter((element) => {
            const isDuplicate = uniqueIds.includes(element.id);

            if (!isDuplicate) {
                uniqueIds.push(element.id);

                return true;
            }

            return false;
        });
        return unique;
    };

    let floorlist = [];
    let categoryList = [];
    try {
        const abc = () => {
            if (datas.length > 0) {
                datas.map((data) => {
                    floorlist.push({
                        id: data.floor,
                        floor: data.floor,
                    });
                    categoryList.push({
                        id: data.categoryId,
                        categoryName: data.categoryName,
                    });
                });
                floorlist = removeDulicate(floorlist);
                categoryList = removeDulicate(categoryList);
                const test = datas.filter((data) => {
                    return data.floor == floorlist[0].floor;
                });
            }
        };
        abc();
    } catch (error) {}

    return (
        <View style={{ flex: 1, marginTop: 20 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.back}>
                        <Icon name="chevron-left" size={30} color="#3DC5B5"></Icon>
                    </View>
                </TouchableOpacity>
                <Text style={styles.header_title}>{title}</Text>
            </View>
            <View style={styles.container}>
                {floorlist.map((floor, index) => {
                    return (
                        <View style={{ height: 100 }} key={index}>
                            <ScrollView horizontal={true}>
                                <View style={{ padding: 10 }}>
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: '700', paddingLeft: 15 }}>
                                            Lầu {floor.floor + 1}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingRight: 20,
                                            paddingLeft: 20,
                                            paddingTop: 5,
                                        }}
                                    >
                                        {datas.map((data, index) => {
                                            if (data.floor === floor.floor) {
                                                return (
                                                    <View key={data + index}>
                                                        <TouchableOpacity
                                                            style={{
                                                                paddingRight: 20,
                                                                paddingLeft: 20,
                                                                alignItems: 'center',
                                                            }}
                                                            onPress={() =>
                                                                handleRoom({
                                                                    roomName: data.roomName,
                                                                    status: data.allStatus,
                                                                    roomId: data.roomId,
                                                                })
                                                            }
                                                        >
                                                            <Icon
                                                                name="home"
                                                                size={24}
                                                                color={
                                                                    data.allStatus == 2
                                                                        ? '#3DC5B5'
                                                                        : data.allStatus == 3
                                                                        ? '#E31717'
                                                                        : data.allStatus == 1
                                                                        ? '#000'
                                                                        : data.bookedStatus != null
                                                                        ? '#F9A000'
                                                                        : '#000'
                                                                }
                                                            ></Icon>
                                                            <Text>{data.roomName}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                );
                                            }
                                        })}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                })}

                <TouchableOpacity onPress={() => handleRoom({ roomName: '101', status: '1' })}>
                    <Text>101</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRoom({ roomName: '102', status: '2' })}>
                    <Text>102</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 20 },
    header_title: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0.5,
        marginLeft: 15,
    },
    container: {
        flex: 17,
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
});
export default ViewStatusRoom;
