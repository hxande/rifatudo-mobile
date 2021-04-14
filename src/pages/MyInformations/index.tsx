import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import AuthContext from '../../contexts/auth';
import IUser from '../../models/User';
import api from '../../services/api';

const MyInformations = () => {
    const { user, sair } = useContext(AuthContext);

    const [myInformation, setMyInformation] = useState<IUser>({} as IUser);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        async function getUser() {
            const myInfos: IUser = {} as IUser;
            const response = await api.get(`/users/${user!.id}`);
            console.warn(response.data);
            myInfos.id = response.data[0].id;
            myInfos.cpf = response.data[0].cpf;
            myInfos.birth = response.data[0].birth;
            myInfos.email = response.data[0].email;
            myInfos.first_name = response.data[0].first_name;
            myInfos.sex = response.data[0].sex;
            myInfos.surname = response.data[0].surname;
            myInfos.username = response.data[0].username;
            setMyInformation(myInfos);
            setEmail(response.data[0].email);
        }

        getUser();
    }, []);

    async function handleChangeInfo() {
    }

    return (
        <View style={styles.container}>
            <TextInput editable={false} style={styles.header}>Minhas Informações</TextInput>
            <TextInput
                textContentType='emailAddress'
                style={styles.inputText}
                placeholder='E-mail'
                placeholderTextColor='#fff'
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
            />
            <TextInput
                textContentType='password'
                style={styles.inputText}
                secureTextEntry
                placeholder='Sua senha'
                placeholderTextColor='#fff'
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangeInfo}>
                <Text style={styles.text}>SALVAR</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003f5c',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 60,
    },

    header: {
        fontSize: 24,
        color: '#fff',
        paddingBottom: 10,
        marginBottom: 40,
        borderBottomColor: '#fb5b5a',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
    },

    inputText: {
        height: 40,
        marginBottom: 30,
        color: '#fff',
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
    },

    text: {
        color: "white",
        fontSize: 11
    },

    button: {
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

export default MyInformations;
