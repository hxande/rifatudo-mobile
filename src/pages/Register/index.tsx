import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Animated, SafeAreaView, ScrollView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-community/picker';
import { Dimensions } from 'react-native';
import api from '../../services/api';
import { cpfMask } from '../../utils/cpfMask';

import logo from '../../../assets/splash.png';

interface IAndroidEvent {
    type: string;
    nativeEvent: {
        //   timestamp?: number;
    };
};

const Register = () => {
    const navigation = useNavigation();

    const [username, setUsername] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [first_name, setFirst_name] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [birth, setBirth] = useState<Date>(new Date());
    const [sex, setSex] = useState<string>('0');
    const [cpf, setCpf] = useState<string>('');

    const [fieldMessage, setFieldMessage] = useState<string>('');
    const [show, setShow] = useState(false);

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
        setUsername(text.toUpperCase());
    }

    const onChangeCPF = (text: string) => {
        const maskedCpf = text;
        setCpf(cpfMask(maskedCpf));
    };

    const onChangeDate = (event: IAndroidEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || birth;
        setShow(Platform.OS === 'ios');
        setBirth(currentDate);
    };

    async function handleRegisterUser() {
        const data = {
            username,
            pass,
            email,
            first_name,
            surname,
            birth,
            sex,
            cpf
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.formView}>
                <Image
                    style={styles.tinyLogo}
                    source={logo}
                />

                <TextInput editable={false} style={styles.header}>Cadastrar</TextInput>
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
                    value={first_name}
                    onChangeText={setFirst_name}
                />
                <TextInput
                    textContentType='familyName'
                    style={styles.inputText}
                    placeholder='Sobrenome'
                    placeholderTextColor='#fff'
                    value={surname}
                    onChangeText={setSurname}
                />
                <TextInput
                    style={styles.inputText}
                    placeholder='CPF'
                    placeholderTextColor='#fff'
                    value={cpf}
                    onChangeText={onChangeCPF}
                />
                <Text style={styles.dateTitleText}>Data de nascimento</Text>
                {
                    (show || Platform.OS === 'ios') && (
                        <DateTimePicker
                            style={[Platform.OS === 'ios' ? { height: 100 } : {}, { width: Dimensions.get('window').width - 40, backgroundColor: '#fff' }]}
                            testID='dateTimePicker'
                            value={birth}
                            mode={'date'}
                            is24Hour={true}
                            display='default'
                            onChange={onChangeDate}
                            locale='pt-BR'
                        />
                    )
                }
                {
                    Platform.OS === 'android' && (
                        <TouchableOpacity onPress={() => setShow(true)}>
                            <Text style={{ color: '#fff' }}>{new Date(birth).toLocaleDateString('pt-BR')}</Text>
                        </TouchableOpacity>
                    )
                }
                <TextInput
                    style={styles.line}
                    editable={false}
                />
                <Picker
                    style={[Platform.OS === 'android' ? { width: 200 } : { width: Dimensions.get('window').width }, { color: '#fff', height: 50, marginBottom: 20 }]}
                    itemStyle={{ height: 50, width: Dimensions.get('window').width }}
                    selectedValue={sex}
                    onValueChange={(value, index) => {
                        setSex(String(value));
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
                    value={pass}
                    onChangeText={setPass}
                />
            </ScrollView>
            {
                fieldMessage.length > 0 ?
                    <TouchableOpacity style={styles.registerButton} onPress={triggerAnimation}>
                        <Text style={styles.text}>REGISTRAR</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegisterUser}>
                        <Text style={styles.text}>REGISTRAR</Text>
                    </TouchableOpacity>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#380744',
    },

    formView: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 120,
        // transform: [{ translateX: 0 }]
    },

    tinyLogo: {
        width: '50%',
        height: '20%',
        marginBottom: 10,
        marginTop: 20,
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

    validateText: {
        color: '#fb5b5a',
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

    line: {
        marginBottom: 30,
        color: '#fff',
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
    },

    text: {
        color: 'white',
        fontSize: 16
    },

    registerButton: {
        backgroundColor: 'rgb(187,112,25)',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginHorizontal: 20,
        marginBottom: 20
    },
});

export default Register;
