import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold, } from '@expo-google-fonts/big-shoulders';
import { useState } from 'react';
import { Link } from 'expo-router';

export default function Login() {
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <ImageBackground
            source={require('../../images/madeira.png')}
            style={styles.imgbackground}
            resizeMode="cover"
        >
            <View style={styles.login}>
                <Image
                    source={require('../../images/triangulo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <TextInput
                    style={styles.input}
                    placeholder="E-MAIL :"
                    placeholderTextColor="black"

                />
                <TextInput
                    style={styles.input}
                    placeholder="SENHA :"
                    placeholderTextColor="black"

                />

                <Link href={"/"} style={styles.join}>
                    <Text style={styles.joinText}>ENTRAR</Text>
                </Link>
                <Text style={styles.ou}>OU ENTÃO:</Text>
                <View style={styles.login2}>
                    <Link href={"/"} style={styles.button}>
                        <Text style={styles.buttonText}>CRIAR CONTA</Text>
                    </Link>
                    <Link href={"/"} style={styles.button}>
                        <Text style={styles.buttonText}>VOLTAR</Text>
                    </Link>
                </View>
            </View>

        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    imgbackground: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    login: {
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "70%",

    },
    login2: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        width: "100%",
    },
    logo: {
        width: 300,
        height: 300,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 9,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'BigShoulders_400Regular',
    },
    button: {
        backgroundColor: '#6C6A6A',
        paddingVertical: 7,
        borderRadius: 10,
        flex: 1,
        textAlign: "center"
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'BigShoulders_400Regular',
    },
    join: {
        backgroundColor: 'white',
        paddingVertical: 7,
        borderRadius: 10,
        width: "100%",
        textAlign: "center"
    },
    joinText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'BigShoulders_400Regular',
    },
    ou: {
        fontFamily: 'BigShoulders_400Regular',
        color: "white",
        fontSize: 18,

    }


});
