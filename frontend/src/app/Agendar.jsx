import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold, } from '@expo-google-fonts/big-shoulders';
import { Link, router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function Agendar() {
    const [token, setToken] = useState("");
    const [cargo, setCargo] = useState("");
    const [user, setUser] = useState([]);
    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem("token"));
            setCargo(await AsyncStorage.getItem("cargo"));

        }
        carregarToken();
    }, [cargo])
    useEffect(() => {
        async function getUser() {
            if (!token) return;
            try {
                const response = await fetch("https://n8n.punchmarketing.com.br/webhook/getuser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                })
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.log(error);
            }
        }
        getUser()
    }, [token])
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }
    async function deslogar() {
        await AsyncStorage.clear();
        router.navigate("/");
    }
    return (
        <ScrollView >

            <View style={styles.container}>
                <View style={styles.servicos}>
                    <Text style={styles.txtservicos}>OLÁ {user && user.nome}!</Text>
                    <Text style={styles.txtservicos2}>AGENDE UM CORTE ONLINE NA BARBEARIA DANIEL</Text>
                    <View style={styles.btts}>
                        <Link href={"/"} asChild>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>HOME</Text>
                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity style={styles.button} onPress={deslogar}>
                            <Text style={styles.buttonText}>DESLOGAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.servicos}>
                    <Text style={styles.txtservicos}>CORTES BASICOS</Text>
                    <Image
                        source={require('../../images/tesourinhapreto.png')}
                        style={styles.tesourinha}
                        resizeMode="contain"
                    />
                    <Text style={styles.txtservicos2}>OFERECEMOS UMA EXPERIENCIA COMPLETA COM PROFISSIONAIS QUALIFICADOS</Text>
                    <Text style={styles.price}>R$ 45,00</Text>
                    <Link href={"/"} asChild>
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
                    <Text style={styles.price}>R$ 55,00</Text>
                    <Link href={"/"} asChild>
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
                    <Text style={styles.price}>R$ 70,00</Text>
                    <Link href={"/"} asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>AGENDE AGORA</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </View>
            <StatusBar style="auto" />
        </ScrollView>


    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#5d5d5d",
        width: "100%",
        height: "100%",
        paddingHorizontal: 30,
        paddingVertical: 70,
        gap: 30,
        flex: 1
    },
    btts: {
        flexDirection: 'row',
        gap: 5,
        flex: 1
    },
    servicos: {
        backgroundColor: "white",
        paddingVertical: 22,
        paddingHorizontal: 13,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10,

    },
    txtservicos: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 44,
        textAlign: "center"
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
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'BigShoulders_400Regular',
    },
})