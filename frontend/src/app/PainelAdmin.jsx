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
    const [produtos, setProdutos] = useState([]);
    const [nomeProduto, setNomeProduto] = useState("");
    const [productVisible, setProductVisible] = useState(false);
    const [quantidadeProduto, setQuantidadeProduto] = useState(0);
    const [selectedTipo, setSelectedTipo] = useState([]);
    const [novoNomeProduto, setNovoNomeProduto] = useState("");
    const [novaQuantidadeProduto, setNovaQuantidadeProduto] = useState("");
    const [openEdit, setOpenEdit] = useState("");
    const servicos = [
        { key: 1, label: "CORTE DE CABELO" },
        { key: 2, label: "BARBA" },
        { key: 3, label: "CORTE E BARBA" },
    ];
    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem("token"));
            setCargo(await AsyncStorage.getItem("cargo"));

        }
        carregarToken();
    }, []);

    useEffect(() => {
        async function getProdutos() {
            if (!token) return;
            try {
                const response = await fetch("https://n8n.punchmarketing.com.br/webhook/get_produtos");
                const data = await response.json();
                setProdutos(data.status === "ok" && data.produtos.reverse() || []);
            } catch (error) {
                console.log(error);
            }
        }
        getProdutos();
    }, [token, updateMyServices]);

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
                setAgendamentos(data.status === "ok" && data.agendamentos.reverse());
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
    }, [token]);

    async function deslogar() {
        await AsyncStorage.clear();
        router.navigate("/");
    }
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });
    async function desmarcar(dia, id, idunico) {
        if (motivoVisible !== idunico) return setMotivoVisible(idunico);
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
            setMotivoVisible("");
        } catch (error) {
            console.log(error);
        }
    }
    async function criarProduto() {
        if (!nomeProduto || !quantidadeProduto || !selectedTipo) return alert("Preencha os dados");
        try {
            const response = await fetch('https://n8n.punchmarketing.com.br/webhook/criar_produto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "nome": nomeProduto, "tipo": selectedTipo.join(", "), "quantidade": quantidadeProduto }),
            });
            setNomeProduto("");
            setQuantidadeProduto("");
            setSelectedTipo("");
            setUpdateMyServices(!updateMyServices);

        } catch (error) {
            console.log(error);
        }
    }
    if (!fontsLoaded) {
        return null;
    }
    async function excluirProdutos(id) {
        try {
            const response = await fetch('https://n8n.punchmarketing.com.br/webhook/excluir_produto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "id": id }),
            });
            setUpdateMyServices(!updateMyServices);
        } catch (error) {
            console.log(error);
        }
    }
    async function atualizarProdutos(id) {
        try {
            const response = await fetch('https://n8n.punchmarketing.com.br/webhook/atualizar_produto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "id": id, "nomeProduto": novoNomeProduto, "quantidadeProduto": novaQuantidadeProduto }),
            });
            setUpdateMyServices(!updateMyServices);
            setOpenEdit(!openEdit)
        } catch (error) {
            console.log(error);
        }
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
                                    <Text style={styles.txtagenda}>SERVIÇO: {item.servico.toUpperCase()}</Text>
                                    <Text style={styles.txtagenda}>DATA: {item.data}</Text>
                                    <Text style={styles.txtagenda}>NÚMERO: {item.telefone}</Text>
                                    <Text style={styles.txtagenda}>PREÇO: R${item.preco}</Text>
                                    {motivoVisible === `${item.id_cliente}_${item.data}` &&
                                        <TextInput
                                            style={styles.input}
                                            value={motivo}
                                            onChangeText={setMotivo}
                                            placeholder="MOTIVO DO CANCELAMENTO"
                                            placeholderTextColor="black"
                                            autoCapitalize="none"
                                        />
                                    }

                                    <TouchableOpacity style={styles.buttonCancel} onPress={() => desmarcar(item.data, item.id_cliente, `${item.id_cliente}_${item.data}`)}>
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
                <View style={styles.servicos}>
                    <Text style={styles.txtservicos}>PRODUTOS ESSENCIAIS</Text>
                    <Text style={styles.txtservicos2}>ESTOQUE DE PRODUTOS ESSENCIAIS PARA SUA BARBEARIA</Text>

                    {produtos.map((item, index) => (
                        <View style={styles.myagenda1} key={index}>
                            {openEdit === item.id ?
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={novoNomeProduto}
                                        onChangeText={setNovoNomeProduto}
                                        placeholder="NOME PRODUTO :"
                                        placeholderTextColor="black"
                                    />
                                    <Text style={styles.txtagenda}>SERVIÇO: {item.tipo.toUpperCase()}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={novaQuantidadeProduto}
                                        onChangeText={setNovaQuantidadeProduto}
                                        placeholder="QUANTIDADE PRODUTO"
                                        placeholderTextColor="black"
                                    />
                                </>

                                :
                                <>
                                    <Text style={styles.txttipo}>{item.nome.toUpperCase()}</Text>
                                    <Text style={styles.txtagenda}>SERVIÇO: {item.tipo.toUpperCase()}</Text>
                                    <Text style={styles.txtagenda}>QUANTIDADE: {item.quantidade}</Text>
                                </>


                            }

                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <TouchableOpacity style={styles.buttonCancel} onPress={() => excluirProdutos(item.id)}>
                                    <Text style={styles.buttonText}>EXCLUIR</Text>
                                </TouchableOpacity>
                                {
                                    openEdit === item.id ?

                                        <TouchableOpacity style={styles.button} onPress={() => atualizarProdutos(item.id)}>
                                            <Text style={styles.buttonText}>SALVAR</Text>
                                        </TouchableOpacity>

                                        :
                                        <TouchableOpacity style={styles.button} onPress={() => { setOpenEdit(item.id); setNovoNomeProduto(item.nome.toUpperCase()); setNovaQuantidadeProduto(item.quantidade) }}>
                                            <Text style={styles.buttonText}>EDITAR</Text>
                                        </TouchableOpacity>
                                }

                            </View>

                        </View>
                    ))}

                    <TouchableOpacity style={styles.button2} onPress={() => setProductVisible(!productVisible)}>
                        <Text style={styles.buttonText2}>{productVisible ? "-" : "+"}</Text>
                    </TouchableOpacity>
                    {productVisible &&
                        <>
                            <TextInput
                                style={styles.input}
                                value={nomeProduto}
                                onChangeText={setNomeProduto}
                                placeholder="NOME DO PRODUTO"
                                placeholderTextColor="black"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.input}
                                value={quantidadeProduto}
                                onChangeText={setQuantidadeProduto}
                                placeholder="QUANTIDADE EM ESTOQUE"
                                placeholderTextColor="black"
                                autoCapitalize="none"
                                keyboardType="numeric"

                            />
                            <Text style={styles.txtservicos2}>SERVIÇO QUE NECESSITA DO PRODUTO</Text>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                {servicos.map((item, index) => {
                                    const isSelected = selectedTipo.includes(item.label);
                                    function toggleServico() {
                                        if (isSelected) {
                                            setSelectedTipo(prev => prev.filter(serv => serv !== item.label));
                                        } else {
                                            setSelectedTipo(prev => [...prev, item.label]);
                                        }
                                    };
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={isSelected ? styles.select : styles.option}
                                            onPress={toggleServico}
                                        >
                                            <Text style={styles.txtservicos2}>{item.label.toUpperCase()}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <TouchableOpacity style={styles.button} onPress={criarProduto}>
                                <Text style={styles.buttonText}>ADICIONAR</Text>
                            </TouchableOpacity>
                        </>
                    }
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
    },
    option: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        padding: 10,
        width: '30%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
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
    select: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        padding: 10,
        width: '30%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        borderColor: '#0170b9',
        borderWidth: 3,
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
        backgroundColor: '#0170B9',
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
    button2: {
        backgroundColor: '#0170B9',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText2: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'BigShoulders_400Regular',
    },
})