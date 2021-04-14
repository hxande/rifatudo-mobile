import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Linking, Alert, Pressable, Modal, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome as Icon2 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import AuthContext from '../../contexts/auth';
import IRaffle from '../../models/Raffle';
import IQuota from '../../models/Quota';
import IImage from '../../models/Image';
import api from '../../services/api'

interface Params {
    raffle_id: number;
}

const RaffleDetail = () => {
    const { signed } = useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const [raffle, setRaffle] = useState<IRaffle>({} as IRaffle);
    const [images, setImages] = useState<IImage[]>([]);
    const [quotas, setQuotas] = useState<IQuota[]>([]);
    const [selectedQuotas, setSelectedQuotas] = useState<IQuota[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPaidQuota, setSelectedPaidQuota] = useState<IQuota>({} as IQuota);

    useEffect(() => {
        Linking.getInitialURL().then(url => {
            // console.warn(url);
        });
    }, []);

    useEffect(() => {
        async function getRaffle() {
            const response = await api.get(`/raffles/${routeParams.raffle_id}`);
            setRaffle(response.data[0]);
        }

        async function getImages() {
            const response = await api.get(`/raffles/${routeParams.raffle_id}/images`);
            setImages(response.data);
        }

        async function getQuotas() {
            const response = await api.get(`/raffles/${routeParams.raffle_id}/quotas`);
            setQuotas(response.data);
        }

        getRaffle();
        getImages();
        getQuotas();
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToCheckout() {
        if (signed) {
            navigation.navigate('Checkout', {
                raffle: raffle.id,
                quotas: selectedQuotas,
                owner: raffle.id_user,
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

    function handleSelectQuota(item: IQuota) {
        if (!signed) {
            return;
        }
        const alreadySelected = selectedQuotas.findIndex(quota => quota.id === item.id);
        if (alreadySelected >= 0) {
            const filteredCotas = selectedQuotas.filter(quota => quota.id !== item.id);
            setSelectedQuotas(filteredCotas);
        } else {
            setSelectedQuotas([...selectedQuotas, item]);
        }
    }

    function handleShowBuyer(item: IQuota) {
        setModalVisible(true);
        setSelectedPaidQuota(item);
    }

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

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
                        <Text style={styles.modalText}>Comprador: {selectedPaidQuota.id_user}</Text>
                        <Text style={styles.modalText}>Número: {selectedPaidQuota.num}</Text>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={handleNavigateBack}>
                            <Icon name='arrow-left' size={20} color='#fb5b5a' />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onShare}>
                            <Icon2 name='share-alt' size={20} color='#fb5b5a' />
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            images.map((image, index) => {
                                return (
                                    <Image key={index} style={styles.image} source={{ uri: image.file }} />
                                )
                            })
                        }
                    </ScrollView>

                    <Text style={styles.raffleHeader}>#{raffle.id} - {raffle.title}</Text>
                    <Text style={styles.raffleHeader}>R$ {raffle.value}</Text>

                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Descrição</Text>
                        <Text style={styles.fieldContent}>{raffle.description}</Text>
                    </View>
                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Usuário</Text>
                        <Text style={styles.fieldContent}>{raffle.id_user}</Text>
                    </View>
                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Endereço</Text>
                        <Text style={styles.fieldContent}>{raffle.city}, {raffle.uf}</Text>
                    </View>
                    <View style={styles.filedContainer}>
                        <Text style={styles.fieldTitle}>Rifas</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {quotas.map(quota => (
                                quota.status === 0
                                    ?
                                    <TouchableOpacity
                                        key={quota.id}
                                        style={[+quota.value === 0 ? { backgroundColor: 'gold' } : {}, styles.item, selectedQuotas.includes(quota) ? styles.selectedItem : {}]}
                                        onPress={() => handleSelectQuota(quota)}
                                    >
                                        <View style={styles.numbers}>
                                            <Text style={{ color: '#fff' }}>{quota.num}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        key={quota.id}
                                        style={styles.item}
                                        onPress={() => handleShowBuyer(quota)}
                                    >
                                        <View style={styles.selectedNumbers}>
                                            <Text style={{ color: '#fff' }}>{quota.num}</Text>
                                        </View>
                                    </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    {signed ?
                        <>
                            <View style={styles.subtitleContainer}>
                                <View style={styles.subtitleItemContainer}>
                                    <Text style={styles.subtitleItemText}>Grátis</Text>
                                    <View style={{ backgroundColor: 'gold', borderRadius: 10, height: 20, width: 20 }}></View>
                                </View>
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
                                    <Text style={{ fontSize: 24, color: '#fb5b5a', fontWeight: 'bold' }}>{selectedQuotas.length}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#fb5b5a' }}>Preço:</Text>
                                    <Text style={{ fontSize: 24, color: '#fb5b5a', fontWeight: 'bold' }}>
                                        R${
                                            selectedQuotas.reduce((total, single) => +total + +single.value, 0)
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