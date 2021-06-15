import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Dimensions, Image, Clipboard } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker';
// import Clipboard from '@react-native-community/clipboard';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../../contexts/auth';
import IRaffle from '../../models/Raffle';
import IQuota from '../../models/Quota';
import api from '../../services/api'

interface Params {
    raffle: number;
    quotas: IQuota[];
    owner: number;
}

interface IPaymentDTO {
    user: number | undefined;
    raffle: number;
    quotas: string;
    method: number;
    value: number;
}

const Checkout = () => {
    const navigation = useNavigation();
    const { signed, user, logar } = useContext(AuthContext);
    const route = useRoute();
    const routeParams = route.params as Params;

    const [raffle, setRaffle] = useState<IRaffle>({} as IRaffle);
    const [quotas, setQuotas] = useState<IQuota[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [paymentMeth, setPaymentMeth] = useState<string>('0');
    const [image, setImage] = useState<string>(String(null));

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

    useEffect(() => {
        async function getRaffle() {
            setQuotas(routeParams.quotas);
            const response = await api.get(`/raffles/${routeParams.raffle}`);
            setRaffle(response.data[0]);
        }

        getRaffle();
        setTotal(routeParams.quotas.reduce((total, single) => +total + +single.value, 0));
    }, []);

    const handlePickImage = async () => {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // base64: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!response.cancelled) {
            setImage(response.uri);
        }
    };

    function handleNavigateBack() {
        navigation.goBack();
    }

    async function handleNavigateToPayment() {
        if (paymentMeth === '1') {
            const totalToPay = calculatePrice();
            navigation.navigate('Pagamento', {
                raffle: routeParams.raffle,
                total: totalToPay,
                quotas,
                owner: routeParams.owner,
            });
        }

        if (paymentMeth === '2') {
            if (image === String(null)) {
                Alert.alert('Favor selecionar um comprovante');
            } else {
                const data = createDTO();
                try {
                    await uploadToServer(raffle.id!, data.quotas, image);
                    const response = await api.post('/payments/pay/pending', data);
                    if (response.status === 200) {
                        Alert.alert('Comprovante enviado! Aguarde confirmação do recebimento');
                        navigation.navigate('Rifa');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    function calculatePrice() {
        // + (quotas.length * 0.25)
        return total;
    }

    function createDTO() {
        const toStringfy: string[] = [];
        quotas.forEach(quota => {
            toStringfy.push(String(quota.num));
        });
        const dto = {} as IPaymentDTO;
        dto.user = user!.id;
        dto.raffle = routeParams.raffle;
        dto.quotas = toStringfy.join(',');
        dto.method = 2;
        dto.value = calculatePrice();
        return dto;
    }

    function handleCopyPix() {
        Clipboard.setString('44b647fd-c630-43dc-a7ab-b77fda977870');
        Alert.alert('Copiado!');
    }

    const uploadToServer = async (id: number, quotasBuyed: string, sourceUrl: string) => {
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

        fetch(`https://rifatudo-backend.herokuapp.com/raffles/${id}/quotas/${quotasBuyed}/receipt`, config)
            .then((checkStatusAndGetJSONResponse) => {
                console.log(checkStatusAndGetJSONResponse);
            })
            .catch((err) => { console.log(err) });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.detailContainer}>
                    <TouchableOpacity onPress={handleNavigateBack}>
                        <Icon name='arrow-left' size={20} color='#380744' />
                    </TouchableOpacity>
                    <Text style={styles.selectedItemstitle}>Números Selecionados</Text>
                    <View style={styles.selectedItemsContainer}>
                        {quotas.map(quota => (
                            <Text style={styles.selectedItems} key={quota.id}>{quota.num}</Text>
                        ))}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.fieldTitle}>Rifa - #{routeParams.raffle}</Text>
                        <Text style={styles.fieldContent}>{raffle.description}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.fieldTitle}>Rifador</Text>
                        <Text style={styles.fieldContent}>{raffle.id_user}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.fieldTitle}>Localização</Text>
                        <Text style={styles.fieldContent}>{raffle.city}, {raffle.uf}</Text>
                    </View>
                    <View style={[styles.field, { marginBottom: 5 }]}>
                        <Text style={styles.fieldTitle}>Informações para Pagamento</Text>
                    </View>
                    <View style={styles.paymentInfoContainer}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Quantidade de números:</Text>
                                <Text style={styles.paymentItem}>{quotas.length}</Text>
                            </View>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Valor Unitário:</Text>
                                <Text style={styles.paymentItem}>{(+cotas[0].valor).toFixed(2)}</Text>
                            </View> */}
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Taxa Operacional:</Text>
                                <Text style={styles.paymentItem}>{quotas.length * 0.25}</Text>
                            </View> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Valor Total:</Text>
                                <Text style={styles.paymentItem}>{total + (quotas.length * 0.25)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.field}>
                        <Text style={[styles.fieldTitle, { textAlign: 'center' }]}>Meio de Pagamento</Text>
                        <Picker
                            itemStyle={{ height: 50, width: Dimensions.get('window').width - 64 }}
                            selectedValue={paymentMeth}
                            style={{ height: 50, width: 100 }}
                            onValueChange={(value, index) => {
                                setPaymentMeth(String(value));
                            }}>
                            <Picker.Item label='Selecione' value='0' />
                            <Picker.Item label="Mercado  Pago" value='1' />
                            <Picker.Item label='PIX' value='2' />
                        </Picker>
                    </View>
                    {
                        paymentMeth === '2' ?
                            <>
                                <View style={styles.pixContainer}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                        <Text style={styles.pixInfo}>Chave PIX:</Text>
                                        <Text style={styles.pixInfo}>32918736kjhsgch2892489720</Text>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', marginRight: 10 }} onPress={handleCopyPix}>
                                            <Icon name='copy' size={20} color='#380744' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.imageContainer}>
                                    <RectButton style={styles.imagePicker} onPress={handlePickImage}>
                                        <Text style={styles.imageText}>Selecione o comprovante</Text>
                                    </RectButton>
                                    {image !== String(null)
                                        ? <Image source={{ uri: image }} style={styles.image} />
                                        : <View style={styles.imageFake}><Text style={{ fontSize: 16, color: '#380744' }}>Imagem</Text></View>
                                    }
                                </View>
                            </>
                            :
                            <>
                            </>
                    }
                    <View style={{ marginTop: 10 }}>
                        <TouchableOpacity style={styles.buyButton} onPress={() => handleNavigateToPayment()}>
                            <Text style={styles.buyButtonText}>Pagar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0ebeb',
    },

    detailContainer: {
        flex: 1,
        padding: 32,
        paddingTop: 20,
    },

    selectedItemstitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        color: 'rgb(187,112,25)',
    },

    selectedItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    selectedItems: {
        fontSize: 16,
        marginHorizontal: 5,
    },

    paymentInfoContainer: {
        backgroundColor: '#fff',
        width: Dimensions.get('window').width - 64,
        borderRadius: 10
    },

    paymentItem: {
        padding: 8
    },

    field: {
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

    buyButton: {
        marginTop: 8,
        backgroundColor: '#380744',
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
        color: 'rgb(187,112,25)',
        fontFamily: 'Roboto_500Medium',
        fontSize: 24,
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
        marginTop: 10,
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
        color: 'rgb(187,112,25)',
    },

    image: {
        width: 200,
        height: 200,
        margin: 15
    },

    pixContainer: {
        backgroundColor: '#fff',
        width: Dimensions.get('window').width - 64,
        borderRadius: 10,
        marginTop: 10,
    },

    pixInfo: {
        padding: 8
    },
});

export default Checkout;