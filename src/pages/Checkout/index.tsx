import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker';
import AuthContext from '../../contexts/auth';
import api from '../../services/api'

interface Params {
    cotas: ICotas[];
}

interface ICotas {
    ID: number;
    id_rifa: string;
    id_usuario: string;
    num: string;
    valor: string;
    status: string;
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

const Checkout = () => {
    const navigation = useNavigation();
    const { signed, user, logar } = useContext(AuthContext);
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
    const [cotas, setCotas] = useState<ICotas[]>([{
        ID: 0,
        id_rifa: '',
        id_usuario: '',
        num: '',
        valor: '',
        status: '',
    }]);
    const [paymentMeth, setPaymentMeth] = useState<string>('0');

    useEffect(() => {
        async function getRifa() {
            setCotas(routeParams.cotas);
            const response = await api.get(`/rifas/${routeParams.cotas[0].id_rifa}`);
            setRifa(response.data[0]);
        }

        getRifa();
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToPayment() {
        if (paymentMeth === '1') {
            const total = calculatePrice();
            navigation.navigate('Pagamento', {
                total,
            });
        }
    }

    function calculatePrice() {
        return ((cotas.length * +cotas[0].valor) + ((cotas.length * +cotas[0].valor) * 0.01)).toFixed(2);
    }

    const handlePay = async () => {
        await api.post(`/users/${user?.id}/rifas/${rifa.ID}/cotas/comprar`, { data: cotas })
            .then(response => {
                if (response.status === 200) {
                    Alert.alert('Rifa comprada com sucesso!!!');
                    navigation.navigate('Rifa');
                }
            })
            .catch(err => {
                console.warn(err);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.detailContainer}>
                    <TouchableOpacity onPress={handleNavigateBack}>
                        <Icon name='arrow-left' size={20} color='#fb5b5a' />
                    </TouchableOpacity>
                    <Text style={styles.selectedItemstitle}>Números Selecionados</Text>
                    <View style={styles.selectedItemsContainer}>
                        {cotas.map(cota => (
                            <Text style={styles.selectedItems} key={cota.ID}>{cota.num}</Text>
                        ))}
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.fieldTitle}>Rifa - #{rifa.ID}</Text>
                        <Text style={styles.fieldContent}>{rifa.descricao}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.fieldTitle}>Rifador</Text>
                        <Text style={styles.fieldContent}>{rifa.id_usuario}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.fieldTitle}>Localização</Text>
                        <Text style={styles.fieldContent}>{rifa.cidade}, {rifa.uf}</Text>
                    </View>
                    <View style={[styles.field, { marginBottom: 5 }]}>
                        <Text style={styles.fieldTitle}>Informações para Pagamento</Text>
                    </View>
                    <View style={styles.paymentInfoContainer}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Quantidade de números:</Text>
                                <Text style={styles.paymentItem}>{cotas.length}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Valor Unitário:</Text>
                                <Text style={styles.paymentItem}>{(+cotas[0].valor).toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Taxa Operacional:</Text>
                                <Text style={styles.paymentItem}>{(cotas.length * 0.25).toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.paymentItem}>Valor Total:</Text>
                                <Text style={styles.paymentItem}>{((cotas.length * +cotas[0].valor) + (cotas.length * 0.25)).toFixed(2)}</Text>
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
        backgroundColor: '#34CB79',
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
});

export default Checkout;