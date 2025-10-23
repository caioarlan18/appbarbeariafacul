import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Hero from './Hero';
import Servicos from './Servicos';
export default function Index() {
    return (
        <ScrollView style={styles.container}>
            <Hero />
            <Servicos />
            <StatusBar style="auto" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
