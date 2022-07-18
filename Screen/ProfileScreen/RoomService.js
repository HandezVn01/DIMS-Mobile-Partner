import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Item from '../../Components/ProfileScreen/RoomService/Item';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import * as Api from '../../Api/ServicesApi';
import { dispatchFailed, dispatchFecth, dispatchSuccess, dispatchSuccessMenu } from '../../redux/actions/authAction';
const RoomService = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [addItem, setAddItem] = useState(false);
    const [MenuList, setMenuList] = useState(useSelector((state) => state.menuReducer.data) || []);
    const token = useSelector((state) => state.auth.token);
    const hotelId = useSelector((state) => state.auth.hoteiId);
    const [show, setShow] = useState(false);
    let typeList = [];
    const [newItemList, setNewItemList] = useState([]);
    const [menuIDTmp, setmenuIDTmp] = useState('');
    const [menuNameTmp, setmenuNameTmp] = useState('');
    const [menuPriceTmp, setmenuPriceTmp] = useState('');
    const [menuTypeTmp, setmenuTypeTmp] = useState('');
    const [addState, setAddState] = useState(false);
    const handleInfoItem = (id, name, price, type) => {
        setShow(true);
        setmenuIDTmp(id);
        setmenuNameTmp(name);
        setmenuPriceTmp(price);
        setmenuTypeTmp(type);
        setAddItem(false);
    };
    const handleAddItem = () => {
        setShow(true);
        setmenuNameTmp('');
        setmenuPriceTmp('');
        setmenuTypeTmp('WATER');
        setAddItem(true);
        setAddState(true);
    };

    const handleAddItemSubmit = () => {
        setNewItemList([
            ...newItemList,
            {
                hotelId: hotelId,
                menuName: menuNameTmp,
                menuPrice: menuPriceTmp,
                menuType: menuTypeTmp,
                menuStatus: true,
            },
        ]);
        setMenuList([
            ...MenuList,
            {
                hotelId: hotelId,
                menuId: MenuList.length + 'Add',
                menuName: menuNameTmp,
                menuPrice: menuPriceTmp,
                menuRealQuanity: null,
                menuStatus: true,
                menuType: menuTypeTmp,
            },
        ]);
        setShow(!show);
        Alert.alert('Success', 'Bấm Save để lưu dữ liệu đã add !');
    };
    const handleAddItemFinal = () => {
        console.log(newItemList);
        dispatch(dispatchFecth());
        Api.AddItemMenu(newItemList, token)
            .then((result) => {
                console.log(result);
                dispatch(dispatchSuccess());
                Alert.alert('Success', 'Đã Add Thành Công !');
            })
            .catch((err) => dispatch(dispatchFailed()))
            .finally(() => dispatch(dispatchSuccessMenu(MenuList)));
        setAddState(false);
    };
    const handleUpdateItem = () => {
        try {
            const flag = `${menuIDTmp}`.includes('Add') || false;
            if (flag) {
                console.log('alo');
                MenuList.map((list) => {
                    if (list.menuId === menuIDTmp) {
                        list.menuName = menuNameTmp;
                        list.menuPrice = menuPriceTmp;
                        list.menuType = menuTypeTmp;
                        return list;
                    }
                    return list;
                });
                setShow(!show);
                Alert.alert('Update Success ! ', 'Đã Sửa  ');
            } else {
                console.log('hello');
                dispatch(dispatchFecth());
                Api.UpdateItemMenu(hotelId, menuIDTmp, menuNameTmp, menuPriceTmp, menuTypeTmp, token)
                    .then((result) => {
                        MenuList.map((list) => {
                            if (list.menuId === menuIDTmp) {
                                list.menuName = menuNameTmp;
                                list.menuPrice = menuPriceTmp;
                                list.menuType = menuTypeTmp;
                                return list;
                            }
                            return list;
                        });
                        setShow(!show);
                        Alert.alert('Update Success ! ', 'Đã Sửa  ');
                    })
                    .catch((err) => console.log(err.respones))
                    .finally(() => {
                        dispatch(dispatchSuccessMenu(MenuList)), dispatch(dispatchSuccess());
                    });
            }
        } catch (error) {}
    };
    const handleRemoveItem = () => {
        Alert.alert('Remove Item', `Bạn muốn xóa ${menuNameTmp}`, [
            {
                text: 'Cancel',

                style: 'cancel',
            },
            { text: 'OK', onPress: () => removeAccept() },
        ]);
        const removeAccept = () => {
            try {
                const flag = `${menuIDTmp}`.includes('Add') || false;
                if (flag) {
                    MenuList.map((list) => {
                        if (list.menuId === menuIDTmp) {
                            list.menuStatus = false;
                            return list;
                        }
                        return list;
                    });
                    setShow(!show);
                    Alert.alert('Remove Success !', 'Đã Xóa ');
                } else {
                    dispatch(dispatchFecth());
                    Api.RemoveItemMenu(hotelId, menuIDTmp, menuNameTmp, menuPriceTmp, menuTypeTmp, false, token)
                        .then((result) => {
                            MenuList.map((list) => {
                                if (list.menuId === menuIDTmp) {
                                    list.menuStatus = false;
                                    return list;
                                }
                                return list;
                            });
                            setShow(!show);
                            Alert.alert('Remove Success !', 'Đã Xóa ');
                        })
                        .catch((err) => console.log(err.respones))
                        .finally(() => dispatch(dispatchSuccessMenu(MenuList)), dispatch(dispatchSuccess()));
                }
            } catch (error) {}
        };
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
    try {
        const abc = () => {
            if (MenuList.length > 0) {
                MenuList.map((item) => {
                    typeList.push({
                        id: item.menuType === 'WATER' ? 1 : item.menuType === 'SERVICE' ? 3 : 2,
                        type: item.menuType === 'WATER' ? 'Water' : item.menuType === 'SERVICE' ? 'Service' : 'Food',
                        TYPE: item.menuType,
                    });
                });

                typeList = removeDulicate(typeList);
                typeList.sort(function (a, b) {
                    return a.id - b.id;
                });
            }
        };
        abc();
    } catch (error) {}
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
                    {typeList.map((type, index) => {
                        return (
                            <View key={index}>
                                <View style={styles.itemListHeader}>
                                    <Text style={{ color: 'orange', fontSize: 16, fontWeight: '500' }}>
                                        {type.type} List{' '}
                                        <Icon
                                            name={
                                                type.id === 1
                                                    ? 'bottle-soda-classic'
                                                    : type.id === 2
                                                    ? 'noodles'
                                                    : 'room-service'
                                            }
                                            size={24}
                                        ></Icon>
                                    </Text>
                                </View>

                                <View style={{ paddingBottom: index == 2 ? 30 : 0 }}>
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
                                            <Text>{type.type} Name</Text>
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
                                    {MenuList.map((item) => {
                                        if (item.menuType === type.TYPE && item.menuStatus === true) {
                                            return (
                                                <Item
                                                    title={item.menuName}
                                                    price={item.menuPrice}
                                                    key={item.menuId}
                                                    handle={() =>
                                                        handleInfoItem(
                                                            item.menuId,
                                                            item.menuName,
                                                            item.menuPrice,
                                                            type.TYPE,
                                                        )
                                                    }
                                                ></Item>
                                            );
                                        }
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
            <View style={{ flex: 2 }}>
                <View
                    style={{
                        borderTopColor: 'orange',
                        borderTopWidth: 1,
                        alignItems: 'center',
                        justifyContent: addState ? 'space-around' : 'center',
                        height: '100%',
                        flexDirection: 'row',
                    }}
                >
                    {addState ? (
                        <TouchableOpacity onPress={handleAddItemFinal}>
                            <View
                                style={{
                                    height: 36,
                                    width: 120,
                                    backgroundColor: '#3DC5B5',
                                    borderRadius: 14,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                    <TouchableOpacity onPress={handleAddItem}>
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
                    </TouchableOpacity>
                </View>
            </View>

            {show ? (
                <View style={styles.showPopup}>
                    <View style={styles.PopupContainer}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 20,
                                paddingTop: 5,
                                paddingBottom: 5,
                                borderBottomWidth: 1,
                                alignItems: 'center',
                                flex: 1,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#3DC5B5' }}>Item Info</Text>
                            <TouchableOpacity onPress={() => setShow(!show)}>
                                <Icon name="close" size={30}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'space-around', flex: 11 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text>Type </Text>
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        borderRadius: 20,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Picker
                                        style={{ width: 120, textAlign: 'center' }}
                                        selectedValue={menuTypeTmp}
                                        onValueChange={(itemValue, index) => setmenuTypeTmp(itemValue)}
                                    >
                                        <Picker.Item label="Water" value="WATER" />
                                        <Picker.Item label="Food" value="FOOD" />
                                        <Picker.Item label="Service" value="SERVICE" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text> Name of Service </Text>
                                <TextInput
                                    style={{
                                        width: 200,
                                        height: 40,
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        borderRadius: 24,
                                        paddingLeft: 10,
                                    }}
                                    value={menuNameTmp}
                                    placeholder={'Service Name'}
                                    onChangeText={(e) => setmenuNameTmp(e)}
                                ></TextInput>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text>Price of Service</Text>
                                <TextInput
                                    style={{
                                        width: 100,
                                        height: 40,
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        borderRadius: 24,
                                        paddingLeft: 10,
                                    }}
                                    defaultValue={`${menuPriceTmp}`}
                                    placeholder={'Price'}
                                    keyboardType={'numeric'}
                                    onChangeText={(e) => setmenuPriceTmp(e)}
                                ></TextInput>
                            </View>
                            {addItem ? (
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <TouchableOpacity onPress={handleAddItemSubmit}>
                                        <View
                                            style={{
                                                width: 120,
                                                height: 36,
                                                backgroundColor: '#3DC5B5',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 16,
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Add</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <TouchableOpacity onPress={handleUpdateItem}>
                                        <View
                                            style={{
                                                width: 120,
                                                height: 36,
                                                backgroundColor: '#3DC5B5',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 16,
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleRemoveItem}>
                                        <View
                                            style={{
                                                width: 120,
                                                height: 36,
                                                backgroundColor: 'orange',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 16,
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Delete Item</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={styles.PopupSplash}></View>
                </View>
            ) : (
                <View></View>
            )}
        </View>
    );
};

export default RoomService;
const styles = StyleSheet.create({
    showPopup: {
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    PopupContainer: {
        position: 'relative',
        backgroundColor: '#FFF',
        height: '70%',
        width: '90%',
        opacity: 1,
        borderRadius: 20,
        zIndex: 1,
    },
    PopupSplash: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#ebeaea',
        opacity: 0.5,
    },
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
