import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold, } from '@expo-google-fonts/big-shoulders';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Servicos() {
    const [token, setToken] = useState("");
    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem("token"));
        }
        carregarToken();
    }, [token])
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <View style={styles.servicos}>
                <Text style={styles.txtservicos}>NOSSOS SERVIÇOS</Text>
                <Text style={styles.txtservicos2}>OFERECEMOS UMA EXPERIENCIA COMPLETA COM PROFISSIONAIS QUALIFICADOS</Text>
            </View>
            <View style={styles.servicos}>
                <Text style={styles.txtservicos}>CORTES BASICOS</Text>
                <Image
                    source={require('../../images/tesourinhapreto.png')}
                    style={styles.tesourinha}
                    resizeMode="contain"
                />
                <Text style={styles.txtservicos2}>OFERECEMOS UMA EXPERIENCIA COMPLETA COM PROFISSIONAIS QUALIFICADOS</Text>
                <Text style={styles.price}>R$ 35,00</Text>
                <Link href={{ pathname: token ? "/Agendar" : "/Login", params: { preservice: "corte" } }} asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>AGENDE AGORA</Text>
                    </TouchableOpacity>
                </Link>

            </View>
            <View style={styles.servicos}>
                <Text style={styles.txtservicos}>BARBA & BIGODE</Text>
                <Image
                    source={require('../../images/barba.png')}
                    style={styles.tesourinha}
                    resizeMode="contain"
                />
                <Text style={styles.txtservicos2}>APARAR MODELAR E TRATAR SUA BARBA COM EFICIENCIA</Text>
                <Text style={styles.price}>R$ 30,00</Text>
                <Link href={{ pathname: token ? "/Agendar" : "/Login", params: { preservice: "barba" } }} asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>AGENDE AGORA</Text>
                    </TouchableOpacity>
                </Link>
            </View>
            <View style={styles.servicos}>
                <Text style={styles.txtservicos}>COMBO COMPLETO</Text>
                <Image
                    source={require('../../images/combo.png')}
                    style={styles.tesourinha}
                    resizeMode="contain"
                />
                <Text style={styles.txtservicos2}>CORTE & BARBA & ACABAMENTO COM PERFEIÇÃO</Text>
                <Text style={styles.price}>R$ 50,00</Text>
                <Link href={{ pathname: token ? "/Agendar" : "/Login", params: { preservice: "combo" } }} asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>AGENDE AGORA</Text>
                    </TouchableOpacity>
                </Link>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#5d5d5d",
        width: "100%",
        height: "100%",
        padding: 40,
        gap: 30,
    },
    servicos: {
        backgroundColor: "white",
        paddingVertical: 22,
        paddingHorizontal: 13,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10
    },
    txtservicos: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 44
    },
    txtservicos2: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 16,
        textAlign: "center"
    },
    price: {
        fontFamily: 'BigShoulders_700Bold',
        fontSize: 31,

    },
    button: {
        backgroundColor: 'rgba(108, 106, 106, 1)',
        paddingVertical: 7,
        paddingHorizontal: 53,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'BigShoulders_400Regular',
    },
})