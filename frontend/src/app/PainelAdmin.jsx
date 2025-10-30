import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold, } from '@expo-google-fonts/big-shoulders';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function PainelAdmin() {
    const [token, setToken] = useState("");
    const [cargo, setCargo] = useState("");
    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem("token"));
            setCargo(await AsyncStorage.getItem("cargo"));
        }
        carregarToken();

    }, [cargo])


    async function deslogar() {
        await AsyncStorage.clear();
        router.navigate("/");
    }
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>

            <View style={styles.container}>
                <View style={styles.servicos}>
                    <Text style={styles.txtservicos}>PAINEL ADMINSTRATIVO</Text>
                    <Text style={styles.txtservicos2}>VEJA OS CORTES QUE FORAM AGENDADOS</Text>
                    <Link href={"/"} asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>HOME</Text>
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity style={styles.button} onPress={deslogar}>
                        <Text style={styles.buttonText}>DESLOGAR</Text>
                    </TouchableOpacity>
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



            </View>
        </ScrollView>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#5d5d5d",
        width: "100%",
        height: "100%",
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 30,
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