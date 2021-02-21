import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native';
import api from '../../services/api';
import { cpfMask } from '../../utils/cpfMask';

interface IAndroidEvent {
    type: string;
    nativeEvent: {
        //   timestamp?: number;
    };
};

const Register = () => {
    const navigation = useNavigation();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [sobrenome, setSobrenome] = useState<string>('');
    const [dataNascimento, setDataNascimento] = useState<Date>(new Date());
    const [sexo, setSexo] = useState<string>('0');
    const [cpf, setCpf] = useState<string>('');

    const [fieldMessage, setFieldMessage] = useState<string>('');

    const animation = new Animated.Value(0);
    const interpolated = animation.interpolate({
        inputRange: [0, .5, 1, 1.5, 2, 2.5, 3],
        outputRange: [0, -15, 0, 15, 0, -15, 0],
    });

    function getAnimationStyle() {
        return {
            transform: [
                { translateX: interpolated }
            ]
        }
    }

    function triggerAnimation() {
        animation.setValue(0);
        Animated.timing(animation, {
            duration: 400,
            toValue: 3,
            useNativeDriver: true,
        }).start();
    }

    useEffect(() => {
        setEmail(username);
    }, [username]);

    function validateEmail(text: string) {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            if (text.length === 0) {
                setFieldMessage('');
            } else {
                setFieldMessage('E-mail inválido');
            }
        }
        else {
            setFieldMessage('');
        }
        setUsername(text);
    }

    const onChangeCPF = (text: string) => {
        const maskedCpf = text;
        setCpf(cpfMask(maskedCpf));
    };

    const onChangeDate = (event: IAndroidEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || dataNascimento;
        setDataNascimento(currentDate);
    };

    async function handleRegisterUser() {
        const data = {
            data: {
                username,
                password,
                email,
                nome,
                sobrenome,
                dataNascimento,
                sexo,
                cpf
            }
        };

        try {
            const response = await api.post('/users', data);
            if (response.status === 200) {
                Alert.alert('Usuário cadastrado com sucesso!!!');
                navigation.navigate('Home');
            }
        } catch (error) {
            console.log('REGISTER PAGE -> ', error);
            if (error.response.status === 422) {
                Alert.alert('Oops! Usuário já cadastrado!');
            }
        }
    }

    return (
        <View style={styles.container}>
            <TextInput editable={false} style={styles.header}>Registrar</TextInput>
            <Animated.View style={[getAnimationStyle(), { alignSelf: 'stretch' }]}>
                <TextInput
                    textContentType='emailAddress'
                    style={styles.inputText}
                    placeholder='E-mail'
                    placeholderTextColor='#fff'
                    value={username}
                    onChangeText={validateEmail}
                    autoCorrect={false}
                />
            </Animated.View>
            {fieldMessage.length > 0 ? <Text style={styles.validateText}>{fieldMessage}</Text> : <></>}
            <TextInput
                textContentType='givenName'
                style={styles.inputText}
                placeholder='Nome'
                placeholderTextColor='#fff'
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                textContentType='familyName'
                style={styles.inputText}
                placeholder='Sobrenome'
                placeholderTextColor='#fff'
                value={sobrenome}
                onChangeText={setSobrenome}
            />
            <TextInput
                style={styles.inputText}
                placeholder='CPF'
                placeholderTextColor='#fff'
                value={cpf}
                onChangeText={onChangeCPF}
            />
            <Text style={styles.dateTitleText}>Data de nascimento</Text>
            <DateTimePicker
                style={{ width: 165, backgroundColor: '#fff' }}
                testID='dateTimePicker'
                value={dataNascimento}
                mode={'date'}
                is24Hour={true}
                display='default'
                onChange={onChangeDate}
                locale='pt-BR'
            />
            <TextInput
                style={{
                    marginBottom: 30,
                    color: '#fff',
                    borderBottomColor: '#f8f8f8',
                    borderBottomWidth: 1,
                    alignSelf: 'stretch',
                }}
                editable={false}
            />
            <Picker
                style={{ height: 50, width: Dimensions.get('window').width, marginBottom: 20 }}
                itemStyle={{ height: 50, width: Dimensions.get('window').width }}
                selectedValue={sexo}
                onValueChange={(value, index) => {
                    setSexo(String(value));
                }}>
                <Picker.Item label='Masculino' color='white' value='0' />
                <Picker.Item label='Feminino' color='white' value='1' />
                <Picker.Item label='Outro' color='white' value='2' />
            </Picker>
            <TextInput
                textContentType='password'
                style={styles.inputText}
                secureTextEntry
                placeholder='Sua senha'
                placeholderTextColor='#fff'
                value={password}
                onChangeText={setPassword}
            />
            {
                fieldMessage.length > 0 ?
                    <TouchableOpacity style={styles.registerBtn} onPress={triggerAnimation}>
                        <Text style={styles.text}>REGISTRAR</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterUser}>
                        <Text style={styles.text}>REGISTRAR</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 60,
        transform: [{ translateX: 0 }]
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

    dateTitleText: {
        height: 40,
        color: '#fff',
        alignSelf: 'stretch',
    },

    text: {
        color: "white",
        fontSize: 11
    },

    validateText: {
        color: '#fb5b5a',
    },

    registerBtn: {
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

export default Register;
