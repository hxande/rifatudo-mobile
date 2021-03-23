import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { MainContainer, Title, HeaderCheckout } from './styles';
import AuthContext from '../../contexts/auth';
import api from '../../services/api'

interface Params {
    total: number;
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

interface IPaymentDTO {
    user: number | undefined;
    raffle: string;
    quotas: string;
    method: number;
    valor: number;
}

const Payment = () => {
    const navigation = useNavigation();
    const { signed, user, logar } = useContext(AuthContext);
    const route = useRoute();

    const routeParams = route.params as Params;

    const [idPagamento, setIdPagamento] = useState('1');
    const [emailPagamento, setEmailPagamento] = useState('meuemail@gmail.com');
    const [descricaoPagamento, setDescricaoPagamento] = useState('Venda de produto digital');
    const [vlrPagamento, setVlrPagamento] = useState('0.00');
    const [showCheckout, setShowCheckout] = useState(true);

    useEffect(() => {
        setVlrPagamento(String(routeParams.total));
    }, []);

    function createDTO() {
        const toStringfy: string[] = [];
        routeParams.cotas.forEach(cota => {
            toStringfy.push(cota.num);
        });
        const dto = {} as IPaymentDTO;
        dto.user = user?.id;
        dto.raffle = routeParams.cotas[0].id_rifa;
        dto.quotas = toStringfy.join(',');
        dto.method = 1;
        dto.valor = +vlrPagamento;
        return dto;
    }

    async function stateChange(state: any) {
        switch (state.title) {
            case 'success':
                setShowCheckout(false);
                const data = createDTO();
                try {
                    const response = await api.put(`/raffles/${routeParams.cotas[0].id_rifa}/quotas/status/2`, data);
                    if (response.status === 200) {
                        const responsePayment = await api.post('/payments/pay', data);
                        const responseStatement = api.post('/statements/types/1', data);
                        if (responsePayment.status === 200) {
                            Alert.alert('Pagamento aprovado!', `Recebemos seu pagamento de ${vlrPagamento}`);
                            navigation.navigate('Rifa');
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
                break;
            case 'pending':
                setShowCheckout(false);
                const dataPending = createDTO();
                try {
                    const response = await api.put(`/raffles/${routeParams.cotas[0].id_rifa}/quotas/status/1`, dataPending);
                    if (response.status === 200) {
                        const responsePayment = await api.post('/payments/pay', dataPending);
                        if (responsePayment.status === 200) {
                            Alert.alert('Pagamento pendente!', `Seu pagamento de ${vlrPagamento} está pendente de processamento, assim que for processado seguiremos com o pedido!`);
                            navigation.navigate('Rifa');
                        }
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
                        source={{ uri: `http://192.168.0.10:3333/payments/checkout/${idPagamento}/${emailPagamento}/${descricaoPagamento}/${vlrPagamento}` }}
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