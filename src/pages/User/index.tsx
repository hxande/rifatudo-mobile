import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';

import logo from '../../../assets/splash.png';

const User = () => {
    const { user, sair, signed } = useContext(AuthContext);
    const navigation = useNavigation();

    function navigateToMyInformations() {
        navigation.navigate('MinhasInformacoes');
    }

    function navigateToMyRaffles() {
        navigation.navigate('MinhasRifas');
    }

    function navigateToTermsConditions() {
        navigation.navigate('TermosCondicoes');
    }

    function navigateToHome() {
        navigation.navigate('Home');
    }

    function handleLogout() {
        sair();
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={logo}
            />
            <Text style={styles.logo}>{user?.name}</Text>
            <Text style={styles.logo2}>{user?.email}</Text>
            {/* <Text style={styles.logo}>Rafael Almeida</Text>
            <Text style={styles.logo2}>rafaelffa1@hotmail.com</Text> */}
            {signed ?
                <>
                    <TouchableOpacity style={styles.button} onPress={navigateToMyInformations}>
                        <Text style={styles.text}>Minhas Informações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={navigateToMyRaffles}>
                        <Text style={styles.text}>Minhas Rifas</Text>
                    </TouchableOpacity>
                </>
                :
                <>
                    <TouchableOpacity style={styles.button} onPress={navigateToHome}>
                        <Text style={styles.text}>Entrar</Text>
                    </TouchableOpacity>
                </>
            }
            <TouchableOpacity style={styles.button} onPress={navigateToTermsConditions}>
                <Text style={styles.text}>Termos e Condições</Text>
            </TouchableOpacity>
            {signed ?
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.text}>SAIR</Text>
                </TouchableOpacity>
                :
                <>
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#380744',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tinyLogo: {
        width: '50%',
        height: '20%',
        marginBottom: 10,
        marginTop: 20,
    },

    logo: {
        fontWeight: 'bold',
        fontSize: 36,
        color: 'rgb(187,112,25)',
        marginBottom: 7
    },

    logo2: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'rgb(187,130,45)',
        marginBottom: 40
    },

    text: {
        color: 'white',
        fontSize: 18
    },

    button: {
        width: '80%',
        backgroundColor: 'rgb(187,112,25)',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5
    },
});

export default User;
