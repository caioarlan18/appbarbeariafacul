import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export function Home() {
    return (
        <ImageBackground
            source={require('../../images/bghome.png')}
            style={styles.imgbackground}
            resizeMode="cover"
        >
            <Image source={require('../../images/logo.svg')} style={styles.logo} />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imgbackground: {
        flex: 1,
        height: "100vh",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: "100%",
        height: "100%"
    }

});