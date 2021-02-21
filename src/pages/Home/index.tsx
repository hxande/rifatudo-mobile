import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';

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
            <Text style={styles.logo}>rifaTUDO</Text>
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
        backgroundColor: '#003f5c',
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
        backgroundColor: "#465881",
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
        fontSize: 11
    },

    loginBtn: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
});

export default Home;
