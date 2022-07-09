import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [datatmp, setDataTmp] = useState('');
    const [sound, setSound] = React.useState();
    const [image, setImage] = useState(null);
    const [list, setList] = useState([]);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    // camera ref to access camera

    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('../assets/beep.mp3'));
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    const takephoto = async () => {
        if (cameraRef) {
            console.log('take ');
            try {
                let photo = await cameraRef.current.takePictureAsync({
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                });
                return photo;
            } catch (error) {
                console.log(error);
            }
        }
    };
    var metadata = {
        contentType: 'image/jpeg',
    };
    const handleBarCodeScanned = ({ type, data }) => {
        if (data !== datatmp) {
            alert(`Bar code with type ${type} and data ${data} has been scanned!`);
            setDataTmp(data);
            const check = data.indexOf('|');
            if (check != -1) {
                const value = data.split('|');
                const new_data = {
                    address: value[5],
                    birthday: value[3],
                    gen: value[4],
                    number: value[0],
                    name: value[2],
                };
                setList([...list, new_data]);
            } else {
                const values = data.split('\n');
                const new_data = {
                    address: values[4],
                    birthday: values[2],
                    gen: '',
                    number: values[0],
                    name: values[1],
                };
                setList([...list, new_data]);
                // console.log(data)
            }

            playSound();
        }
    };
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            {Platform.OS === 'ios' ? (
                <Camera
                    style={styles.camera}
                    type={type}
                    onBarCodeScanned={handleBarCodeScanned}
                    focusDepth={1}
                ></Camera>
            ) : (
                <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
            )}

            <TouchableOpacity
                style={styles.takephoto}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Text style={styles.text}>Finish</Text>
            </TouchableOpacity>
            <View>
                {list.map((index, item) => {
                    <Text>
                        {index}
                        {item.name}
                        {item.address}
                    </Text>;
                })}
                <Text>Hello Wolrd</Text>
            </View>
        </View>
    );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const heightCamera = (windowWidth / 16) * 9;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    camera: {
        height: 200,
        width: '100%',
    },
    takephoto: {
        backgroundColor: '#1B74E4',
        width: 50,
        height: 50,
        borderRadius: 50,
        alignSelf: 'center',
    },
});
