import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import {
    useFonts,
    BigShoulders_400Regular,
    BigShoulders_700Bold,
} from '@expo-google-fonts/big-shoulders';
export function Servicos() {
    const [fontsLoaded] = useFonts({
        BigShoulders_400Regular,
        BigShoulders_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <View style={styles.servicos}>
                <Text style={styles.txtservicos}>NOSSOS SERVIÇOS</Text>
                <Text style={styles.txtservicos2}>OFERECEMOS UMA EXPERIENCIA COMPLETA COM PROFISSIONAIS QUALIFICADOS</Text>
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
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#5d5d5d",
        width: "100%",
        height: "100%",
        padding: 40,
        gap: 30
    },
    servicos: {
        backgroundColor: "white",
        paddingVertical: 22,
        paddingHorizontal: 13,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10
    },
    txtservicos: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 44
    },
    txtservicos2: {
        fontFamily: 'BigShoulders_400Regular',
        fontSize: 16,
        textAlign: "center"
    },
    price: {
        fontFamily: 'BigShoulders_700Bold',
        fontSize: 31,

    }
})