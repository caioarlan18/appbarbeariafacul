import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold, } from '@expo-google-fonts/big-shoulders';
import { useState } from 'react';
import { Link, router } from 'expo-router';

export default function CriarConta() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    async function criar() {
        if (!nome || !email || !senha) return alert("Preencha todos os campos!");
        if (email.length < 8 || !email.includes("@")) return alert("Coloque um email válido");
        if (senha.length < 6) return alert("Coloque uma senha segura");

        try {
            const response = await fetch("https://n8n.punchmarketing.com.br/webhook/criarconta-barberfacul", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha, cargo: "user" }),
            })
            const data = await response.json();
            alert(data.mensagem);
            setNome("");
            setEmail("");
            setSenha("");

        } catch (error) {
            console.log(error)
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
                    value={nome}
                    onChangeText={setNome}
                    placeholder="NOME :"
                    placeholderTextColor="black"

                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="EMAIL :"
                    placeholderTextColor="black"

                />
                <TextInput
                    style={styles.input}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="SENHA :"
                    placeholderTextColor="black"

                />


                <TouchableOpacity style={styles.join} onPress={criar}>
                    <Text style={styles.joinText}>CRIAR</Text>
                </TouchableOpacity>

                <Text style={styles.ou}>OU ENTÃO:</Text>
                <View style={styles.login2}>
                    <Link href={"/"} asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>VOLTAR</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href={"/Login"} asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>LOGIN</Text>
                        </TouchableOpacity>
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
