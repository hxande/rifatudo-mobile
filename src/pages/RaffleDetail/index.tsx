import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Linking, Alert, Pressable, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import AuthContext from '../../contexts/auth';
import api from '../../services/api'

interface Params {
    raffle_id: number;
}

interface IRifa {
    ID: number;
    id_usuario: string;
    titulo: string;
    descricao: string;
    id_categoria: string;
    uf: string;
    cidade: string;
    status: string;
    valor: string;
    qtd_cotas: string;
    qtd_cotas_g: string;
    qtd_cotas_m: string;
    qtd_ganhadores: string;
    duracao: string;
}

interface IImagens {
    ID: number,
    id_rifa: number,
    num: number,
    conteudo: string,
    image_url: string
}

interface ICotas {
    ID: number;
    id_rifa: string;
    id_usuario: string;
    num: string;
    valor: string;
    status: string;
}

const RaffleDetail = () => {
    const { signed } = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const [rifa, setRifa] = useState<IRifa>({
        ID: 0,
        id_usuario: '',
        titulo: '',
        descricao: '',
        id_categoria: '',
        uf: '',
        cidade: '',
        status: '',
        valor: '',
        qtd_cotas: '',
        qtd_cotas_g: '',
        qtd_cotas_m: '',
        qtd_ganhadores: '',
        duracao: '',
    });
    const [imagens, setImagens] = useState<IImagens[]>([]);
    const [cotas, setCotas] = useState<ICotas[]>([{
        ID: 0,
        id_rifa: '',
        id_usuario: '',
        num: '',
        valor: '',
        status: '',
    }]);
    const [selectedCotas, setSelectedCotas] = useState<ICotas[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPaidCota, setSelectedPaidCota] = useState<ICotas>({} as ICotas);

    useEffect(() => {
        async function getRifa() {
            const response = await api.get(`/rifas/${routeParams.raffle_id}`);
            setRifa(response.data[0]);
        }

        async function getImagens() {
            const response = await api.get(`/rifas/${routeParams.raffle_id}/imagens`);
            setImagens(response.data);
        }

        async function getCotas() {
            const response = await api.get(`/rifas/${routeParams.raffle_id}/cotas`);
            setCotas(response.data);
        }

        getRifa();
        getImagens();
        getCotas();
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToCheckout() {
        if (signed) {
            navigation.navigate('Checkout', {
                cotas: selectedCotas
            });
        } else {
            Alert.alert('Favor logar antes');
        }
    }

    function handleComposeMail() {
        MailComposer.composeAsync({
            subject: 'Dúvida sobre o Produto',
            recipients: ['hugoslm@hotmail.com'],
        });
    }

    function handleWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=06192562759&text=Fala tu`);
    }

    function handleSelectCota(item: ICotas) {
        if (!signed) {
            return;
        }
        const alreadySelected = selectedCotas.findIndex(cota => cota.ID === item.ID);
        if (alreadySelected >= 0) {
            const filteredCotas = selectedCotas.filter(cota => cota.ID !== item.ID);
            setSelectedCotas(filteredCotas);
        } else {
            setSelectedCotas([...selectedCotas, item]);
        }
    }

    function handleShowBuyer(item: ICotas) {
        setModalVisible(true);
        setSelectedPaidCota(item);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Rifa Comprada</Text>
                        <Text style={styles.modalText}>Comprador: {selectedPaidCota.id_usuario}</Text>
                        <Text style={styles.modalText}>Número: {selectedPaidCota.num}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <ScrollView>
                <View style={styles.detailContainer}>
                    <TouchableOpacity onPress={handleNavigateBack}>
                        <Icon name='arrow-left' size={20} color='#fb5b5a' />
                    </TouchableOpacity>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            imagens.map((imagem, index) => {
                                return (
                                    <Image key={index} style={styles.image} source={{ uri: imagem.image_url }} />
                                )
                            })
                        }
                    </ScrollView>

                    <Text style={styles.raffleHeader}>#{rifa.ID} - {rifa.titulo}</Text>
                    <Text style={styles.raffleHeader}>R$ {rifa.valor}</Text>

                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Descrição</Text>
                        <Text style={styles.fieldContent}>{rifa.descricao}</Text>
                    </View>
                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Usuário</Text>
                        <Text style={styles.fieldContent}>{rifa.id_usuario}</Text>
                    </View>
                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Endereço</Text>
                        <Text style={styles.fieldContent}>{rifa.cidade}, {rifa.uf}</Text>
                    </View>
                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Rifas</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {cotas.map(cota => (
                                cota.status === '0'
                                    ?
                                    <TouchableOpacity
                                        key={cota.ID}
                                        style={[styles.item, selectedCotas.includes(cota) ? styles.selectedItem : {}]}
                                        onPress={() => handleSelectCota(cota)}
                                    >
                                        <View style={styles.numbers}>
                                            <Text style={{ color: '#fff' }}>{cota.num}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        key={cota.ID}
                                        style={styles.item}
                                        onPress={() => handleShowBuyer(cota)}
                                    >
                                        <View style={styles.selectedNumbers}>
                                            <Text style={{ color: '#fff' }}>{cota.num}</Text>
                                        </View>
                                    </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    {signed ?
                        <>
                            <View style={styles.subtitleContainer}>
                                <View style={styles.subtitleItemContainer}>
                                    <Text style={styles.subtitleItemText}>Disponível</Text>
                                    <View style={{ backgroundColor: 'gray', borderRadius: 10, height: 20, width: 20 }}></View>
                                </View>
                                <View style={styles.subtitleItemContainer}>
                                    <Text style={styles.subtitleItemText}>Comprada</Text>
                                    <View style={{ backgroundColor: 'red', borderRadius: 10, height: 20, width: 20 }}></View>
                                </View>
                                <View style={styles.subtitleItemContainer}>
                                    <Text style={styles.subtitleItemText}>Selecionada</Text>
                                    <View style={{ backgroundColor: 'green', borderRadius: 10, height: 20, width: 20 }}></View>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: 10 }}>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#fb5b5a' }}>Quantidade Total:</Text>
                                    <Text style={{ fontSize: 24, color: '#fb5b5a', fontWeight: 'bold' }}>{selectedCotas.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#fb5b5a' }}>Preço:</Text>
                                    <Text style={{ fontSize: 24, color: '#fb5b5a', fontWeight: 'bold' }}>
                                        R${
                                            selectedCotas.reduce((total, single) => total + +single.valor, 0).toFixed(2)
                                        }
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.buyButton} onPress={() => handleNavigateToCheckout()}>
                                <Text style={styles.buyButtonText}>Comprar</Text>
                            </TouchableOpacity>
                        </>
                        :
                        <>
                        </>
                    }
                </View>
                {/* {signed ?
                    <View style={styles.footer}>
                        <RectButton style={styles.button} onPress={handleWhatsapp}>
                            <FontAwesome name='whatsapp' size={20} color='#fff' />
                            <Text style={styles.buttonText}>Whatsapp</Text>
                        </RectButton>

                        <RectButton style={styles.button} onPress={handleComposeMail}>
                            <Icon name='mail' size={20} color='#fff' />
                            <Text style={styles.buttonText}>E-mail</Text>
                        </RectButton>
                    </View>
                    :
                    <>
                    </>
                } */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    detailContainer: {
        flex: 1,
        padding: 32,
        paddingTop: 20,
    },

    image: {
        width: 300,
        height: 300,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
        marginHorizontal: 24,
    },

    raffleHeader: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    filedContainer: {
        marginTop: 32,
    },

    fieldTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    fieldContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6c6c80',
    },

    item: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#eee',
    },

    selectedItem: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#34cb79',
    },

    numbers: {
        backgroundColor: 'gray',
        borderRadius: 15,
        height: 30,
        width: 30,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    subtitleContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 10,
    },

    subtitleItemContainer: {
        alignItems: 'center',
    },

    subtitleItemText: {
        fontSize: 16,
        marginBottom: 5
    },

    buyButton: {
        marginTop: 8,
        backgroundColor: '#fb5b5a',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },

    buyButtonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingBottom: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    button: {
        width: '48%',
        backgroundColor: '#34cb79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        marginLeft: 8,
        color: '#fff',
        fontFamily: 'Roboto_500Medium',
    },

    selectedNumbers: {
        backgroundColor: 'red',
        borderRadius: 15,
        height: 30,
        width: 30,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    buttonClose: {
        backgroundColor: '#2196F3',
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    modalText: {
        marginBottom: 15,
        textAlign: 'center'
    }
});

export default RaffleDetail;