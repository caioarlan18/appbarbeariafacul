import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFonts, BigShoulders_400Regular, BigShoulders_700Bold } from '@expo-google-fonts/big-shoulders';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ptBR } from '../utils/localeCalendarConfig';
import { initDB, salvarAgendamentoLocal, buscarPendentes, marcarComoEnviado } from '../services/database';
import MaskInput from 'react-native-mask-input';
import NetInfo from '@react-native-community/netinfo';
LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

export default function Agendar() {
    const [token, setToken] = useState('');
    const [cargo, setCargo] = useState('');
    const [user, setUser] = useState([]);
    const [service, setService] = useState('');
    const [step, setStep] = useState(1);
    const [date, setDate] = useState('');
    const [telefone, setTelefone] = useState('');
    const [horario, setHorario] = useState('');
    const [ocupados, setOcupados] = useState([]);
    const [markedDate, setMarkedDate] = useState('');
    const [myservices, setMyservices] = useState([]);
    const isSyncing = useRef(false);
    const [updateMyServices, setUpdateMyServices] = useState(false);
    const [produtos, setProdutos] = useState([]);
    useEffect(() => {
        initDB();
    }, []);

    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem('token'));
            setCargo(await AsyncStorage.getItem('cargo'));
        }
        carregarToken();
    }, [token]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (state.isConnected && !isSyncing.current) {
                isSyncing.current = true;
                await sincronizarPendentes();
                isSyncing.current = false;
            }
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        async function getMyServices() {
            if (!token) return;
            try {
                const response = await fetch('https://n8n.punchmarketing.com.br/webhook/myservices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "token": token }),
                });
                const data = await response.json();

                setMyservices(data.status === "ok" && data.myservices.reverse());
            } catch (error) {
                console.log(error)
            }

        }
        getMyServices();
    }, [token, updateMyServices]);

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

    async function sincronizarPendentes() {
        try {
            const pendentes = await buscarPendentes();
            if (pendentes.length === 0) return;

            for (const item of pendentes) {
                const payload = {
                    token: item.token,
                    service: item.service,
                    date: item.date,
                    horario: item.horario,
                    telefone: item.telefone,
                    price: item.price,
                };

                try {
                    const response = await fetch('https://n8n.punchmarketing.com.br/webhook/marcar_horario', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });

                    const responseText = await response.text();

                    if (response.ok) {
                        if (responseText) {
                            const data = JSON.parse(responseText);
                            if (data.mensagem) {
                                await marcarComoEnviado(item.id);
                            }
                        } else {
                            console.log('Sincronização OK (resposta vazia), marcando como enviado.');
                            await marcarComoEnviado(item.id);
                        }
                    } else {
                        console.log('Erro do servidor ao sincronizar:', response.status, responseText);
                    }

                } catch (error) {
                    console.log('Erro ao processar sincronização do item:', error);
                }
            }
        } catch (error) {
            console.log('Erro geral na sincronização:', error);
        }
    }

    useEffect(() => {
        async function getUser() {
            if (!token) return;
            try {
                const response = await fetch('https://n8n.punchmarketing.com.br/webhook/getuser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });


                const responseText = await response.text();
                if (responseText) {
                    const data = JSON.parse(responseText);
                    setUser(data);
                } else {
                    console.log('Resposta vazia ao buscar usuário.');
                    setUser([]);
                }

            } catch (error) {
                console.log('Erro ao buscar usuário:', error);
            }
        }
        getUser();
    }, [token]);

    const hrs = [
        '09:00', '09:30',
        '10:00', '10:30',
        '11:00', '11:30',
        '12:00', '12:30',
        '13:00', '13:30',
        '14:00', '14:30',
        '15:00', '15:30',
        '16:00', '16:30',
        '17:00'
    ];
    const servicos = [
        { key: 1, label: "CORTE DE CABELO", price: "R$35,00", image: require("../../images/tesourinhapreto.png") },
        { key: 2, label: "BARBA", price: "R$30,00", image: require("../../images/barba.png") },
        { key: 3, label: "CORTE E BARBA", price: "R$50,00", image: require("../../images/combo.png") },
    ];

    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) return null;

    async function deslogar() {
        await AsyncStorage.clear();
        router.navigate('/');
    }

    async function marcar() {
        if (!telefone || telefone.length < 8) return alert('Preencha com um número válido');

        const payload = {
            token,
            service,
            date,
            horario,
            telefone,
            price:
                service === 'CORTE DE CABELO' ? 35 :
                    service === 'BARBA' ? 30 :
                        service === 'CORTE E BARBA' ? 50 : 0,
        };

        const state = await NetInfo.fetch();

        if (state.isConnected) {
            try {
                const response = await fetch('https://n8n.punchmarketing.com.br/webhook/marcar_horario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const responseText = await response.text();
                const data = JSON.parse(responseText);
                alert(data.mensagem);


            } catch (error) {
                console.log('Erro ao enviar online, salvando local:', error);
                await salvarAgendamentoLocal(payload);
                alert('Sem conexão. Agendamento salvo e será enviado quando a internet voltar.');
            }
        } else {
            await salvarAgendamentoLocal(payload);
            alert('Sem internet. Pré-agendamento salvo, quando a internet voltar informaremos o status do seu agendamento');
        }

        setStep(1);
        setService('');
        setDate('');
        setHorario('');
        setTelefone('');
        setMarkedDate('');
        setUpdateMyServices(!updateMyServices);

    }

    async function buscarOcupados(day) {
        setMarkedDate(day.dateString);
        setHorario("");
        const formattedDate = `${day.day}/${day.month}/${day.year}`;
        setDate(formattedDate);

        try {
            const response = await fetch('https://n8n.punchmarketing.com.br/webhook/horarios-ocupados');

            const responseText = await response.text();
            if (!responseText) {
                console.log('Nenhum horário ocupado retornado.');
                setOcupados([]);
                return;
            }

            const data = JSON.parse(responseText);
            const horarios = data.horarios_ocupados

            const horariosOcupados = horarios
                .filter((item) => item.startsWith(formattedDate))
                .map((item) => item.split(' - ')[1].trim());

            setOcupados(horariosOcupados);
        } catch (error) {
            console.log('Erro ao buscar horários:', error);
            setOcupados([]);
        }
    }
    async function desmarcar(dia, id) {
        try {
            const response = await fetch('https://n8n.punchmarketing.com.br/webhook/desmarcar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "data": dia, "token": id, "aviso": false }),
            });
            const data = await response.json();
            setUpdateMyServices(!updateMyServices);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ScrollView style={{ backgroundColor: '#5d5d5d' }}>
            <View style={styles.container}>
                <View style={styles.servicos}>
                    <Text style={styles.txtservicos}>OLÁ {user && user.nome}!</Text>
                    <Text style={styles.txtservicos2}>AGENDE UM CORTE ONLINE NA BARBEARIA DANIEL</Text>
                    <View style={styles.btts}>
                        <Link href={'/'} asChild>
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
                    {step === 1 ? (
                        <>
                            <Text style={styles.txtservicos}>ESCOLHA O SERVIÇO</Text>
                            {servicos.map((item, index) => {
                                const foraDeEstoque = produtos.some(i => i.tipo.includes(item.label) && i.quantidade === 0);
                                return (
                                    <TouchableOpacity key={index} style={service === item.label && !foraDeEstoque ? styles.select : foraDeEstoque ? styles.dis : styles.option} onPress={() => { if (foraDeEstoque) return alert("Serviço indisponível por falta de estoque"); setService(item.label) }} >
                                        <Image source={item.image} style={styles.img} resizeMode='contain' />
                                        <Text style={styles.txtservicos2}>{item.label} - {item.price} </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    ) : step === 2 ? (
                        <>
                            <Text style={styles.txtservicos}>ESCOLHA A DATA</Text>
                            <Calendar
                                style={styles.calendar}
                                theme={{
                                    todayTextColor: '#0170b9',
                                    selectedDayBackgroundColor: '#0170b9',
                                    selectedDayTextColor: '#e8e8e8',
                                    arrowColor: '#0170b9',
                                }}
                                hideExtraDays
                                minDate={new Date().toDateString()}
                                onDayPress={buscarOcupados}
                                markedDates={markedDate ? { [markedDate]: { selected: true } } : {}}
                            />

                            {date && (
                                <View style={styles.hrs}>
                                    {hrs.map((item, index) => {
                                        const estaOcupado = ocupados.includes(item);
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                style={[
                                                    styles.btthr,
                                                    horario === item && styles.btthractive,
                                                    estaOcupado && styles.btthrocupado,
                                                ]}
                                                onPress={() => !estaOcupado && setHorario(item)}
                                                disabled={estaOcupado}
                                            >
                                                <Text style={styles.buttonText}>{item}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                        </>
                    ) : step === 3 ? (
                        <>
                            <Text style={styles.txtservicos}>NÚMERO DE TELEFONE</Text>
                            <MaskInput
                                value={telefone}
                                onChangeText={(masked, unmasked) => {
                                    setTelefone(unmasked);
                                }}
                                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                keyboardType="numeric"
                                placeholder="(99) 99999-9999"
                                style={styles.input}
                            />
                        </>
                    ) : null}

                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        {step > 1 && (
                            <TouchableOpacity style={styles.button} onPress={() => setStep(step - 1)}>
                                <Text style={styles.buttonText}>VOLTAR</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={
                                step < 3
                                    ? () => {
                                        if ((step === 1 && service === '') || (step === 2 && (!date || !horario)))
                                            return alert('Selecione antes de prosseguir');
                                        setStep(step + 1);
                                    }
                                    : marcar
                            }
                        >
                            <Text style={styles.buttonText}>{step < 3 ? 'PRÓXIMO PASSO' : 'AGENDAR'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    myservices ?
                        <View style={styles.myagenda} >
                            <Text style={styles.txtservicos}>MEUS AGENDAMENTOS</Text>
                            {myservices.map((item, index) => (
                                <View style={styles.myagenda1} key={index}>
                                    <Text style={styles.txttipo}>{item.servico.toUpperCase()}</Text>
                                    <Text style={styles.txtagenda}>DATA: {item.data}</Text>
                                    <Text style={styles.txtagenda}>PREÇO: R${item.preco}</Text>
                                    <TouchableOpacity style={styles.buttonCancel} onPress={() => desmarcar(item.data, item.id_cliente)}>
                                        <Text style={styles.buttonText}>DESMARCAR</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        :
                        <View style={styles.myagenda}>
                            <Text style={styles.txtservicos}>VOCÊ NÃO TEM AGENDAMENTOS</Text>
                        </View>
                }

            </View>
            <StatusBar style='auto' />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#5d5d5d',
        width: '100%',
        minHeight: '100%',
        paddingHorizontal: 30,
        paddingVertical: 70,
        gap: 30,
        flex: 1,
    },
    btts: {
        flexDirection: 'row',
        gap: 5,
    },
    servicos: {
        backgroundColor: 'white',
        paddingVertical: 22,
        paddingHorizontal: 13,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        borderRadius: 10,
    },
    txtservicos: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 44,
        textAlign: 'center',
    },
    txttipo: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 38,
        textAlign: 'center',
    },
    txtservicos2: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0170b9',
        paddingVertical: 7,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'BigShoulders_400Regular',
    },
    option: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: '70%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    img: {
        width: 100,
        height: 100,
    },
    select: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: '70%',
        borderRadius: 10,
        borderColor: '#0170b9',
        borderWidth: 3,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 9,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'BigShoulders_400Regular',
        borderColor: 'black',
        borderWidth: 1,
    },
    hrs: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
    },
    btthractive: {
        backgroundColor: '#0170b9',
        padding: 10,
        borderRadius: 5,
    },
    btthr: {
        backgroundColor: '#A0AEC0',
        padding: 10,
        borderRadius: 5,
    },
    btthrocupado: {
        backgroundColor: '#F56565',
    },
    txtOcupado: {
        color: '#fff',
        fontWeight: 'bold',
    },
    calendar: {
        width: 320,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 6,
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
    dis: {
        backgroundColor: '#e7e7e7',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: '70%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
});