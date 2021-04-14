import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { MainContainer, Title, HeaderCheckout } from './styles';
import AuthContext from '../../contexts/auth';
import IQuota from '../../models/Quota';
import api from '../../services/api'

interface Params {
    raffle: number;
    total: number;
    quotas: IQuota[];
    owner: string
}

interface IPaymentDTO {
    user: number | undefined;
    raffle: number;
    quotas: string;
    method: number;
    value: number;
    owner?: string;
}

const Payment = () => {
    const navigation = useNavigation();
    const { signed, user, logar } = useContext(AuthContext);
    const route = useRoute();

    const routeParams = route.params as Params;

    const [idPayment, setIdPayment] = useState('1');
    const [emailPayment, setEmailPayment] = useState('meuemail@gmail.com');
    const [descPayment, setDescPayment] = useState('Venda de produto digital');
    const [valuePayment, setValuePayment] = useState('0.00');
    const [showCheckout, setShowCheckout] = useState(true);

    useEffect(() => {
        setValuePayment(String(routeParams.total));
    }, []);

    function createDTO() {
        const toStringfy: string[] = [];
        routeParams.quotas.forEach(quota => {
            toStringfy.push(String(quota.num));
        });
        const dto = {} as IPaymentDTO;
        dto.user = user!.id;
        dto.raffle = routeParams.raffle;
        dto.quotas = toStringfy.join(',');
        dto.method = 1;
        dto.value = +valuePayment;
        dto.owner = routeParams.owner;
        return dto;
    }

    async function stateChange(state: any) {
        switch (state.title) {
            case 'success':
                setShowCheckout(false);
                const data = createDTO();
                try {
                    const responsePayment = await api.post('/payments/pay/confirmed', data);
                    if (responsePayment.status === 200) {
                        Alert.alert('Pagamento aprovado!', `Recebemos seu pagamento de ${valuePayment}`);
                        navigation.navigate('Rifa');
                    }
                } catch (error) {
                    console.log(error);
                }
                break;
            case 'pending':
                setShowCheckout(false);
                const dataPending = createDTO();
                try {
                    const responsePayment = await api.post('/payments/pay/pending', dataPending);
                    if (responsePayment.status === 200) {
                        Alert.alert('Pagamento pendente!', `Seu pagamento de ${valuePayment} está pendente de processamento, assim que for processado seguiremos com o pedido!`);
                        navigation.navigate('Rifa');
                    }
                } catch (error) {
                    console.log(error);
                }
                break;
            case 'failure':
                setShowCheckout(false);
                Alert.alert('Pagamento não aprovado!', 'Verifique os dados e tente novamente');
                break;
        }
    }

    function handleNavigateBack() {
        navigation.goBack();
    }

    return (
        <MainContainer>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <HeaderCheckout>
                    <TouchableOpacity onPress={() => handleNavigateBack()}>
                        <Icon name='arrow-left' size={20} color='#fff' />
                    </TouchableOpacity>
                    <Title>Pagamento do Pedido</Title>
                </HeaderCheckout>
                {showCheckout ?
                    <WebView
                        source={{ uri: `http://192.168.0.10:3333/payments/checkout/${idPayment}/${emailPayment}/${descPayment}/${valuePayment}` }}
                        onNavigationStateChange={state => stateChange(state)}
                        startInLoadingState={true}
                        renderLoading={() => <ActivityIndicator size='large' color='#fff' style={{ marginBottom: 15, paddingTop: 10 }}></ActivityIndicator>}
                    />
                    :
                    <></>
                }
            </View>
        </MainContainer>
    )
};

export default Payment;