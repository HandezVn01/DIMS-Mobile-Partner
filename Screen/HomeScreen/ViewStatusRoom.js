import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchFailed, dispatchFecth, dispatchSuccess } from '../../redux/actions/authAction';
import * as RoomApi from '../../Api/RoomApi';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
var { width, height } = Dimensions.get('window');
const ViewStatusRoom = ({ route }) => {
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const token = useSelector((state) => state.auth.token);
    const title = route.params.title;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [datas, setDatas] = useState(route.params.data);
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const [totalNight, setTotalNight] = useState(1);
    const refreshData = async () => {
        try {
            await RoomApi.GetAllStatus(hotelId, token)
                .then((data) => {
                    setDatas(data);
                })
                .catch((err) => console.log(err))
                .finally(() => null);
        } catch (error) {}
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            if (route.params.index === 1) {
                await refreshData();
            }
        });
        unsubscribe;
        return () => {
            console.log('return');
        };
    }, []);
    const handleRoom = async ({ roomName, status, roomId }) => {
        const go = (data, usedItem) => {
            navigation.navigate('RoomDetail', {
                roomName: roomName,
                status: status,
                roomId: roomId,
                data: data || {},
                usedItem: usedItem || [],
            });
        };
        if (status === 2) {
            try {
                dispatch(dispatchFecth());
                await RoomApi.getRoomInfo(roomId, token)
                    .then((data) => {
                        RoomApi.getUsedMenu(data.bookingDetailId, token)
                            .then((result) => go(data, result))
                            .catch((error) => dispatch(dispatchFailed()));
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch(dispatchFailed());
                    });
                dispatch(dispatchSuccess());
                // Get API roomInfo
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
    const handleCleanRoom = async (roomId) => {
        dispatch(dispatchFecth());
        await RoomApi.cleanRoom(roomId, token)
            .then((result) => refreshData())
            .catch((err) => console.log(err))
            .finally(() => dispatch(dispatchSuccess()));
    };
    const [filterFloor, setFilterFloor] = useState(true);
    let floorlist = [];
    let categoryList = [];
    try {
        const filterRoom = () => {
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
        filterRoom();
    } catch (error) {}
    const handleSearch = () => {
        dispatch(dispatchFecth());
        RoomApi.GetStatusSearch(totalNight, token)
            .then((result) => setDatas(result))
            .catch((err) => console.log(err.respones))
            .finally(() => dispatch(dispatchSuccess()));
    };
    const handleFilterFloor = () => {
        setFilterFloor(true);
    };
    const handleFilterCategory = () => {
        setFilterFloor(false);
    };
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
                <ScrollView>
                    {(filterFloor ? floorlist : categoryList).map((floor, index) => {
                        return (
                            <View style={{ height: 100 }} key={index}>
                                <ScrollView horizontal={true}>
                                    <View style={{ padding: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: 16, fontWeight: '700', paddingLeft: 15 }}>
                                                {filterFloor ? `Lầu${floor.floor + 1} ` : floor.categoryName}
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
                                                if (
                                                    filterFloor
                                                        ? data.floor === floor.floor
                                                        : data.categoryId === floor.id
                                                ) {
                                                    return (
                                                        <View key={data + index}>
                                                            <TouchableOpacity
                                                                style={{
                                                                    paddingRight: 20,
                                                                    paddingLeft: 20,
                                                                    alignItems: 'center',
                                                                }}
                                                                onPress={() => {
                                                                    if (data.allStatus == 3) {
                                                                        Alert.alert(
                                                                            `Confirm`,
                                                                            `Bạn đã dọn xong phòng ${data.roomName} ?`,
                                                                            [
                                                                                {
                                                                                    text: 'Cancel',

                                                                                    style: 'cancel',
                                                                                },
                                                                                {
                                                                                    text: 'OK',
                                                                                    onPress: () => {
                                                                                        handleCleanRoom(data.roomId);
                                                                                    },
                                                                                },
                                                                            ],
                                                                        );
                                                                    } else {
                                                                        handleRoom({
                                                                            roomName: data.roomName,
                                                                            status: data.allStatus,
                                                                            roomId: data.roomId,
                                                                        });
                                                                    }
                                                                }}
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
                                                                            : '#F9A000'
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
                </ScrollView>
                {route.params.index === 2 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            paddingBottom: 5,
                            paddingTop: 5,
                        }}
                    >
                        <TouchableOpacity onPress={handleFilterFloor}>
                            <View
                                style={{
                                    height: 36,
                                    width: 160,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#3DC5B5',
                                    borderRadius: 24,
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Lọc theo lầu</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFilterCategory}>
                            <View
                                style={{
                                    height: 36,
                                    width: 160,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'orange',
                                    borderRadius: 24,
                                }}
                            >
                                <Text>Lọc theo loại phòng</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <></>
                )}
            </View>
            <View style={styles.footer}>
                {route.params.index === 2 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            height: '100%',
                            width: '100%',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text>Total Night:</Text>
                            <Picker
                                style={{ width: 100 }}
                                selectedValue={totalNight}
                                onValueChange={(e) => setTotalNight(e)}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((element) => {
                                    return (
                                        <Picker.Item
                                            label={`${element} Đêm`}
                                            value={element}
                                            key={element}
                                        ></Picker.Item>
                                    );
                                })}
                            </Picker>
                        </View>
                        <TouchableOpacity onPress={handleSearch}>
                            <View
                                style={{
                                    height: 36,
                                    width: 160,
                                    borderRadius: 24,
                                    backgroundColor: '#3DC5B5',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Search</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : route.params.index === 1 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <TouchableOpacity onPress={handleFilterFloor}>
                            <View
                                style={{
                                    height: 36,
                                    width: 160,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#3DC5B5',
                                    borderRadius: 24,
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Lọc theo lầu</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFilterCategory}>
                            <View
                                style={{
                                    height: 36,
                                    width: 160,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'orange',
                                    borderRadius: 24,
                                }}
                            >
                                <Text>Lọc theo loại phòng</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <></>
                )}
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
        flex: 15,
    },
    footer: {
        flex: 2,
        borderTopColor: '#3DC5B5',
        borderTopWidth: 1,
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
