import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
        paddingTop: 20,
        paddingLeft: 20,
    },
    shakeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    shakeText: {
        fontSize: 100,
        fontWeight: 'bold',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        alignSelf: 'flex-start',
    },
    radioButton: {
        height: 10,
        width: 10,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRadio: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: 'black',
    },
});

export default function App() {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [mySound, setMySound] = useState();
    const [isShaking, setIsShaking] = useState(false);
    const [selectedSound, setSelectedSound] = useState("timpani");
    const [bgColor, setBgColor] = useState("white");

    async function playSound() {
        let soundfile;
        if (selectedSound === "timpani") {
            soundfile = require("./timpani.wav");
        } else if (selectedSound === "xylophone") {
            soundfile = require("./xylophone.wav");
        } else if (selectedSound === "drum") {
            soundfile = require("./drum.wav");
        }

        const { sound } = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        const subscription = Gyroscope.addListener(setData);
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (x > 1 || x < -1 || y > 1 || y < -1 || z > 1 || z < -1) {
            if (!isShaking) {
                setIsShaking(true);
                setBgColor("#ADD8E6");
                playSound();
            }
        } else {
            setIsShaking(false);
            setBgColor("white");
        }
    }, [x, y, z]);

    useEffect(() => {
        return mySound
            ? () => {
                console.log("Unloading Sound");
                mySound.unloadAsync();
            }
            : undefined;
    }, [mySound]);

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <StatusBar />

            <Text style={{ marginBottom: 10 }}>Select a Sound:</Text>

            <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedSound("timpani")}>
                <View style={styles.radioButton}>
                    {selectedSound === "timpani" && <View style={styles.selectedRadio} />}
                </View>
                <Text>Timpani</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedSound("xylophone")}>
                <View style={styles.radioButton}>
                    {selectedSound === "xylophone" && <View style={styles.selectedRadio} />}
                </View>
                <Text>Xylophone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedSound("drum")}>
                <View style={styles.radioButton}>
                    {selectedSound === "drum" && <View style={styles.selectedRadio} />}
                </View>
                <Text>Bass Drum</Text>
            </TouchableOpacity>

            {isShaking && (
                <View style={styles.shakeContainer}>
                    <Text style={styles.shakeText}>SHAKE!</Text>
                </View>
            )}
        </View>
    );

}
