import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';

const logo = require('../../../assets/splash.png')

const Home = () => {
    const { signed, user, logar } = useContext(AuthContext);
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin() {
        logar(username, password);
    }

    function handleRegister() {
        navigation.navigate('Registrar');
    }

    function handleVisit() {
        navigation.navigate('Visitar');
    }

    return (
        <View style={styles.container}>

            <Image
                style={styles.tinyLogo}
                source={logo}
            />

            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="E-mail..."
                    placeholderTextColor="#003f5c"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize='characters'
                    autoCorrect={false}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder='Senha...'
                    placeholderTextColor="#003f5c"
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity>
                <Text style={styles.text}>Esqueceu a Senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.text}>LOGIN</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={handleRegister}>
                    <Text style={[styles.text, { marginRight: 15 }]}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVisit}>
                    <Text style={[styles.text, { marginLeft: 15 }]}>Pular</Text>
                </TouchableOpacity>
            </View>
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

    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 40
    },

    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },

    inputText: {
        height: 50,
        color: "white"
    },

    text: {
        color: "white",
        fontSize: 16
    },

    loginBtn: {
        width: "80%",
        backgroundColor: "rgb(187,112,25)",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    tinyLogo: {
        width: '50%',
        height: '20%',
        marginBottom: 50,
    }
});

export default Home;
