import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Home } from './components/Home/Home';
import { Servicos } from './components/nossos_servicos/Servicos';
export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Home />
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
