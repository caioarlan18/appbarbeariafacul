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
export default function Servicos() {
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
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>AGENDE AGORA</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.servicos}>
                <Text style={styles.txtservicos}>BARBA & BIGODE</Text>
                <Image
                    source={require('../../images/barba.png')}
                    style={styles.tesourinha}
                    resizeMode="contain"
                />
                <Text style={styles.txtservicos2}>APARAR MODELAR E TRATAR SUA BARBA COM EFICIENCIA</Text>
                <Text style={styles.price}>R$ 55,00</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>AGENDE AGORA</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.servicos}>
                <Text style={styles.txtservicos}>COMBO COMPLETO</Text>
                <Image
                    source={require('../../images/combo.png')}
                    style={styles.tesourinha}
                    resizeMode="contain"
                />
                <Text style={styles.txtservicos2}>CORTE & BARBA & ACABAMENTO COM PERFEIÇÃO</Text>
                <Text style={styles.price}>R$ 70,00</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>AGENDE AGORA</Text>
                </TouchableOpacity>
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

    },
    button: {
        backgroundColor: 'rgba(108, 106, 106, 1)',
        paddingVertical: 7,
        paddingHorizontal: 53,
        borderRadius: 10,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'BigShoulders_400Regular',
    },
})