import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold, } from '@expo-google-fonts/big-shoulders';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Hero() {
    const [token, setToken] = useState("");
    const [cargo, setCargo] = useState("");
    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem("token"));
            setCargo(await AsyncStorage.getItem("cargo"));
        }
        carregarToken();

    }, [])
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (

        <ImageBackground
            source={require('../../images/bghome.png')}
            style={cargo === 'admin' ? styles.imgbackground2 : styles.imgbackground}
            resizeMode="cover"
        >
            <Image
                source={require('../../images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Image
                source={require('../../images/tesourinhabranco.png')}
                style={styles.tesourinha}
                resizeMode="contain"
            />
            <Text style={styles.txt}>BARBEARIA DE ELITE</Text>
            <Text style={styles.txt2}>experiências premium e cortes e masculinos</Text>

            <Link href={token && cargo === "user" ? "/Agendar" : token && cargo === "admin" ? "/PainelAdmin" : "/Login"} asChild >
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{token && cargo === "user" ? "AGENDAR" : token && cargo === "admin" ? "PAINEL ADMIN" : "FAZER LOGIN"}</Text>
                </TouchableOpacity>
            </Link>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imgbackground: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 150
    },
    imgbackground2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    logo: {
        width: 200,
        height: 200,
    },
    tesourinha: {
        width: 120,
        height: 120,
    },
    txt: {
        color: 'white',
        fontSize: 32,
        fontFamily: 'BigShoulders_400Regular',
    },
    txt2: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'BigShoulders_400Regular',

    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 7,
        paddingHorizontal: 53,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'BigShoulders_400Regular',
    },
});
