import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';

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
            <Text style={styles.logo}>{user?.name}</Text>
            <Text style={styles.logo2}>{user?.email}</Text>
            {signed ?
                <>
                    <TouchableOpacity style={styles.loginBtn} onPress={navigateToMyInformations}>
                        <Text style={styles.text}>Minhas Informações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginBtn} onPress={navigateToMyRaffles}>
                        <Text style={styles.text}>Minhas Rifas</Text>
                    </TouchableOpacity>
                </>
                :
                <>
                    <TouchableOpacity style={styles.loginBtn} onPress={navigateToHome}>
                        <Text style={styles.text}>Entrar</Text>
                    </TouchableOpacity>
                </>
            }
            <TouchableOpacity style={styles.loginBtn} onPress={navigateToTermsConditions}>
                <Text style={styles.text}>Termos e Condições</Text>
            </TouchableOpacity>
            {signed ?
                <TouchableOpacity style={styles.loginBtn} onPress={handleLogout}>
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
        backgroundColor: '#003f5c',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        fontWeight: 'bold',
        fontSize: 50,
        color: '#fb5b5a',
        marginBottom: 40
    },

    logo2: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fb5b5a',
        marginBottom: 40
    },

    text: {
        color: 'white',
        fontSize: 11
    },

    loginBtn: {
        width: '80%',
        backgroundColor: '#fb5b5a',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10
    },
});

export default User;
