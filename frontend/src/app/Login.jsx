import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold } from '@expo-google-fonts/big-shoulders';
import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    async function entrar() {
        if (!email || !senha) return alert("Preencha todos os campos!");
        try {
            const response = await fetch("https://n8n.punchmarketing.com.br/webhook/login-barberfacul", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            })
            const data = await response.json();
            if (data.status === "ok") {
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("cargo", data.cargo);
            } else {
                return alert(data.mensagem)
            }
            setEmail("");
            setSenha("");
            router.navigate("/")
        } catch (error) {
            console.log(error);
        }
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
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-MAIL :"
                    placeholderTextColor="black"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="SENHA :"
                    placeholderTextColor="black"
                    secureTextEntry
                />

                <TouchableOpacity style={styles.join} onPress={entrar} >
                    <Text style={styles.joinText}>ENTRAR</Text>
                </TouchableOpacity>

                <Text style={styles.ou}>OU ENTÃO:</Text>

                <View style={styles.login2}>
                    <Link href={"/"} asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>VOLTAR</Text>
                        </TouchableOpacity>
                    </Link>

                    <Link href={"/CriarConta"} asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>CRIAR CONTA</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
            <StatusBar style="light" />

        </ImageBackground>
    );
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
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center"
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
        justifyContent: "center",
        alignItems: "center"
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
