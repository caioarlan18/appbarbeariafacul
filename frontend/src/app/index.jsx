import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Hero from './Hero';
import Servicos from './Servicos';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Index() {
    const [token, setToken] = useState("");
    const [cargo, setCargo] = useState("");
    useEffect(() => {
        async function carregarToken() {
            setToken(await AsyncStorage.getItem("token"));
            setCargo(await AsyncStorage.getItem("cargo"));
        }
        carregarToken();

    }, [])
    return (
        <View style={styles.container}>
            {cargo !== "admin" ?
                <ScrollView >
                    <View style={styles.container2}>
                        <Hero />
                        <Servicos />
                        <StatusBar style="auto" />
                    </View>
                </ScrollView>
                : <View style={styles.container2}>
                    <Hero />
                    <StatusBar style="auto" />
                </View>

            }
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container2: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
