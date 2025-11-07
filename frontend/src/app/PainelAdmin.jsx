import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold, } from '@expo-google-fonts/big-shoulders';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function PainelAdmin() {
    const [token, setToken] = useState("");
    const [cargo, setCargo] = useState("");
    const [user, setUser] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [allusers, setAllusers] = useState([]);
    const [updateMyServices, setUpdateMyServices] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [motivoVisible, setMotivoVisible] = useState("");
    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem("token"));
            setCargo(await AsyncStorage.getItem("cargo"));

        }
        carregarToken();
    }, [token])
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
    }, [token]);
    useEffect(() => {
        async function getAgendamentos() {
            if (!token) return;
            try {
                const response = await fetch("https://n8n.punchmarketing.com.br/webhook/agendamentos");
                const data = await response.json();
                setAgendamentos(data.status === "ok" && data.agendamentos);
            } catch (error) {
                console.log(error)
            }

        }
        getAgendamentos();
    }, [token, updateMyServices]);
    useEffect(() => {
        async function getAllUsers() {
            if (!token) return;
            try {
                const response = await fetch("https://n8n.punchmarketing.com.br/webhook/allusers");
                const data = await response.json();
                setAllusers(data.status === "ok" && data.users);
            } catch (error) {
                console.log(error);
            }
        }
        getAllUsers()
    }, [token])

    async function deslogar() {
        await AsyncStorage.clear();
        router.navigate("/");
    }
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });
    async function desmarcar(dia, id) {
        if (motivoVisible !== id) return setMotivoVisible(id);
        if (!motivo) return alert("Dê uma satisfação para o cliente");
        try {
            const response = await fetch('https://n8n.punchmarketing.com.br/webhook/desmarcar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "data": dia, "token": id, "aviso": true, "motivo": motivo }),
            });
            const data = await response.json();
            setUpdateMyServices(!updateMyServices);
            setMotivo("");
        } catch (error) {
            console.log(error);
        }
    }
    if (!fontsLoaded) {
        return null;
    }

    return (
        <ScrollView >

            <View style={styles.container}>
                <View style={styles.servicos}>
                    <Text style={styles.txtservicos}>OLÁ {user && user.nome}!</Text>
                    <Text style={styles.txtservicos2}>VEJA OS CORTES QUE FORAM AGENDADOS NO SEU PAINEL ADMINISTRATIVO</Text>
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
                {
                    agendamentos ?
                        <View style={styles.myagenda} >
                            <Text style={styles.txtservicos}>AGENDAMENTOS</Text>
                            {agendamentos.map((item, index) => (
                                <View style={styles.myagenda1} key={index}>
                                    <Text style={styles.txttipo}>{allusers.find((i) => i.token === item.id_cliente)?.nome}</Text>
                                    <Text style={styles.txtagenda}>DATA: {item.data}</Text>
                                    <Text style={styles.txtagenda}>NÚMERO: {item.telefone}</Text>
                                    <Text style={styles.txtagenda}>PREÇO: R${item.preco}</Text>
                                    {motivoVisible === item.id_cliente &&
                                        <TextInput
                                            style={styles.input}
                                            value={motivo}
                                            onChangeText={setMotivo}
                                            placeholder="MOTIVO DO CANCELAMENTO"
                                            placeholderTextColor="black"
                                            autoCapitalize="none"
                                        />
                                    }

                                    <TouchableOpacity style={styles.buttonCancel} onPress={() => desmarcar(item.data, item.id_cliente)}>
                                        <Text style={styles.buttonText}>DESMARCAR</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        :
                        <View style={styles.myagenda}>
                            <Text style={styles.txtservicos}>NENHUM AGENDAMENTO</Text>
                        </View>
                }
            </View>
            <StatusBar style="auto" />

        </ScrollView>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#5d5d5d",
        width: "100%",
        minHeight: "100%",
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
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 9,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'BigShoulders_400Regular',
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
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
        textAlign: "center",

    },
    txtservicos2: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 16,
        textAlign: "center"
    },
    txttipo: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 38,
        textAlign: 'center',
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
    myagenda: {
        backgroundColor: 'white',
        paddingVertical: 22,
        paddingHorizontal: 13,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        borderRadius: 10,
    },
    myagenda1: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '90%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        gap: 10
    },
    txtagenda: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonCancel: {
        backgroundColor: '#F56565',
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
})