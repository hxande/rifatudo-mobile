import React, { useState, useEffect, useContext } from 'react';
import { Image, View, Text, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { Picker } from '@react-native-community/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import IRaffle from '../../models/Raffle';
import ICategory from '../../models/Category';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface IRaffleMail extends IRaffle {
    mail?: string;
}

const NewRaffle = () => {
    const navigation = useNavigation();
    const { signed, user, logar } = useContext(AuthContext);

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('0');

    const [categories, setCategories] = useState<ICategory[]>([]);

    const [image1, setImage1] = useState<string>(String(null));
    const [image2, setImage2] = useState<string>(String(null));
    const [image3, setImage3] = useState<string>(String(null));

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState(1);
    const [qtt, setQtt] = useState(0);
    const [qttF, setQttF] = useState(0);
    const [qttM, setQttM] = useState(0);
    const [qttWinners, setQttWinners] = useState(0);
    const [qttDays, setQttDays] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') {
            setSelectedCity('0');
            setCities([]);
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cities = response.data.map(city => city.nome);
            setCities(cities);
        });
    }, [selectedUf]);

    useEffect(() => {
        async function loadCategories() {
            await api.get('/categories').then(response => {
                setCategories(response.data);
            });
        }
        loadCategories();
    }, []);

    useEffect(() => {
        async function pickPhoto() {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Oops... Precisamos de sua permissão para acessar suas fotos');
                return;
            }
        }

        pickPhoto();
    }, []);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // base64: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            if (image1 === String(null)) {
                setImage1(result.uri);
            } else if (image1 !== String(null) && image2 === String(null)) {
                setImage2(result.uri);
            } else if (image2 !== String(null) && image3 === String(null)) {
                setImage3(result.uri);
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            Alert.alert('Favor preencher corretamente TODOS os campos!');
            return;
        }

        const data: IRaffleMail = {
            mail: user!.email,
            id_user: user!.id,
            title: title,
            description: desc,
            id_category: category,
            uf: selectedUf,
            city: selectedCity,
            status: 0,
            value: price,
            qtt: qtt,
            qtt_free: qttF,
            qtt_min: qttM,
            qtt_winners: qttWinners,
            duration: qttDays
        };

        await api.post('raffles', data).then(async response => {
            if (response.status === 200) {
                await uploadToServer(response.data.rows[0].id, 1, image1);
                if (image2 !== String(null)) {
                    await uploadToServer(response.data.rows[0].id, 2, image2);
                }
                if (image3 !== String(null)) {
                    await uploadToServer(response.data.rows[0].id, 3, image3);
                }
                Alert.alert('Rifa criada com sucesso!!!');
                resetFields();
                navigation.navigate('Inicio');
            }
        });
    };

    const uploadToServer = async (id: number, num: number, sourceUrl: string) => {
        const filename = sourceUrl.split('/').pop();
        const match = /\.(\w+)$/.exec(String(filename));
        const type = match ? `image/${match[1]}` : `image`;

        const data = new FormData();
        data.append('name', 'avatar');
        data.append('image', {
            uri: sourceUrl,
            type,
            name: filename
        });
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        };

        fetch(`http://18.214.1.138:3333/raffles/${id}/images/${num}`, config)
            .then((checkStatusAndGetJSONResponse) => {
                console.log(checkStatusAndGetJSONResponse);
            })
            .catch((err) => { console.log(err) });
    };

    const validateFields = () => {
        if (
            image1 !== String(null) &&
            title !== '' &&
            desc !== '' &&
            // qtt !== 0 &&
            // qttF !== 0 &&
            // qttM !== 0 &&
            // qttWinners !== 0 &&
            // price !== 0 &&
            // qttDays !== 0 &&
            selectedUf !== '0' &&
            selectedCity !== '0') {
            if (
                qtt < 0 ||
                qttF < 0 ||
                qttM < 0 ||
                // qttWinners < 0 ||
                price < 0 ||
                price > 1000 ||
                qttDays < 0
            ) {
                return false;
            } else {
                return true;
            }
        }
        else {
            return false;
        }
    };

    const resetFields = () => {
        setImage1(String(null));
        setImage2(String(null));
        setImage3(String(null));
        setTitle('');
        setDesc('');
        setCategory(1);
        setQtt(0);
        setQttF(0);
        setQttM(0);
        setQttWinners(0);
        setPrice(0);
        setQttDays(0);
        setSelectedUf('0');
        setSelectedCity('0');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}}>
                    <View style={styles.imageContainer}>
                        <RectButton style={styles.imagePicker} onPress={handlePickImage}>
                            <Text style={styles.imageText}>Selecione imagens do rolo de câmera</Text>
                        </RectButton>
                        <ScrollView horizontal showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
                            {image1 !== String(null)
                                ? <Image source={{ uri: image1 }} style={styles.image} />
                                : <View style={styles.imageFake}><Text style={{ fontSize: 16, color: '#380744' }}>Imagem</Text></View>
                            }

                            {image2 !== String(null)
                                ? <Image source={{ uri: image2 }} style={styles.image} />
                                : <View style={styles.imageFake}><Text style={{ fontSize: 16, color: '#380744' }}>Imagem</Text></View>
                            }

                            {image3 !== String(null)
                                ? <Image source={{ uri: image3 }} style={styles.image} />
                                : <View style={styles.imageFake}><Text style={{ fontSize: 16, color: '#380744' }}>Imagem</Text></View>
                            }
                        </ScrollView>
                    </View>

                    <View style={styles.footer}>
                        <Text>Estado (UF)</Text>
                        <Picker
                            itemStyle={{ height: 70, width: '100%' }}
                            selectedValue={selectedUf}
                            onValueChange={(value, index) => {
                                setSelectedUf(String(value));
                            }}>
                            <Picker.Item key={'0'} label='Selecione uma UF' value={'0'} />
                            {
                                ufs.map(uf => (
                                    <Picker.Item key={uf} label={uf} value={uf} />
                                ))
                            }
                        </Picker>

                        <Text>Cidade</Text>
                        <Picker
                            itemStyle={{ height: 70, width: '100%' }}
                            selectedValue={selectedCity}
                            onValueChange={(value, index) => {
                                setSelectedCity(String(value));
                            }}>
                            <Picker.Item key={'0'} label='Selecione uma Cidade' value={'0'} />
                            {
                                cities.map(city => (
                                    <Picker.Item key={city} label={city} value={city} />
                                ))
                            }
                        </Picker>

                        <Text>Título</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Título'
                            value={title}
                            onChangeText={text => setTitle(text)}
                            autoCapitalize='characters'
                            autoCorrect={false}
                        />

                        <Text>Descrição</Text>
                        <TextInput
                            style={[styles.input, { height: 200 }]}
                            multiline={true}
                            placeholder='Descrição'
                            value={desc}
                            onChangeText={text => setDesc(text)}
                            autoCorrect={false}
                        />

                        <Text>Categoria</Text>
                        <Picker
                            itemStyle={{ height: 70, width: '100%' }}
                            selectedValue={category}
                            onValueChange={(value, index) => {
                                setCategory(+value);
                            }}>
                            {
                                categories.map(category => (
                                    <Picker.Item key={category.id} label={category.description} value={category.id!} />
                                ))
                            }
                        </Picker>

                        <Text>Quantidade de Rifas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Quantidade'
                            value={String(qtt)}
                            onChangeText={text => setQtt(+text)}
                            autoCorrect={false}
                            keyboardType='numeric'
                        />

                        <Text>Quantidade de Rifas Gratúitas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Quantidade'
                            value={String(qttF)}
                            onChangeText={text => setQttF(+text)}
                            autoCorrect={false}
                            keyboardType='numeric'
                        />

                        <Text>Quantidade Mínima de Rifas a ser Vendidas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Quantidade'
                            value={String(qttM)}
                            onChangeText={text => setQttM(+text)}
                            autoCorrect={false}
                            keyboardType='numeric'
                        />

                        {/* <Text>Quantidade de Ganhadores</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Quantidade'
                            value={String(qttWinners)}
                            onChangeText={text => setQttWinners(text)}
                            autoCorrect={false}
                        /> */}

                        <Text>Valor (máx. R$1000,00)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Valor'
                            value={String(price)}
                            onChangeText={text => setPrice(+text)}
                            autoCorrect={false}
                            keyboardType='numeric'
                        />

                        <Text>Duração em Dias</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Quantidade de dias'
                            value={String(qttDays)}
                            onChangeText={text => setQttDays(+text)}
                            autoCorrect={false}
                            keyboardType='numeric'
                        />

                        <RectButton style={styles.button} onPress={() => handleSubmit()}>
                            <View style={styles.buttonIcon}>
                                <Text>
                                    <Icon name='arrow-right' color='#FFF' size={24} />
                                </Text>
                            </View>
                            <Text style={styles.buttonText}>
                                Rifar
                            </Text>
                        </RectButton>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    main: {
        flex: 1,
    },

    imageFake: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
        margin: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'dashed',
        borderColor: '#380744',
    },

    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    imagePicker: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#380744',
        padding: 15,
        overflow: 'hidden',
    },

    imageText: {
        textAlign: 'center',
        fontFamily: 'Roboto_500Medium',
        fontSize: 18,
        color: 'rgb(187,112,25)'
    },

    image: {
        width: 200,
        height: 200,
        margin: 15
    },

    footer: {
        marginHorizontal: 10,
    },

    input: {
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#380744',
        height: 40,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },

    buttonIcon: {
        paddingLeft: 10,
        height: 40,
        width: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        textAlign: 'center',
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default NewRaffle;